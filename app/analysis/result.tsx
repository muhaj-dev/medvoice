import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useRecordingStore } from "@/store/useRecordingStore";
import { useHealthStore } from "@/store/useHealthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useFamilyStore } from "@/store/useFamilyStore";
import { YouSaidCard } from "@/components/YouSaidCard";
import { ConcernBanner } from "@/components/ConcernBanner";
import { MedPsySummaryCard } from "@/components/MedPsySummaryCard";
import { PatternCard } from "@/components/PatternCard";
import { AnalysisActionButtons } from "@/components/AnalysisActionButtons";
import { speakResponse, stopSpeaking } from "@/lib/tts";
import { insertPattern } from "@/lib/db";
import type { HealthEntry } from "@/types/health";

export default function AnalysisResultScreen() {
  const colors = useTheme();
  const { finalTranscript, analysisResult, entryEmbedding, resetRecording } = useRecordingStore();
  const { addEntry } = useHealthStore();
  const ttsEnabled = useSettingsStore((s) => s.ttsEnabled);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const result = analysisResult ?? {
    summary: "Your health update has been recorded.",
    tags: [] as string[],
    severity: "good" as const,
    patterns: [],
  };

  const handleReadAloud = async () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await speakResponse(result.summary);
      } finally {
        setIsSpeaking(false);
      }
    }
  };

  const handleSave = async () => {
    if (saved || isSaving) return;
    setIsSaving(true);
    try {
      const entry: HealthEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        transcript: finalTranscript || "Health update recorded.",
        analysis: result.summary,
        tags: result.tags,
        severity: result.severity,
        embedding: entryEmbedding ?? undefined,
      };
      await addEntry(entry);
      // Share the summary (JSON only — no audio/embeddings) with connected family.
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
        resetRecording();
        router.replace("/(tabs)" as any);
      }, 700);
    } catch {
      setIsSaving(false);
    }
  };

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
    screenLabel: {
      fontFamily: "monospace",
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 1.2,
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    cards: { gap: 12 },
    bottomBar: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });

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

      <Text style={styles.screenLabel}>MEDPSY ANALYSIS</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cards}>
          <YouSaidCard transcript={finalTranscript} />

          <ConcernBanner
            severity={result.severity}
            patternCount={result.patterns?.length ?? 0}
          />

          <MedPsySummaryCard summary={result.summary} />

          {result.patterns?.map((pattern, i) => (
            <PatternCard key={i} pattern={pattern} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <AnalysisActionButtons
          isSpeaking={isSpeaking}
          ttsEnabled={ttsEnabled}
          onReadAloud={handleReadAloud}
          onSave={handleSave}
          saved={saved}
          isSaving={isSaving}
        />
      </View>
    </SafeAreaView>
  );
}
