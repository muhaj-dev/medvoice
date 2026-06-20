import { useState } from "react";
import { router } from "expo-router";
import { useScanStore } from "@/store/useScanStore";
import { useHealthStore } from "@/store/useHealthStore";
import { useFamilyStore } from "@/store/useFamilyStore";
import { persistScanImage } from "@/lib/ocr";
import { insertPattern } from "@/lib/db";
import type { AnalysisResult } from "@/store/useRecordingStore";
import type { HealthEntry } from "@/types/health";

/**
 * Persists a scanned-document result as a HealthEntry: moves the photo out of
 * the camera cache into permanent storage, writes the entry + its patterns to
 * SQLite, and broadcasts the summary to family. Keeps app/scan/result.tsx a
 * thin layout file (logic lives here, not in the screen).
 */
export function useSaveScan(result: AnalysisResult) {
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (saved || isSaving) return;
    setIsSaving(true);
    try {
      const { imageUri, extractedText, entryEmbedding, resetScan } = useScanStore.getState();
      // "Document" tag marks this as a scan so the Timeline can tell it apart
      // from a voice entry. Dedupe in case OCR-derived tags already include it.
      const tags = ["Document", ...result.tags.filter((t) => t !== "Document")];
      const id = Date.now().toString();
      // Move the photo out of the temp camera cache so the Timeline can still
      // show it later. Local-only — the image never leaves the device.
      const savedImageUri = imageUri ? persistScanImage(imageUri, id) : undefined;
      const entry: HealthEntry = {
        id,
        timestamp: new Date().toISOString(),
        transcript: extractedText || "Scanned document",
        analysis: result.summary,
        tags,
        severity: result.severity,
        embedding: entryEmbedding ?? undefined,
        imageUri: savedImageUri,
      };
      await useHealthStore.getState().addEntry(entry);
      void useFamilyStore.getState().broadcastEntry(entry);
      await Promise.all(
        (result.patterns ?? []).map((p, i) =>
          insertPattern({
            id: `${entry.id}_p${i}`,
            entryId: entry.id,
            patternName: p.name,
            severity: p.severity,
            description: p.description,
            recommendation: "",
            createdAt: entry.timestamp,
          })
        )
      );
      setSaved(true);
      setTimeout(() => {
        resetScan();
        router.replace("/(tabs)" as any);
      }, 700);
    } catch {
      setIsSaving(false);
    }
  };

  return { saved, isSaving, handleSave };
}
