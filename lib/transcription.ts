/**
 * QVAC Parakeet transcription helpers.
 *
 * Parakeet needs 16 kHz mono PCM — it cannot decode compressed audio (m4a/aac),
 * so we transcribe LIVE from the mic's raw PCM stream via createLiveSession()
 * rather than transcribing a recorded compressed file.
 */

import { transcribe, transcribeStream, type TranscribeStreamSession } from "@qvac/sdk";
import { loadParakeetModel } from "./qvac";

/**
 * Open a live streaming transcription session on the Parakeet model.
 * Feed it 16 kHz mono s16le PCM via session.write(Uint8Array); read transcribed
 * text by iterating the session; call session.end() when recording stops.
 */
export async function createLiveSession(): Promise<TranscribeStreamSession> {
  const modelId = await loadParakeetModel();
  return transcribeStream({ modelId });
}

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
