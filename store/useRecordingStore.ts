import { create } from "zustand";

export type Pattern = {
  name: string;
  severity: "moderate" | "mild";
  emoji: string;
  description: string;
};

export type AnalysisResult = {
  summary: string;
  tags: string[];
  severity: "moderate" | "mild" | "good";
  patterns: Pattern[];
};

type RecordingStore = {
  isRecording: boolean;
  transcript: string;
  finalTranscript: string;
  audioUri: string | null;
  analysisResult: AnalysisResult | null;
  entryEmbedding: number[] | null;
  setIsRecording: (value: boolean) => void;
  appendTranscript: (word: string) => void;
  setTranscript: (text: string) => void;
  setFinalTranscript: (text: string) => void;
  setAudioUri: (uri: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setEntryEmbedding: (embedding: number[]) => void;
  resetRecording: () => void;
};

export const useRecordingStore = create<RecordingStore>((set) => ({
  isRecording: false,
  transcript: "",
  finalTranscript: "",
  audioUri: null,
  analysisResult: null,
  entryEmbedding: null,

  setIsRecording: (value) => set({ isRecording: value }),

  appendTranscript: (word) =>
    set((state) => ({
      transcript: state.transcript ? `${state.transcript} ${word}` : word,
    })),

  setTranscript: (text) => set({ transcript: text }),

  setFinalTranscript: (text) => set({ finalTranscript: text }),

  setAudioUri: (uri) => set({ audioUri: uri }),

  setAnalysisResult: (result) => set({ analysisResult: result }),

  setEntryEmbedding: (embedding) => set({ entryEmbedding: embedding }),

  resetRecording: () =>
    set({
      isRecording: false,
      transcript: "",
      finalTranscript: "",
      audioUri: null,
      analysisResult: null,
      entryEmbedding: null,
    }),
}));
