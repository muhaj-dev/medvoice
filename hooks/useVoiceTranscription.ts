/**
 * Live on-device voice transcription.
 *
 * Captures raw 16 kHz mono s16le PCM from the mic with expo-audio's
 * useAudioStream (the exact format Parakeet needs) and feeds each buffer into a
 * QVAC transcribeStream session, exposing the text as it is recognized.
 *
 * Returns { transcript, start, stop }. start() asks for mic permission, loads
 * Parakeet, opens the session and begins capturing. stop() ends the session and
 * resolves with the final transcript.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useAudioStream,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import type { TranscribeStreamSession } from "@qvac/sdk";
import { createLiveSession } from "@/lib/transcription";

export function useVoiceTranscription() {
  const [transcript, setTranscript] = useState("");
  const sessionRef = useRef<TranscribeStreamSession | null>(null);
  const textRef = useRef("");
  const donePromiseRef = useRef<Promise<string> | null>(null);
  // Monotonic run id — each start() takes a snapshot; stop() (or a new start)
  // bumps it, cancelling any in-flight start so it never touches a stale stream.
  const runIdRef = useRef(0);

  // Live mic PCM in exactly the format Parakeet expects: 16 kHz mono s16le.
  const { stream } = useAudioStream({
    sampleRate: 16000,
    channels: 1,
    encoding: "int16",
    onBuffer: (buf) => {
      const session = sessionRef.current;
      if (!session) return; // buffers before the session is ready are dropped
      try {
        session.write(new Uint8Array(buf.data));
      } catch {
        // session ended/destroyed — ignore late buffers
      }
    },
  });
  // Always reference the CURRENT stream object. useAudioStream may release and
  // re-acquire it (React's dev double-mount), so a captured reference can be
  // stale/released — reading the ref avoids "shared object already released".
  // Updated in an effect (never during render) to satisfy react-hooks/refs.
  const streamRef = useRef(stream);
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  const start = useCallback(async (): Promise<void> => {
    const myRun = ++runIdRef.current;
    textRef.current = "";
    setTranscript("");

    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted || myRun !== runIdRef.current) return;

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    if (myRun !== runIdRef.current) return;

    // Loading Parakeet can take a few seconds — bail if stopped meanwhile.
    let session: TranscribeStreamSession;
    try {
      session = await createLiveSession();
    } catch {
      return;
    }
    if (myRun !== runIdRef.current) {
      try { session.destroy(); } catch {}
      return;
    }
    sessionRef.current = session;

    // Consume recognized text as the model emits it (per VAD-detected segment).
    donePromiseRef.current = (async () => {
      try {
        for await (const text of session) {
          textRef.current += text;
          setTranscript(textRef.current);
        }
      } catch {
        // stream ended/destroyed
      }
      return textRef.current;
    })();

    try {
      await streamRef.current.start();
    } catch {
      // stream released/unavailable — nothing to capture
    }
  }, []);

  const stop = useCallback(async (): Promise<string> => {
    runIdRef.current++; // cancel any in-flight start()

    try {
      streamRef.current.stop();
    } catch {}

    const session = sessionRef.current;
    if (session) {
      try {
        session.end();
      } catch {}
    }

    // Wait for the iterator to flush any remaining text after end().
    const finalText = donePromiseRef.current
      ? await donePromiseRef.current
      : textRef.current;

    if (session) {
      try {
        session.destroy();
      } catch {}
    }
    sessionRef.current = null;
    donePromiseRef.current = null;
    return finalText.trim();
  }, []);

  return { transcript, start, stop };
}
