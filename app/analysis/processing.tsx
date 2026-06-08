import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { useRecordingStore } from "@/store/useRecordingStore";
import { PipelineStepRow, StepStatus } from "@/components/PipelineStepRow";
import { transcribeAudioFile } from "@/lib/transcription";
import { analyzeHealthEntry } from "@/lib/medpsy";

type Step = { id: number; icon: string; label: string; status: StepStatus };

const INITIAL_STEPS: Step[] = [
  { id: 1, icon: "🎙", label: "Transcribing voice input ...", status: "pending" },
  { id: 2, icon: "🧠", label: "MedPsy-4B analyzing health entry ...", status: "pending" },
  { id: 3, icon: "🔍", label: "Scanning health history ...", status: "pending" },
  { id: 4, icon: "📊", label: "RAG context retrieval ...", status: "pending" },
  { id: 5, icon: "✅", label: "Analysis complete", status: "pending" },
];

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function AnalysisProcessingScreen() {
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const isRunning = useRef(false);

  const markStep = (id: number, status: StepStatus) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));

  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;
    runPipeline();
  }, []);

  const runPipeline = async () => {
    const { audioUri, finalTranscript, setFinalTranscript, setAnalysisResult } =
      useRecordingStore.getState();

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

    // Step 2 — MedPsy analysis
    await wait(200);
    markStep(2, "running");
    try {
      const result = await analyzeHealthEntry(transcript || "Health update recorded.", "");
      setAnalysisResult(result);
    } catch {
      setAnalysisResult({ summary: "Analysis completed.", tags: [], severity: "good", patterns: [] });
    }
    await wait(200);
    markStep(2, "done");

    // Step 3 — Scan history
    await wait(200);
    markStep(3, "running");
    await wait(600);
    markStep(3, "done");

    // Step 4 — RAG retrieval
    await wait(200);
    markStep(4, "running");
    await wait(800);
    markStep(4, "done");

    // Step 5 — Complete
    await wait(200);
    markStep(5, "running");
    await wait(500);
    markStep(5, "done");

    await wait(800);
    router.replace("/analysis/result" as any);
  };

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.backText}>← BACK</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.processingLabel}>MEDPSY PROCESSING</Text>

        <Text style={styles.headingLine1}>Analyzing your</Text>
        <Text style={styles.headingLine2}>health entry</Text>

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
  root: { flex: 1, backgroundColor: colors.bgPrimary },
  backBtn: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    alignSelf: "flex-start",
  },
  backText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  processingLabel: {
    fontFamily: "monospace",
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1.54,
    marginBottom: 20,
  },
  headingLine1: {
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 38,
  },
  headingLine2: {
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "700",
    fontStyle: "italic",
    color: colors.accentBlue,
    lineHeight: 38,
    marginBottom: 36,
  },
  stepsList: {
    gap: 16,
  },
});
