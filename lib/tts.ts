/**
 * QVAC TTS wrapper — on-device text-to-speech via TTS Supertonic Q4.
 * Collects int16 PCM samples, writes a WAV file, and plays via expo-audio.
 * No audio or text is sent to any server.
 */

import { textToSpeech } from "@qvac/sdk";
import { File, Paths } from "expo-file-system";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import { loadTTSModel } from "./qvac";

const SAMPLE_RATE = 44100;
let currentPlayer: ReturnType<typeof createAudioPlayer> | null = null;

function buildWav(samples: number[]): Uint8Array {
  const dataSize = samples.length * 2; // int16 = 2 bytes per sample
  const buf = new ArrayBuffer(44 + dataSize);
  const v = new DataView(buf);
  const str = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i));
  };
  str(0, "RIFF");
  v.setUint32(4, 36 + dataSize, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);    // PCM
  v.setUint16(22, 1, true);    // mono
  v.setUint32(24, SAMPLE_RATE, true);
  v.setUint32(28, SAMPLE_RATE * 2, true); // byte rate
  v.setUint16(32, 2, true);    // block align
  v.setUint16(34, 16, true);   // bits per sample
  str(36, "data");
  v.setUint32(40, dataSize, true);
  for (let i = 0; i < samples.length; i++) {
    v.setInt16(44 + i * 2, samples[i], true);
  }
  return new Uint8Array(buf);
}

export async function speakResponse(text: string): Promise<void> {
  await stopSpeaking();

  const modelId = await loadTTSModel();
  const result = textToSpeech({ modelId, text, stream: false });
  const samples = await result.buffer;

  if (!samples || samples.length === 0) return;

  const wav = buildWav(samples);
  const file = new File(Paths.cache, "tts_output.wav");
  if (file.exists) file.delete();
  file.create();
  file.write(wav);

  await setAudioModeAsync({ playsInSilentMode: true });
  const player = createAudioPlayer({ uri: file.uri });
  currentPlayer = player;
  player.play();

  await new Promise<void>((resolve) => {
    const emitter = player as unknown as {
      addListener: (
        event: "playbackStatusUpdate",
        listener: (status: { didJustFinish: boolean }) => void
      ) => { remove: () => void };
    };
    const subscription = emitter.addListener("playbackStatusUpdate", (status) => {
      if (status.didJustFinish) {
        subscription.remove();
        resolve();
      }
    });
  });

  player.remove();
  currentPlayer = null;
}

export async function stopSpeaking(): Promise<void> {
  if (!currentPlayer) return;
  try {
    currentPlayer.pause();
    currentPlayer.remove();
  } catch {}
  currentPlayer = null;
}
