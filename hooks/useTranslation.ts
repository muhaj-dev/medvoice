/**
 * Localization hook. Returns `t(key)` for the user's current language, plus the
 * active language code and whether its catalog is still translating.
 *
 *   const { t } = useTranslation();
 *   <Text>{t("home.recentEntries")}</Text>
 *
 * Re-renders automatically when the language changes or a freshly translated
 * catalog becomes ready (see lib/i18n.ts).
 */
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ensureCatalog, getString, getVersion, isTranslating, subscribe } from "@/lib/i18n";
import type { StringKey } from "@/constants/strings";

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);

  // Re-render when any catalog updates (translation finished / cache loaded).
  useSyncExternalStore(subscribe, getVersion, getVersion);

  // Kick off translation for the current language if it isn't ready yet.
  useEffect(() => {
    void ensureCatalog(language);
  }, [language]);

  const t = useCallback(
    (key: StringKey) => getString(language, key),
    [language]
  );

  return { t, language, translating: isTranslating(language) };
}
