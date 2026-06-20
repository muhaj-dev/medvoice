import { create } from "zustand";
import type { AnalysisResult } from "./useRecordingStore";

/**
 * State for the document-scan flow (capture → OCR → analyze → result).
 * Parallel to useRecordingStore but for scanned documents instead of voice.
 * Nothing here is persisted — the photo and text stay only as long as the flow
 * is open; saving converts the result into a HealthEntry (SQLite).
 */
type ScanStore = {
  imageUri: string | null;
  extractedText: string;
  analysisResult: AnalysisResult | null;
  entryEmbedding: number[] | null;
  setImageUri: (uri: string) => void;
  setExtractedText: (text: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setEntryEmbedding: (embedding: number[]) => void;
  resetScan: () => void;
};

export const useScanStore = create<ScanStore>((set) => ({
  imageUri: null,
  extractedText: "",
  analysisResult: null,
  entryEmbedding: null,

  setImageUri: (uri) => set({ imageUri: uri }),
  setExtractedText: (text) => set({ extractedText: text }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setEntryEmbedding: (embedding) => set({ entryEmbedding: embedding }),

  resetScan: () =>
    set({
      imageUri: null,
      extractedText: "",
      analysisResult: null,
      entryEmbedding: null,
    }),
}));
