import { useCallback, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTtsStore } from "@/store/useTtsStore";
import { useHealthQuery } from "@/hooks/useHealthQuery";
import { AskInputBar } from "@/components/AskInputBar";
import { AskAnswerCard } from "@/components/AskAnswerCard";
import { AskSuggestions } from "@/components/AskSuggestions";
import { prewarmTTS } from "@/lib/tts";

export default function AskScreen() {
  const colors = useTheme();
  const { t } = useTranslation();
  const ttsEnabled = useSettingsStore((s) => s.ttsEnabled);
  const { status, question, answer, sources, ask } = useHealthQuery();

  // Warm the TTS model so the first spoken answer starts quickly.
  useEffect(() => {
    if (ttsEnabled) prewarmTTS();
  }, [ttsEnabled]);

  // Stop any read-aloud when leaving the screen.
  useEffect(
    () => () => {
      if (useTtsStore.getState().activeId === "ask") useTtsStore.getState().stop();
    },
    []
  );

  // Ask, then auto-read the answer aloud — voice question in, spoken answer out.
  const handleSubmit = useCallback(
    async (q: string) => {
      const full = await ask(q);
      if (full && ttsEnabled) {
        // A previous answer may still be playing under the same "ask" id —
        // toggle() would read that as "tap to stop" and never speak the new
        // one. Reset first so the new answer always starts fresh.
        const tts = useTtsStore.getState();
        tts.stop();
        tts.toggle("ask", full);
      }
    },
    [ask, ttsEnabled]
  );

  const busy = status === "thinking" || status === "answering";
  const hasConversation = question.length > 0;

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.backText}>{t("ask.back")}</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{t("ask.titleAsk")}</Text>
        <Text style={styles.titleAccent}>{t("ask.titleAccent")}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {hasConversation ? (
          <AskAnswerCard
            question={question}
            answer={answer}
            status={status}
            sources={sources}
            ttsEnabled={ttsEnabled}
          />
        ) : (
          <AskSuggestions onPick={handleSubmit} />
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <AskInputBar onSubmit={handleSubmit} busy={busy} />
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
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
    header: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 16, flexDirection: "row", gap: 8, alignItems: "baseline" },
    title: { fontFamily: "Georgia", fontSize: 32, fontWeight: "700", color: colors.textPrimary },
    titleAccent: { fontFamily: "Georgia", fontSize: 32, fontWeight: "700", fontStyle: "italic", color: colors.accentBlue },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 24 },
    inputBar: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
}
