/**
 * QVAC TTS wrapper — on-device text-to-speech via TTS Supertonic Q4.
 * No audio or text is sent to any server.
 */

import { speak } from "@qvac/sdk";
import { loadTTSModel } from "./qvac";

let stopHandle: (() => void) | null = null;

export async function speakResponse(text: string): Promise<void> {
  stopSpeaking();
  const modelId = await loadTTSModel();
  const handle = speak({ modelId, text });
  stopHandle = () => handle.cancel?.();
  await handle.complete;
  stopHandle = null;
}

export function stopSpeaking(): void {
  stopHandle?.();
  stopHandle = null;
}
