/**
 * On-device UI translation, powered by QVAC NMT (Bergamot en→xx).
 *
 * English (constants/strings.ts) is the source of truth. The first time a user
 * selects another language we translate every string with QVAC's translation
 * model and cache the result in AsyncStorage, so it's a one-time cost and works
 * fully offline afterwards. Nothing is sent to any server.
 *
 * Components never call this directly — they use the useTranslation() hook,
 * which subscribes to the cache and re-renders when a catalog becomes ready.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { translate } from "@qvac/sdk";
import { EN_STRINGS, STRING_KEYS, type Lang, type StringKey } from "@/constants/strings";
import { loadTranslationModel } from "@/lib/qvac";
import { supportsLlamaCppModels } from "@/lib/device";

type Catalog = Record<string, string>;

// Bump when EN_STRINGS keys/values change so stale cached catalogs are rebuilt.
const CACHE_VERSION = "v1";
const cacheKey = (lang: Lang) => `@medvoice:i18n:${CACHE_VERSION}:${lang}`;

// In-memory catalogs. English is always present; others fill in once translated.
const memCache: Partial<Record<Lang, Catalog>> = { en: { ...EN_STRINGS } };
const inFlight: Partial<Record<Lang, Promise<void>>> = {};
const translating = new Set<Lang>();
const listeners = new Set<() => void>();

// Monotonic version bumped on every change so useSyncExternalStore snapshots
// differ and subscribed components re-render.
let version = 0;

function emit() {
  version++;
  listeners.forEach((l) => l());
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Snapshot for useSyncExternalStore — changes whenever a catalog updates. */
export function getVersion(): number {
  return version;
}

/** True while a language's catalog is being translated (drives a UI spinner). */
export function isTranslating(lang: Lang): boolean {
  return translating.has(lang);
}

/** Look up one string. Falls back to English if the catalog isn't ready yet. */
export function getString(lang: Lang, key: StringKey): string {
  return memCache[lang]?.[key] ?? EN_STRINGS[key];
}

function hasAllKeys(c: Catalog): boolean {
  return STRING_KEYS.every((k) => typeof c[k] === "string" && c[k].length > 0);
}

/**
 * Make sure the catalog for `lang` is loaded (from cache) or translated (via
 * QVAC). Safe to call repeatedly — concurrent calls share one promise and a
 * ready catalog short-circuits. English is a no-op.
 */
export function ensureCatalog(lang: Lang): Promise<void> {
  if (lang === "en" || memCache[lang]) return Promise.resolve();
  if (inFlight[lang]) return inFlight[lang]!;

  const run = (async () => {
    // 1. Try the on-device cache from a previous run.
    try {
      const raw = await AsyncStorage.getItem(cacheKey(lang));
      if (raw) {
        const cached = JSON.parse(raw) as Catalog;
        if (hasAllKeys(cached)) {
          memCache[lang] = cached;
          emit();
          return;
        }
      }
    } catch {
      // ignore corrupt cache — fall through to (re)translate
    }

    // 2. Translate with QVAC NMT. The native engine isn't safe on old Android
    //    (same constraint as the analysis models), so leave the UI in English
    //    there rather than risk a native crash.
    if (!supportsLlamaCppModels()) return;

    translating.add(lang);
    emit();
    try {
      const catalog = await translateCatalog(lang);
      memCache[lang] = catalog;
      AsyncStorage.setItem(cacheKey(lang), JSON.stringify(catalog)).catch(() => {});
    } catch (e) {
      console.error(`[i18n] translation to ${lang} failed:`, e);
      // English fallback remains in effect.
    } finally {
      translating.delete(lang);
      emit();
    }
  })();

  inFlight[lang] = run.finally(() => {
    inFlight[lang] = undefined;
  });
  return inFlight[lang]!;
}

// Translate every English string one at a time through a single loaded NMT
// model. (The client aggregates a translation into one text promise, so we
// translate per-string rather than batching to keep results unambiguous.)
async function translateCatalog(lang: Lang): Promise<Catalog> {
  const modelId = await loadTranslationModel(lang);
  const catalog: Catalog = {};
  for (const key of STRING_KEYS) {
    const source = EN_STRINGS[key];
    try {
      const result = translate({ modelId, text: source, modelType: "nmt", stream: false });
      const out = (await result.text).trim();
      catalog[key] = out.length > 0 ? out : source;
    } catch {
      catalog[key] = source; // keep English for any string that fails
    }
  }
  return catalog;
}
