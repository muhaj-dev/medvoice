/**
 * QVAC SDK — model download + on-demand loading.
 *
 * Two-phase strategy so the app runs on low-RAM phones (e.g. 4 GB):
 *
 *   1. preloadAllModels() DOWNLOADS every model to disk via downloadAsset().
 *      Downloading uses almost no RAM — it just caches the files — so this is
 *      safe to do for all models at boot. It drives the boot progress UI.
 *
 *   2. loadXModel() LOADS one model into RAM on demand, and evicts the others
 *      first (evictExcept), so only ONE model is resident at a time. Peak RAM is
 *      the size of a single model, not the sum of all of them.
 *
 * Why this matters: loadModel() keeps a model resident after loading. Loading
 * all of them (even sequentially) leaves ~2.3 GB of weights in memory at once,
 * which the OS OOM-killer terminates on a 4 GB device — the "crash at the Nth
 * model". Keeping only one resident fixes that. The record→analyze pipeline
 * loads parakeet → embedding → analysis in turn, each evicting the previous,
 * all behind the processing screen's step UI, so the churn is invisible.
 *
 * Sizes (approx download): Parakeet 0.6B ~750 MB · Qwen3 1.7B ~1.1 GB (default
 * analysis) / MedGemma 4B ~2.5 GB ("4B" setting) · EmbeddingGemma 300M ~330 MB
 * · TTS Supertonic ~132 MB. Analysis model is selectable in Settings → AI Model.
 *
 * Note: the llama.cpp models (analysis + embedding) require Android 12+ / arm64;
 * older devices crash the native engine at init regardless of this strategy.
 */

import {
  loadModel,
  unloadModel,
  downloadAsset,
  suspend,
  resume,
  PARAKEET_TDT_0_6B_V3_Q8_0,
  MEDGEMMA_4B_IT_Q4_1,
  QWEN3_1_7B_INST_Q4,
  EMBEDDINGGEMMA_300M_Q8_0,
  TTS_EN_SUPERTONIC_Q4_0,
} from "@qvac/sdk";
import { useModelStore, type ModelName } from "@/store/useModelStore";
import { useSettingsStore, type ModelSize } from "@/store/useSettingsStore";
import { supportsLlamaCppModels } from "@/lib/device";

type AssetSrc = Parameters<typeof downloadAsset>[0]["assetSrc"];

// ── Resident model IDs — at most ONE is non-null at a time (after eviction) ──
let parakeetModelId: string | null = null;
let medgemmaModelId: string | null = null;
let medgemmaLoadedSize: ModelSize | null = null; // size of the resident analysis model
let embeddingModelId: string | null = null;
let ttsModelId: string | null = null;

// In-flight load promises — prevent duplicate concurrent loads of one model.
let parakeetPromise: Promise<string> | null = null;
let medgemmaPromise: Promise<string> | null = null;
let embeddingPromise: Promise<string> | null = null;
let ttsPromise: Promise<string> | null = null;

const analysisSrc = (size: ModelSize): AssetSrc =>
  size === "4b" ? MEDGEMMA_4B_IT_Q4_1 : QWEN3_1_7B_INST_Q4;

const pctOf = (percentage: number | undefined) =>
  typeof percentage === "number" ? Math.round(percentage) : 0;

// Unload every resident model except `keep`, so only one stays in RAM.
async function evictExcept(keep: ModelName): Promise<void> {
  const tasks: Promise<unknown>[] = [];
  if (keep !== "parakeet" && parakeetModelId) {
    tasks.push(unloadModel({ modelId: parakeetModelId }).catch(() => {}));
    parakeetModelId = null;
  }
  if (keep !== "medgemma" && medgemmaModelId) {
    tasks.push(unloadModel({ modelId: medgemmaModelId }).catch(() => {}));
    medgemmaModelId = null;
    medgemmaLoadedSize = null;
  }
  if (keep !== "embedding" && embeddingModelId) {
    tasks.push(unloadModel({ modelId: embeddingModelId }).catch(() => {}));
    embeddingModelId = null;
  }
  if (keep !== "tts" && ttsModelId) {
    tasks.push(unloadModel({ modelId: ttsModelId }).catch(() => {}));
    ttsModelId = null;
  }
  await Promise.all(tasks);
}

// ── Parakeet — transcription (speech-to-text) ─────────────────────────────
export function loadParakeetModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (parakeetModelId) return Promise.resolve(parakeetModelId);
  if (parakeetPromise) return parakeetPromise;

  parakeetPromise = (async () => {
    await evictExcept("parakeet");
    return loadModel({
      modelSrc: PARAKEET_TDT_0_6B_V3_Q8_0,
      modelType: "parakeet-transcription",
      onProgress: ({ percentage }) => onProgress?.(pctOf(percentage)),
    });
  })()
    .then((id) => {
      parakeetModelId = id;
      parakeetPromise = null;
      return id;
    })
    .catch((err) => {
      parakeetPromise = null;
      console.error("[qvac] parakeet load failed:", err);
      throw err;
    });

  return parakeetPromise;
}

