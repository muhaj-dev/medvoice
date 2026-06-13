/**
 * QVAC Parakeet transcription.
 *
 * Parakeet needs 16 kHz mono PCM and CANNOT decode compressed audio (m4a/aac).
 * We capture raw PCM from the mic (hooks/useVoiceTranscription), wrap it in a
 * WAV container here, and batch-transcribe that WAV with the Parakeet TDT model.
 */

import { transcribe, transcribeStream } from "@qvac/sdk";
import { File, Paths } from "expo-file-system";
import { loadParakeetModel } from "./qvac";

/**
 * Wrap raw signed-16-bit little-endian mono PCM in a WAV container and write it
 * to a cache file. Returns the file URI.
 */
export function pcmToWavFile(
  pcm: Uint8Array,
  sampleRate: number,
  channels = 1
): string {
  const dataSize = pcm.byteLength;
  const buf = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buf);
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true); // byte rate
  view.setUint16(32, channels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  new Uint8Array(buf, 44).set(pcm);

  const file = new File(Paths.cache, "recording.wav");
  if (file.exists) file.delete();
  file.create();
  file.write(new Uint8Array(buf));
  return file.uri;
}

/**
 * Transcribe a 16 kHz mono WAV file with Parakeet.
 * The native engine reads a filesystem path, so strip the file:// scheme.
 *
 * @param audioUri   - WAV file URI (from pcmToWavFile)
 * @param onProgress - Optional model download progress 0–100 (first run only)
 */
export async function transcribeAudioFile(
  audioUri: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const modelId = await loadParakeetModel(onProgress);
  const path = audioUri.replace(/^file:\/\//, "");
  const result = await transcribe({ modelId, audioChunk: path });
  const text = (result ?? "").trim();
  console.log("[transcription] result:", JSON.stringify(text));
  return text;
}

/**
 * Live streaming transcription.
 *
 * Opens a bidirectional Parakeet session: feed mic PCM chunks with write(), and
 * the model yields finalized text segments as its VAD detects complete speech.
 * We accumulate those segments into a running transcript and report it through
 * onText so the UI can show words as the user speaks — all on-device.
 *
 * Returns a handle:
 *  - write(chunk): push raw 16 kHz mono s16le PCM (same format as the WAV path)
 *  - stop(): signal end-of-audio, drain remaining text, and resolve with the
 *            final full transcript
 *  - destroy(): tear down without waiting (used on cancel/unmount)
 */
export type LiveTranscription = {
  write: (chunk: Uint8Array) => void;
  stop: () => Promise<string>;
  destroy: () => void;
};

export async function startLiveTranscription(
  modelId: string,
  onText: (fullText: string) => void
): Promise<LiveTranscription> {
  const session = await transcribeStream({ modelId });

  const segments: string[] = [];
  // Drain the session in the background, appending each finalized segment.
  const drained = (async () => {
    try {
      for await (const segment of session) {
        const piece = (segment ?? "").trim();
        if (!piece) continue;
        segments.push(piece);
        onText(segments.join(" "));
      }
    } catch (e) {
      console.error("[transcription] live stream error", e);
    }
  })();

  return {
    write: (chunk) => {
      try {
        session.write(chunk);
      } catch (e) {
        console.error("[transcription] live write failed", e);
      }
    },
    stop: async () => {
      try {
        session.end();
      } catch {}
      await drained;
      return segments.join(" ").trim();
    },
    destroy: () => {
      try {
        session.destroy();
      } catch {}
    },
  };
}
