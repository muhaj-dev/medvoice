/**
 * QVAC TTS wrapper — on-device text-to-speech via TTS Supertonic Q4.
 * No audio or text ever leaves the device.
 *
 * Strategy: synthesize EVERY sentence up front (behind the button's loading
 * state), then play the small per-sentence clips back to back. This avoids both
 * failure modes we hit:
 *   - One big clip → the device audio decoder underruns on the long WAV, then
 *     speeds up to catch up (an audible "speed-up" glitch mid-reading).
 *   - Streaming one sentence at a time → multi-second dead air while the NEXT
 *     sentence is still synthesizing (on-device TTS is slower than real time).
 * Pre-synthesizing all clips first means playback never waits on the model, and
 * small clips never trigger the decoder glitch. The only pauses are the short,
 * natural ones at sentence boundaries — which help an older listener keep up.
 *
 * Call prewarmTTS() when a screen with a Read Aloud button mounts so the model
 * is already resident in RAM by the time the user taps — that keeps the upfront
 * loading wait to just synthesis time, not synthesis + model load.
 */

import { textToSpeech } from "@qvac/sdk";
import { File, Paths } from "expo-file-system";
import { createAudioPlayer, setAudioModeAsync, type AudioStatus } from "expo-audio";
import { loadTTSModel } from "./qvac";

// Playback rate of the synthesized PCM (set per user preference). Higher plays
// faster/higher-pitched, lower plays slower/drawled.
const SAMPLE_RATE = 44100;

let currentPlayer: ReturnType<typeof createAudioPlayer> | null = null;
// Bumped by stopSpeaking() (and the start of each speakResponse) to invalidate
// any sentence loop still in flight — its samples are dropped, its audio stops.
let activeRun = 0;
// Resolver for the clip currently awaiting playback completion. stopSpeaking()
// calls it so tearing the player down mid-clip doesn't leave that promise (and
// the speak loop awaiting it) hanging when no didJustFinish ever arrives.
let currentPlayResolve: (() => void) | null = null;

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

// Split into sentence-sized chunks. Each is synthesized and played as its own
// small clip, so no single WAV is large enough to trip the decoder speed-up
// glitch. Falls back to the whole string if there's no sentence punctuation.
// Exported so on-screen text can be split the SAME way for read-along
// highlighting (the indices line up with the spoken clips).
export function splitSentences(text: string): string[] {
  const parts = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text.trim()].filter(Boolean);
}

// Synthesize one chunk of text to PCM samples. Returns undefined on failure
// (e.g. "Stale job replaced by new run" if a newer run evicted this one).
async function synthesize(modelId: string, chunk: string): Promise<number[] | undefined> {
  try {
    const result = textToSpeech({ modelId, text: chunk, stream: false });
    return await result.buffer;
  } catch (e) {
    console.error("TTS: generation failed", e);
    return undefined;
  }
}

// Write samples to a WAV file and play it to completion. Resolves when the clip
// finishes (or immediately if this run was invalidated mid-write). `onStart`
// fires once, the first time audio actually begins playing.
async function playClip(
  samples: number[],
  runId: number,
  index: number,
  onStart?: () => void
): Promise<void> {
  const wav = buildWav(samples);
  const file = new File(Paths.cache, `tts_${index}.wav`);
  try {
    if (file.exists) file.delete();
    file.create();
    file.write(wav);
  } catch (e) {
    console.error("TTS: failed to write WAV file", e);
    return;
  }

  if (runId !== activeRun) return;

  const player = createAudioPlayer({ uri: file.uri });
  currentPlayer = player;

  await new Promise<void>((resolve) => {
    // addListener isn't surfaced on AudioPlayer's public type in this project's
    // expo-modules-core resolution, but the event/status types are real.
    const emitter = player as unknown as {
      addListener: (
        event: "playbackStatusUpdate",
        listener: (status: AudioStatus) => void
      ) => { remove: () => void };
    };
    let startFired = false;
    let settled = false;
    let subscription: { remove: () => void } | undefined;
    // Resolve exactly once, whether playback finished naturally or stopSpeaking()
    // cut it short. Clears the shared resolver so a later stop is a no-op.
    const finish = () => {
      if (settled) return;
      settled = true;
      subscription?.remove();
      currentPlayResolve = null;
      resolve();
    };
    currentPlayResolve = finish;
    // Register the completion listener BEFORE play() so a fast didJustFinish
    // isn't missed (which would hang this promise).
    subscription = emitter.addListener("playbackStatusUpdate", (status) => {
      // First frame where audio is actually playing — flip the UI to "STOP".
      if (!startFired && status.playing) {
        startFired = true;
        onStart?.();
      }
      if (status.didJustFinish) finish();
    });
    player.play();
  });

  player.remove();
  if (currentPlayer === player) currentPlayer = null;
}

/**
 * Load the TTS model into RAM ahead of time (no speech). Safe to call on screen
 * mount — failures are swallowed so it never blocks the UI.
 */
export function prewarmTTS(): void {
  void loadTTSModel().catch(() => {});
}

// `onStart` fires once, when the first sentence actually begins playing (switch
// a Read Aloud button from loading to "STOP"). `onSentence` fires as each
// sentence begins, with its index in splitSentences(text) — drive read-along
// highlighting from it.
export async function speakResponse(
  text: string,
  opts?: { onStart?: () => void; onSentence?: (index: number) => void }
): Promise<void> {
  await stopSpeaking();
  const runId = activeRun; // stopSpeaking() bumped this; capture our token

  const sentences = splitSentences(text);
  if (sentences.length === 0) return;

  const modelId = await loadTTSModel();
  if (runId !== activeRun) return;

  // Pre-synthesize every sentence FIRST (the loading state covers this wait),
  // so playback never has to wait on the model — no mid-reading dead air. Keep
  // each clip's sentence index so highlighting stays aligned even if a sentence
  // failed to synthesize and was skipped.
  const clips: { index: number; samples: number[] }[] = [];
  for (let j = 0; j < sentences.length; j++) {
    const samples = await synthesize(modelId, sentences[j]);
    if (runId !== activeRun) return;
    if (samples && samples.length > 0) clips.push({ index: j, samples });
  }
  if (clips.length === 0) return;

  await setAudioModeAsync({ playsInSilentMode: true });

  let started = false;
  const fireStart = () => {
    if (!started) {
      started = true;
      opts?.onStart?.();
    }
  };

  // Play the small clips back to back — gapless apart from the brief, natural
  // pause at each sentence boundary.
  for (const clip of clips) {
    await playClip(clip.samples, runId, clip.index % 2, () => {
      fireStart();
      opts?.onSentence?.(clip.index);
    });
    if (runId !== activeRun) return;
  }
}

export async function stopSpeaking(): Promise<void> {
  activeRun++; // invalidate any in-flight sentence loop
  // Unblock a clip awaiting playback before we tear its player down, so its
  // promise (and the speak loop) doesn't hang on a didJustFinish that never comes.
  currentPlayResolve?.();
  if (!currentPlayer) return;
  try {
    currentPlayer.pause();
    currentPlayer.remove();
  } catch {}
  currentPlayer = null;
}
