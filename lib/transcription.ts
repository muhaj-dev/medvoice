/**
 * QVAC Parakeet transcription helper.
 * Parakeet TDT 0.6B — batch transcription of a recorded audio file.
 * The audio file URI comes from expo-audio after the user taps Stop.
 */

import { transcribe } from "@qvac/sdk";
import { loadParakeetModel } from "./qvac";

/**
 * @param audioUri  - File URI from expo-audio (e.g. file:///var/mobile/...)
 * @param onProgress - Optional download progress 0–100 (first run only)
 */
export async function transcribeAudioFile(
  audioUri: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const modelId = await loadParakeetModel(onProgress);

  const result = await transcribe({
    modelId,
    audioChunk: audioUri,
  });

  return result ?? "";
}