// ── Health analysis (LLM) — Qwen3 1.7B (default) or MedGemma 4B ───────────
// Model is chosen from Settings → AI Model. Switching the setting unloads the
// stale model and loads the new one on the next call (no app restart needed).
export function loadMedGemmaModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  // Hard guard: on Android < 12 the llama.cpp engine crashes the whole app
  // natively at init. Throwing here instead routes callers to their JS
  // fallbacks (local analysis summary, keyword search).
  if (!supportsLlamaCppModels())
    return Promise.reject(new Error("Analysis model requires Android 12+"));

  const size = useSettingsStore.getState().modelSize;

  if (medgemmaModelId && medgemmaLoadedSize === size)
    return Promise.resolve(medgemmaModelId);
  if (medgemmaPromise && medgemmaLoadedSize === size) return medgemmaPromise;

  // A load for a DIFFERENT size may be in flight — serialize behind it so two
  // analysis models never load concurrently (they'd fight over memory/eviction).
  const prevLoad = medgemmaPromise;
  medgemmaLoadedSize = size;
  const isQwen = size !== "4b";

  // ctx_size caps the KV-cache (without it llama.cpp allocates the model's full
  // ~32K context and OOMs right after download). gpu_layers/device cpu avoids the
  // mobile GPU backend. reasoning_budget 0 disables Qwen3's <think> output.
  const modelConfig: Record<string, unknown> = {
    ctx_size: 4096,
    gpu_layers: 0,
    device: "cpu",
  };
  if (isQwen) modelConfig.reasoning_budget = 0;

  medgemmaPromise = (async () => {
    if (prevLoad) {
      try { await prevLoad; } catch {}
    }
    await evictExcept("medgemma");
    // A different-size analysis model may still be resident — unload it too.
    if (medgemmaModelId) {
      const stale = medgemmaModelId;
      medgemmaModelId = null;
      await unloadModel({ modelId: stale }).catch(() => {});
    }
    return loadModel({
      modelSrc: analysisSrc(size),
      modelType: "llamacpp-completion",
      modelConfig,
      onProgress: ({ percentage }) => onProgress?.(pctOf(percentage)),
    });
  })()
    .then((id) => {
      medgemmaModelId = id;
      medgemmaPromise = null;
      return id;
    })
    .catch((err) => {
      medgemmaPromise = null;
      medgemmaLoadedSize = null;
      console.error(`[qvac] analysis model (${size}) load failed:`, err);
      throw err;
    });

  return medgemmaPromise;
}

// ── EmbeddingGemma — semantic search ──────────────────────────────────────
export function loadEmbeddingModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  // Same native-crash guard as the analysis model — see loadMedGemmaModel.
  if (!supportsLlamaCppModels())
    return Promise.reject(new Error("Embedding model requires Android 12+"));

  if (embeddingModelId) return Promise.resolve(embeddingModelId);
  if (embeddingPromise) return embeddingPromise;

  embeddingPromise = (async () => {
    await evictExcept("embedding");
    return loadModel({
      modelSrc: EMBEDDINGGEMMA_300M_Q8_0,
      modelType: "llamacpp-embedding",
      modelConfig: { gpuLayers: 0, device: "cpu", pooling: "mean", batchSize: 512 },
      onProgress: ({ percentage }) => onProgress?.(pctOf(percentage)),
    });
  })()
    .then((id) => {
      embeddingModelId = id;
      embeddingPromise = null;
      return id;
    })
    .catch((err) => {
      embeddingPromise = null;
      console.error("[qvac] embedding load failed:", err);
      throw err;
    });

  return embeddingPromise;
}

// ── TTS Supertonic — read-aloud ───────────────────────────────────────────
export function loadTTSModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (ttsModelId) return Promise.resolve(ttsModelId);
  if (ttsPromise) return ttsPromise;

  ttsPromise = (async () => {
    await evictExcept("tts");
    return loadModel({
      modelSrc: TTS_EN_SUPERTONIC_Q4_0,
      modelType: "tts-ggml",
      modelConfig: { ttsEngine: "supertonic", language: "en" },
      onProgress: ({ percentage }) => onProgress?.(pctOf(percentage)),
    });
  })()
    .then((id) => {
      ttsModelId = id;
      ttsPromise = null;
      return id;
    })
    .catch((err) => {
      ttsPromise = null;
      console.error("[qvac] tts load failed:", err);
      throw err;
    });

  return ttsPromise;
}

