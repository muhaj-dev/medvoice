import { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useScanStore } from "@/store/useScanStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTtsStore } from "@/store/useTtsStore";
import { useSaveScan } from "@/hooks/useSaveScan";
import { ScannedImageCard } from "@/components/ScannedImageCard";
import { ConcernBanner } from "@/components/ConcernBanner";
import { MedPsySummaryCard } from "@/components/MedPsySummaryCard";
import { PatternCard } from "@/components/PatternCard";
import { AnalysisActionButtons } from "@/components/AnalysisActionButtons";
import { prewarmTTS } from "@/lib/tts";

export default function ScanResultScreen() {
  const colors = useTheme();
  const { imageUri, analysisResult } = useScanStore();
  const ttsEnabled = useSettingsStore((s) => s.ttsEnabled);

  // Read-aloud shares the TTS store (id "result") so the summary card can
  // highlight the sentence being spoken — the core feature for this flow.
  const ttsToggle = useTtsStore((s) => s.toggle);
  const activeId = useTtsStore((s) => s.activeId);
  const ttsStatus = useTtsStore((s) => s.status);
  const isSpeaking = activeId === "result" && ttsStatus === "playing";
  const isLoading = activeId === "result" && ttsStatus === "loading";

  useEffect(() => {
    if (ttsEnabled) prewarmTTS();
  }, [ttsEnabled]);

  useEffect(
    () => () => {
      if (useTtsStore.getState().activeId === "result") useTtsStore.getState().stop();
    },
    []
  );

  const result = analysisResult ?? {
    summary: "Your scanned document has been read on this device.",
    tags: [] as string[],
    severity: "good" as const,
    patterns: [],
  };

  const { saved, isSaving, handleSave } = useSaveScan(result);
  const handleReadAloud = () => ttsToggle("result", result.summary);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.bgPrimary }]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.backText, { color: colors.textSecondary }]}>← BACK</Text>
      </TouchableOpacity>

      <Text style={[styles.screenLabel, { color: colors.textSecondary }]}>DOCUMENT ANALYSIS</Text>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cards}>
          {!!imageUri && <ScannedImageCard uri={imageUri} />}

          <ConcernBanner severity={result.severity} patternCount={result.patterns?.length ?? 0} />

          <MedPsySummaryCard summary={result.summary} />

          {result.patterns?.map((pattern, i) => (
            <PatternCard key={i} pattern={pattern} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <AnalysisActionButtons
          isSpeaking={isSpeaking}
          isLoading={isLoading}
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

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4, alignSelf: "flex-start" },
  backText: { fontFamily: "monospace", fontSize: 12, letterSpacing: 0.5 },
  screenLabel: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 1.2,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
  cards: { gap: 12 },
  bottomBar: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 16, borderTopWidth: 1 },
});
