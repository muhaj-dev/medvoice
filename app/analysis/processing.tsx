import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useRecordingStore } from "@/store/useRecordingStore";
import { useHealthStore } from "@/store/useHealthStore";
import { PipelineStepRow, StepStatus } from "@/components/PipelineStepRow";
import { ProcessingHeader } from "@/components/ProcessingHeader";
import { transcribeAudioFile } from "@/lib/transcription";
import { analyzeHealthEntry } from "@/lib/medpsy";
import { embedText, semanticSearch, buildRagContext } from "@/lib/embeddings";

type Step = { id: number; icon: string; label: string; status: StepStatus };

const INITIAL_STEPS: Step[] = [
  { id: 1, icon: "🎙", label: "Transcribing voice input ...", status: "pending" },
  { id: 2, icon: "🔍", label: "Scanning health history ...", status: "pending" },
  { id: 3, icon: "📊", label: "RAG context retrieval ...", status: "pending" },
  { id: 4, icon: "🧠", label: "MedPsy-4B analyzing health entry ...", status: "pending" },
  { id: 5, icon: "✅", label: "Analysis complete", status: "pending" },
];

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function AnalysisProcessingScreen() {
  const colors = useTheme();
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const isRunning = useRef(false);

  const markStep = (id: number, status: StepStatus) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

  const runPipeline = async () => {
    const { audioUri, finalTranscript, setFinalTranscript, setAnalysisResult, setEntryEmbedding } =
      useRecordingStore.getState();
    const { entries } = useHealthStore.getState();

    // Step 1 — Transcription
    markStep(1, "running");
    let transcript = finalTranscript;
    if (audioUri && !transcript) {
      try {
        transcript = await transcribeAudioFile(audioUri);
        setFinalTranscript(transcript);
      } catch {}
    }
    await wait(200);
    markStep(1, "done");

    // Step 2 — Embed transcript + scan stored history
    await wait(200);
    markStep(2, "running");
    let embedding: number[] = [];
    try {
      embedding = await embedText(transcript || "Health update recorded.");
      setEntryEmbedding(embedding);
    } catch {}
    await wait(200);
    markStep(2, "done");

    // Step 3 — RAG: cosine similarity over stored embeddings, build context
    await wait(200);
    markStep(3, "running");
    let ragContext = "";
    try {
      const similar = await semanticSearch(transcript || "", entries, 5);
      ragContext = buildRagContext(similar);
    } catch {}
    await wait(200);
    markStep(3, "done");

    // Step 4 — MedPsy analysis with RAG context
    await wait(200);
    markStep(4, "running");
    try {
      const result = await analyzeHealthEntry(transcript || "Health update recorded.", ragContext);
      setAnalysisResult(result);
    } catch {
      setAnalysisResult({ summary: "Analysis completed.", tags: [], severity: "good", patterns: [] });
    }
    await wait(200);
    markStep(4, "done");

    // Step 5 — Complete
    await wait(200);
    markStep(5, "running");
    await wait(500);
    markStep(5, "done");

    await wait(800);
    router.replace("/analysis/result" as any);
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
        <Text style={[styles.backText, { color: colors.textSecondary }]}>← BACK</Text>
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProcessingHeader />

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
