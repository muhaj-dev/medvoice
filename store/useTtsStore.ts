import { create } from "zustand";
import { speakResponse, stopSpeaking } from "@/lib/tts";

/**
 * Tracks which on-screen text is being read aloud, its phase, and which
 * sentence is currently spoken — so Read Aloud buttons share one source of
 * truth and the matching text can highlight the spoken sentence (karaoke).
 *
 * `activeId` is a caller-chosen unique id (e.g. `tl-<entryId>`), NOT the raw
 * entry id — a local entry and its synced copy share the same id, so callers
 * namespace per screen. `sentenceIndex` indexes splitSentences(text).
 */
type TtsStatus = "idle" | "loading" | "playing";

type TtsStore = {
  activeId: string | null;
  status: TtsStatus;
  sentenceIndex: number;
  toggle: (id: string, text: string) => void;
  stop: () => void;
};

export const useTtsStore = create<TtsStore>((set, get) => ({
  activeId: null,
  status: "idle",
  sentenceIndex: -1,

  toggle: (id, text) => {
    // Tapping the one that's already loading or playing stops it.
    if (get().activeId === id && get().status !== "idle") {
      void stopSpeaking();
      set({ activeId: null, status: "idle", sentenceIndex: -1 });
      return;
    }
    // speakResponse() stops any current playback before it starts.
    set({ activeId: id, status: "loading", sentenceIndex: -1 });
    void speakResponse(text, {
      onStart: () => {
        if (get().activeId === id) set({ status: "playing" });
      },
      onSentence: (index) => {
        if (get().activeId === id) set({ status: "playing", sentenceIndex: index });
      },
    })
      .catch(() => {})
      .finally(() => {
        // Only clear if a newer toggle hasn't already taken over.
        if (get().activeId === id) set({ activeId: null, status: "idle", sentenceIndex: -1 });
      });
  },

  stop: () => {
    void stopSpeaking();
    set({ activeId: null, status: "idle", sentenceIndex: -1 });
  },
}));
