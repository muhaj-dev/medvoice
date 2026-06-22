import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useAnalysisProgress } from "@/hooks/useAnalysisProgress";
import { useScanStore } from "@/store/useScanStore";
import { useHealthStore } from "@/store/useHealthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { PipelineStepRow, StepStatus } from "@/components/PipelineStepRow";
import { AnalysisProgressBar } from "@/components/AnalysisProgressBar";
import { ScanProcessingHeader } from "@/components/ScanProcessingHeader";
import { extractTextFromImage } from "@/lib/ocr";
import { analyzeDocument, analyzeDocumentLocally } from "@/lib/medpsy";
import { embedText, semanticSearch, buildRagContext } from "@/lib/embeddings";

type Step = { id: number; icon: string; label: string; status: StepStatus };

type TFn = ReturnType<typeof useTranslation>["t"];

const buildSteps = (modelSize: "1.7b" | "4b", t: TFn): Step[] => [
  { id: 1, icon: "📄", label: t("scan.stepReadingText"), status: "pending" },
  { id: 2, icon: "🔍", label: t("scan.stepScanningHistory"), status: "pending" },
  { id: 3, icon: "📊", label: t("scan.stepRagRetrieval"), status: "pending" },
  { id: 4, icon: "🧠", label: `MedPsy-${modelSize === "4b" ? "4B" : "1.7B"} ${t("scan.stepAnalyzingDocument")}`, status: "pending" },
  { id: 5, icon: "✅", label: t("scan.stepAnalysisComplete"), status: "pending" },
];

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function ScanProcessingScreen() {
  const colors = useTheme();
  const { t } = useTranslation();
  const modelSize = useSettingsStore((s) => s.modelSize);
  const [steps, setSteps] = useState<Step[]>(() => buildSteps(modelSize, t));
  const { progress, pct, done, advance, finish } = useAnalysisProgress();
  const isRunning = useRef(false);

  const markStep = (id: number, status: StepStatus) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    advance(id, status);
  };

  const runPipeline = async () => {
    const { imageUri, setExtractedText, setAnalysisResult, setEntryEmbedding } =
      useScanStore.getState();
    const { entries } = useHealthStore.getState();

    // Step 1 — On-device OCR: turn the captured photo into text.
    markStep(1, "running");
    let text = "";
    if (imageUri) {
      try {
        text = await extractTextFromImage(imageUri);
      } catch {}
    }
    setExtractedText(text);
    markStep(1, "done");

    // Step 2 — Embed the text + scan stored history.
    markStep(2, "running");
    try {
      const embedding = await embedText(text || "Scanned document");
      setEntryEmbedding(embedding);
    } catch {}
    markStep(2, "done");

    // Step 3 — RAG: pull the most relevant past entries as context.
    markStep(3, "running");
    let ragContext = "";
    try {
      const similar = await semanticSearch(text || "", entries, 5);
      ragContext = buildRagContext(similar);
    } catch {}
    markStep(3, "done");

    // Step 4 — MedPsy explains the document (and flags anything important).
    markStep(4, "running");
    if (!text.trim()) {
      // OCR found nothing readable — don't run the model on an empty page.
      setAnalysisResult({
        summary: t("scan.noTextSummary"),
        tags: [],
        severity: "good",
        patterns: [],
      });
    } else {
      try {
        const result = await analyzeDocument(text, ragContext);
        setAnalysisResult(result);
      } catch {
        // Model can't run (low-RAM device, failed download) — keep the OCR text
        // useful with locally-derived structure and an honest summary.
        setAnalysisResult(analyzeDocumentLocally(text));
      }
    }
    markStep(4, "done");

    // Step 5 — Complete.
    markStep(5, "running");
    await wait(400);
    markStep(5, "done");
    finish();

    await wait(500);
    router.replace("/scan/result" as any);
  };

  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;
    runPipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.backText, { color: colors.textSecondary }]}>{t("scan.back")}</Text>
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScanProcessingHeader />

        <AnalysisProgressBar anim={progress} pct={pct} done={done} />

        <View style={styles.stepsList}>
          {steps.map((step) => (
            <PipelineStepRow
              key={step.id}
              icon={step.icon}
              label={step.label}
              status={step.status}
              isLast={step.id === 5}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backBtn: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4, alignSelf: "flex-start" },
  backText: { fontFamily: "monospace", fontSize: 12, letterSpacing: 0.5 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  stepsList: { gap: 16 },
});
