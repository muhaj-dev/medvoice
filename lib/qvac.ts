/**
 * QVAC SDK — model loading and lifecycle helpers.
 *
 * Models download from the QVAC/HuggingFace registry on first use and are
 * cached locally. Subsequent loads are instant (cache hit).
 *
 * Sizes (approximate download):
 *   Parakeet TDT 0.6B Q8 — ~750 MB  (transcription)
 *   MedGemma 4B Q4_1     — ~2.5 GB  (health analysis)
 *   EmbeddingGemma 300M  — ~330 MB  (semantic search)
 *   TTS Supertonic Q4    — ~132 MB  (read-aloud)
 */

import {
  loadModel,
  unloadModel,
  suspend,
  resume,
  PARAKEET_TDT_0_6B_V3_Q8_0,
  MEDGEMMA_4B_IT_Q4_1,
  EMBEDDINGGEMMA_300M_Q8_0,
  TTS_EN_SUPERTONIC_Q4_0,
} from "@qvac/sdk";
import { useModelStore } from "@/store/useModelStore";

// ── In-memory model IDs and in-flight promises ────────────────────────────
// Promise singletons prevent concurrent callers from triggering duplicate downloads.
let parakeetModelId: string | null = null;
let medgemmaModelId: string | null = null;
let embeddingModelId: string | null = null;
let ttsModelId: string | null = null;

let parakeetPromise: Promise<string> | null = null;
let medgemmaPromise: Promise<string> | null = null;
let embeddingPromise: Promise<string> | null = null;
let ttsPromise: Promise<string> | null = null;

// ── Parakeet — transcription (speech-to-text) ─────────────────────────────
export async function loadParakeetModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (parakeetModelId) return parakeetModelId;
  if (parakeetPromise) return parakeetPromise;

  useModelStore.getState().setModelState('parakeet', { status: 'loading', progress: 0 });

  parakeetPromise = loadModel({
    modelSrc: PARAKEET_TDT_0_6B_V3_Q8_0,
    modelType: "parakeet",
    onProgress: ({ percentage }) => {
      const pct = typeof percentage === "number" ? Math.round(percentage) : 0;
      useModelStore.getState().setModelState('parakeet', { status: 'loading', progress: pct });
      onProgress?.(pct);
    },
  }).then((id) => {
    parakeetModelId = id;
    parakeetPromise = null;
    useModelStore.getState().setModelState('parakeet', { status: 'ready', id });
    return id;
  }).catch((err) => {
    parakeetPromise = null;
    useModelStore.getState().setModelState('parakeet', { status: 'error' });
    throw err;
  });

  return parakeetPromise;
}

// ── MedGemma — health analysis (LLM) ─────────────────────────────────────
export async function loadMedGemmaModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (medgemmaModelId) return medgemmaModelId;
  if (medgemmaPromise) return medgemmaPromise;

  useModelStore.getState().setModelState('medgemma', { status: 'loading', progress: 0 });

  medgemmaPromise = loadModel({
    modelSrc: MEDGEMMA_4B_IT_Q4_1,
    modelType: "llm",
    onProgress: ({ percentage }) => {
      const pct = typeof percentage === "number" ? Math.round(percentage) : 0;
      useModelStore.getState().setModelState('medgemma', { status: 'loading', progress: pct });
      onProgress?.(pct);
    },
  }).then((id) => {
    medgemmaModelId = id;
    medgemmaPromise = null;
    useModelStore.getState().setModelState('medgemma', { status: 'ready', id });
    return id;
  }).catch((err) => {
    medgemmaPromise = null;
    useModelStore.getState().setModelState('medgemma', { status: 'error' });
    throw err;
  });

  return medgemmaPromise;
}

// ── EmbeddingGemma — semantic search ──────────────────────────────────────
export async function loadEmbeddingModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (embeddingModelId) return embeddingModelId;
  if (embeddingPromise) return embeddingPromise;

  useModelStore.getState().setModelState('embedding', { status: 'loading', progress: 0 });

  embeddingPromise = loadModel({
    modelSrc: EMBEDDINGGEMMA_300M_Q8_0,
    modelType: "embed",
    onProgress: ({ percentage }) => {
      const pct = typeof percentage === "number" ? Math.round(percentage) : 0;
      useModelStore.getState().setModelState('embedding', { status: 'loading', progress: pct });
      onProgress?.(pct);
    },
  }).then((id) => {
    embeddingModelId = id;
    embeddingPromise = null;
    useModelStore.getState().setModelState('embedding', { status: 'ready', id });
    return id;
  }).catch((err) => {
    embeddingPromise = null;
    useModelStore.getState().setModelState('embedding', { status: 'error' });
    throw err;
  });

  return embeddingPromise;
}

// ── TTS Supertonic — read-aloud ───────────────────────────────────────────
export async function loadTTSModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (ttsModelId) return ttsModelId;
  if (ttsPromise) return ttsPromise;

  useModelStore.getState().setModelState('tts', { status: 'loading', progress: 0 });

  ttsPromise = loadModel({
    modelSrc: TTS_EN_SUPERTONIC_Q4_0,
    onProgress: ({ percentage }) => {
      const pct = typeof percentage === "number" ? Math.round(percentage) : 0;
      useModelStore.getState().setModelState('tts', { status: 'loading', progress: pct });
      onProgress?.(pct);
    },
  }).then((id) => {
    ttsModelId = id;
    ttsPromise = null;
    useModelStore.getState().setModelState('tts', { status: 'ready', id });
    return id;
  }).catch((err) => {
    ttsPromise = null;
    useModelStore.getState().setModelState('tts', { status: 'error' });
    throw err;
  });

  return ttsPromise;
}

// ── Lifecycle ─────────────────────────────────────────────────────────────

export async function unloadAllModels(): Promise<void> {
  const unloads: Promise<void>[] = [];
  if (parakeetModelId) {
    unloads.push(unloadModel({ modelId: parakeetModelId }));
    parakeetModelId = null;
  }
  if (medgemmaModelId) {
    unloads.push(unloadModel({ modelId: medgemmaModelId }));
    medgemmaModelId = null;
  }
  if (embeddingModelId) {
    unloads.push(unloadModel({ modelId: embeddingModelId }));
    embeddingModelId = null;
  }
  if (ttsModelId) {
    unloads.push(unloadModel({ modelId: ttsModelId }));
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
