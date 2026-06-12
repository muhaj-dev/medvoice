/**
 * Voice capture + live transcription.
 *
 * Captures raw 16 kHz mono s16le PCM from the mic with expo-audio's
 * useAudioStream (the exact format Parakeet needs). Each chunk is fed to TWO
 * places:
 *   1. a live Parakeet streaming session (transcribeStream) so words appear on
 *      screen as the user speaks, and
 *   2. an in-memory buffer that's written to a WAV on stop — kept as a fallback
 *      the analysis pipeline can batch-transcribe if streaming yielded nothing.
 *
 * Returns { start, stop }. start() asks for mic permission, starts the mic
 * immediately, then warms Parakeet in the background — audio captured while the
 * model loads is replayed into the live session when it opens, so nothing is
 * lost. stop() finalizes and resolves with the final streamed transcript plus
 * the WAV URI fallback.
 */

import { useCallback, useEffect, useRef } from "react";
import {
  useAudioStream,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import {
  pcmToWavFile,
  startLiveTranscription,
  type LiveTranscription,
} from "@/lib/transcription";
import { loadParakeetModel, resumeQvac } from "@/lib/qvac";
import { useRecordingStore } from "@/store/useRecordingStore";

export type StopResult = { text: string; wavUri: string };

export function useVoiceTranscription() {
  const chunksRef = useRef<Uint8Array[]>([]);
  const sampleRateRef = useRef(16000);
  // Monotonic run id — bumped by stop()/restart to cancel a stale async start().
  const runIdRef = useRef(0);
  // Live Parakeet streaming session for the current run (null until ready).
  const liveRef = useRef<LiveTranscription | null>(null);

  const setTranscript = useRecordingStore((s) => s.setTranscript);

  const { stream } = useAudioStream({
    sampleRate: 16000,
    channels: 1,
    encoding: "int16",
    onBuffer: (buf) => {
      sampleRateRef.current = buf.sampleRate || 16000;
      // Copy: the native buffer may be reused after this callback returns.
      const chunk = new Uint8Array(buf.data.slice(0));
      chunksRef.current.push(chunk);
      // Feed the same PCM to the live transcriber once it's open.
      liveRef.current?.write(chunk);
    },
  });
  // useAudioStream may release/re-acquire the stream object on dev double-mount;
  // read the current one via a ref (updated in an effect, never during render).
  const streamRef = useRef(stream);
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  const start = useCallback(async (): Promise<void> => {
    const myRun = ++runIdRef.current;
    chunksRef.current = [];
    // Clear any text left over from a previous recording.
    setTranscript("");

    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      console.warn("[transcription] microphone permission not granted");
      return;
    }
    if (myRun !== runIdRef.current) return;

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    if (myRun !== runIdRef.current) return;

    // Start the mic FIRST so capture begins the moment the screen says
    // "LISTENING". Parakeet may still be loading for many seconds; everything
    // captured meanwhile lands in chunksRef and is replayed into the live
    // session below once it opens.
    try {
      await streamRef.current.start();
      console.log("[transcription] mic stream started");
    } catch (e) {
      console.error("[transcription] audio stream start failed", e);
      return;
    }
    if (myRun !== runIdRef.current) return;

    // The mic-permission dialog can briefly background the app, which suspends
    // the QVAC runtime — and `transcribeStream` is blocked while suspended.
    // Resume it before any inference so the live session can start.
    try {
      await resumeQvac();
    } catch {}
    if (myRun !== runIdRef.current) return;

    // Load Parakeet (downloads on first run), then open the live stream.
    try {
      const modelId = await loadParakeetModel();
      if (myRun !== runIdRef.current) return;
      const live = await startLiveTranscription(modelId, (fullText) => {
        // Ignore late callbacks from a session we've already replaced.
        if (myRun === runIdRef.current) setTranscript(fullText);
      });
      if (myRun !== runIdRef.current) {
        live.destroy();
        return;
      }
      // Replay audio captured while the model was loading, then go live.
      // No await between the replay and the assignment, so no chunk can
      // arrive in between and be double-fed or skipped.
      for (const chunk of chunksRef.current) live.write(chunk);
      liveRef.current = live;
    } catch (e) {
      console.error("[transcription] live transcription unavailable", e);
    }
  }, [setTranscript]);

  const stop = useCallback(async (): Promise<StopResult> => {
    runIdRef.current++; // cancel any in-flight start()
    try {
      streamRef.current.stop();
    } catch {}

    // Finalize the live transcript first so the streamed text wins as the
    // primary result. Done before any model eviction unloads Parakeet.
    let text = "";
    const live = liveRef.current;
    liveRef.current = null;
    if (live) {
      try {
        text = await live.stop();
      } catch (e) {
        console.error("[transcription] live stop failed", e);
      }
    }

    const chunks = chunksRef.current;
    chunksRef.current = [];
    const totalBytes = chunks.reduce((n, c) => n + c.byteLength, 0);
    console.log(
      `[transcription] captured ${totalBytes} PCM bytes in ${chunks.length} chunks @ ${sampleRateRef.current}Hz · live="${text}"`
    );
    if (totalBytes === 0) return { text, wavUri: "" };

    const merged = new Uint8Array(totalBytes);
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.byteLength;
    }

    let wavUri = "";
    try {
      wavUri = pcmToWavFile(merged, sampleRateRef.current);
    } catch (e) {
      console.error("[transcription] WAV write failed", e);
    }
    return { text, wavUri };
  }, []);

  return { start, stop };
}
