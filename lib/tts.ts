/**
 * QVAC TTS wrapper — on-device text-to-speech via TTS Supertonic Q4.
 * No audio or text is sent to any server.
 */

import { textToSpeech } from "@qvac/sdk";
import { loadTTSModel } from "./qvac";

let cancelCurrent: (() => void) | null = null;

export async function speakResponse(text: string): Promise<void> {
  stopSpeaking();
  const modelId = await loadTTSModel();
  const result = textToSpeech({ modelId, text });
  cancelCurrent = () => result.done.catch(() => {});
  await result.done;
  cancelCurrent = null;
}

export function stopSpeaking(): void {
  cancelCurrent?.();
  cancelCurrent = null;
}