// ── Boot preload — DOWNLOAD only (no RAM load) ─────────────────────────────
// Caches every model file to disk so on-demand loads are fast. Downloading uses
// almost no memory, so it's safe to fetch all of them. Drives the boot UI via
// the model store; the store's status therefore means "downloaded", and the
// actual RAM load happens lazily/one-at-a-time when each feature runs.
let preloadStarted = false;

async function downloadOne(name: ModelName, src: AssetSrc): Promise<void> {
  useModelStore.getState().setModelState(name, { status: "loading", progress: 0 });
  try {
    await downloadAsset({
      assetSrc: src,
      onProgress: ({ percentage }) =>
        useModelStore
          .getState()
          .setModelState(name, { status: "loading", progress: pctOf(percentage) }),
    });
    useModelStore.getState().setModelState(name, { status: "ready" });
  } catch (err) {
    console.error(`[qvac] ${name} download failed:`, err);
    useModelStore.getState().setModelState(name, { status: "error" });
  }
}

// Re-download only the models that failed (store status === "error"). Used by
// the launch gate's RETRY button. Reuses the same sequential, low-RAM strategy.
export async function retryModelDownloads(): Promise<void> {
  const store = useModelStore.getState();
  const size = useSettingsStore.getState().modelSize;
  const srcByName: Record<ModelName, AssetSrc> = {
    parakeet: PARAKEET_TDT_0_6B_V3_Q8_0,
    medgemma: analysisSrc(size),
    embedding: EMBEDDINGGEMMA_300M_Q8_0,
    tts: TTS_EN_SUPERTONIC_Q4_0,
  };
  // Never re-download llama.cpp models on devices where they can't load.
  const llamaOk = supportsLlamaCppModels();
  const names: ModelName[] = ["parakeet", "medgemma", "embedding", "tts"];
  for (const name of names) {
    if (!llamaOk && (name === "medgemma" || name === "embedding")) continue;
    if (store[name].status === "error") {
      await downloadOne(name, srcByName[name]);
    }
  }
}

export async function preloadAllModels(): Promise<void> {
  if (preloadStarted) return;
  preloadStarted = true;

  // Load the saved model-size preference BEFORE choosing the analysis model to
  // download — otherwise a rehydrated "4b" preference is missed and we'd
  // download the default 1.7B at startup (the right model still loads on demand,
  // but the pre-download would be wasted).
  try {
    await useSettingsStore.getState().loadFromStorage();
  } catch {}

  // On Android < 12 the llama.cpp models can never load (native crash), so
  // don't waste ~1.4 GB downloading them. Marking them "error" sends the gate
  // straight to the "CONTINUE WITHOUT AI" degraded path.
  const llamaOk = supportsLlamaCppModels();
  const skipUnsupported = (name: ModelName) =>
    useModelStore.getState().setModelState(name, { status: "error", progress: 0 });

  // Sequential downloads, low memory. One bad download doesn't block the rest.
  // CORE models first — voice + analysis are all the record→analyze loop needs,
  // so the launch gate opens after ~1.85 GB instead of ~2.3 GB.
  const size = useSettingsStore.getState().modelSize;
  await downloadOne("parakeet", PARAKEET_TDT_0_6B_V3_Q8_0);
  if (llamaOk) await downloadOne("medgemma", analysisSrc(size));
  else skipUnsupported("medgemma");

  // Search (embedding) and read-aloud (TTS) finish in the BACKGROUND after the
  // user is already in the app. Both features degrade gracefully until then:
  // search falls back to keywords, TTS load fails quietly.
  void (async () => {
    if (llamaOk) await downloadOne("embedding", EMBEDDINGGEMMA_300M_Q8_0);
    else skipUnsupported("embedding");
    await downloadOne("tts", TTS_EN_SUPERTONIC_Q4_0);
  })();
}

// ── Lifecycle ─────────────────────────────────────────────────────────────

export async function unloadAllModels(): Promise<void> {
  const unloads: Promise<unknown>[] = [];
  if (parakeetModelId) {
    unloads.push(unloadModel({ modelId: parakeetModelId }).catch(() => {}));
    parakeetModelId = null;
  }
  if (medgemmaModelId) {
    unloads.push(unloadModel({ modelId: medgemmaModelId }).catch(() => {}));
    medgemmaModelId = null;
    medgemmaLoadedSize = null;
  }
  if (embeddingModelId) {
    unloads.push(unloadModel({ modelId: embeddingModelId }).catch(() => {}));
    embeddingModelId = null;
  }
  if (ttsModelId) {
    unloads.push(unloadModel({ modelId: ttsModelId }).catch(() => {}));
    ttsModelId = null;
  }
  await Promise.all(unloads);
}

// Call when app goes to background to free GPU/CPU memory
export async function suspendQvac(): Promise<void> {
  await suspend();
}

// Call when app returns to foreground
export async function resumeQvac(): Promise<void> {
  await resume();
}
