import { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTtsStore } from "@/store/useTtsStore";
import { useVisitPrep } from "@/hooks/useVisitPrep";
import { VisitSummaryCard, VISIT_TTS_ID } from "@/components/VisitSummaryCard";
import { VisitPrepActions } from "@/components/VisitPrepActions";
import { prewarmTTS } from "@/lib/tts";

export default function VisitPrepScreen() {
  const colors = useTheme();
  const { t } = useTranslation();
  const ttsEnabled = useSettingsStore((s) => s.ttsEnabled);
  const { status, summary, used, generate } = useVisitPrep();

  // Generate the brief as soon as the screen opens.
  useEffect(() => {
    void generate();
  }, [generate]);

  // Warm TTS so Read Aloud is quick once the summary is ready.
  useEffect(() => {
    if (ttsEnabled) prewarmTTS();
  }, [ttsEnabled]);

  // Stop any read-aloud when leaving.
  useEffect(
    () => () => {
      if (useTtsStore.getState().activeId === VISIT_TTS_ID) useTtsStore.getState().stop();
    },
    []
  );

  const showActions = summary.length > 0 && status !== "generating";

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.backText}>{t("visitPrep.back")}</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{t("visitPrep.titleVisit")}</Text>
        <Text style={styles.titleAccent}>{t("visitPrep.titlePrep")}</Text>
      </View>
      <Text style={styles.subtitle}>{t("visitPrep.subtitle")}</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <VisitSummaryCard summary={summary} status={status} entryCount={used.length} />
      </ScrollView>

      {showActions && (
        <View style={styles.bottomBar}>
          <VisitPrepActions summary={summary} ttsEnabled={ttsEnabled} />
        </View>
      )}
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bgPrimary },
    backBtn: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4, alignSelf: "flex-start" },
    backText: { fontFamily: "monospace", fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5 },
    header: { paddingHorizontal: 20, paddingTop: 6, flexDirection: "row", gap: 8, alignItems: "baseline" },
    title: { fontFamily: "Georgia", fontSize: 32, fontWeight: "700", color: colors.textPrimary },
    titleAccent: { fontFamily: "Georgia", fontSize: 32, fontWeight: "700", fontStyle: "italic", color: colors.accentBlue },
    subtitle: {
      fontFamily: "Georgia",
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 21,
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 16,
    },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
    bottomBar: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
}
