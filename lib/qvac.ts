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

// ── In-memory model IDs (null until loaded) ───────────────────────────────
let parakeetModelId: string | null = null;
let medgemmaModelId: string | null = null;
let embeddingModelId: string | null = null;
let ttsModelId: string | null = null;

// ── Parakeet — transcription (speech-to-text) ─────────────────────────────
export async function loadParakeetModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (parakeetModelId) return parakeetModelId;

  parakeetModelId = await loadModel({
    modelSrc: PARAKEET_TDT_0_6B_V3_Q8_0,
    modelType: "parakeet",
    onProgress: ({ percentage }) => {
      if (onProgress && typeof percentage === "number") {
        onProgress(Math.round(percentage));
      }
    },
  });

  return parakeetModelId;
}

// ── MedGemma — health analysis (LLM) ─────────────────────────────────────
export async function loadMedGemmaModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (medgemmaModelId) return medgemmaModelId;

  medgemmaModelId = await loadModel({
    modelSrc: MEDGEMMA_4B_IT_Q4_1,
    modelType: "llm",
    onProgress: ({ percentage }) => {
      if (onProgress && typeof percentage === "number") {
        onProgress(Math.round(percentage));
      }
    },
  });

  return medgemmaModelId;
}

// ── EmbeddingGemma — semantic search ──────────────────────────────────────
export async function loadEmbeddingModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (embeddingModelId) return embeddingModelId;

  embeddingModelId = await loadModel({
    modelSrc: EMBEDDINGGEMMA_300M_Q8_0,
    modelType: "embed",
    onProgress: ({ percentage }) => {
      if (onProgress && typeof percentage === "number") {
        onProgress(Math.round(percentage));
      }
    },
  });

  return embeddingModelId;
}

// ── TTS Supertonic — read-aloud ───────────────────────────────────────────
export async function loadTTSModel(
  onProgress?: (pct: number) => void
): Promise<string> {
  if (ttsModelId) return ttsModelId;

  ttsModelId = await loadModel({
    modelSrc: TTS_EN_SUPERTONIC_Q4_0,
    onProgress: ({ percentage }) => {
      if (onProgress && typeof percentage === "number") {
        onProgress(Math.round(percentage));
      }
    },
  });

  return ttsModelId;
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
