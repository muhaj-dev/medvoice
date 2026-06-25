import { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useTtsStore } from "@/store/useTtsStore";
import { useHealthQuery } from "@/hooks/useHealthQuery";
import { stripMarkdown } from "@/components/AskMarkdown";
import { AskInputBar } from "@/components/AskInputBar";
import { AskThread } from "@/components/AskThread";
import { prewarmTTS } from "@/lib/tts";

export default function AskScreen() {
  const colors = useTheme();
  const { t } = useTranslation();
  const ttsEnabled = useSettingsStore((s) => s.ttsEnabled);
  const { messages, busy, ask, reset } = useHealthQuery();

  // Warm the TTS model so the first spoken answer starts quickly.
  useEffect(() => {
    if (ttsEnabled) prewarmTTS();
  }, [ttsEnabled]);

  // Stop any read-aloud when leaving the screen.
  useEffect(
    () => () => {
      if (useTtsStore.getState().activeId?.startsWith("a-")) useTtsStore.getState().stop();
    },
    []
  );

  // Ask, then auto-read the new answer aloud — voice question in, spoken out.
  const handleSubmit = useCallback(
    async (q: string) => {
      const res = await ask(q);
      if (res?.text && ttsEnabled) {
        const tts = useTtsStore.getState();
        tts.stop();
        tts.toggle(res.id, stripMarkdown(res.text));
      }
    },
    [ask, ttsEnabled]
  );

  const handleNewChat = useCallback(() => {
    useTtsStore.getState().stop();
    reset();
  }, [reset]);

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.topBarText}>{t("ask.back")}</Text>
          </TouchableOpacity>

          {messages.length > 0 && (
            <TouchableOpacity
              onPress={handleNewChat}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.topBarText}>{t("ask.newChat")}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>{t("ask.titleAsk")}</Text>
          <Text style={styles.titleAccent}>{t("ask.titleAccent")}</Text>
        </View>

        <AskThread messages={messages} ttsEnabled={ttsEnabled} onPickSuggestion={handleSubmit} />

        <View style={styles.inputBar}>
          <AskInputBar onSubmit={handleSubmit} busy={busy} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bgPrimary },
    flex: { flex: 1 },
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 4,
    },
    topBarText: {
      fontFamily: "monospace",
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 6,
      paddingBottom: 16,
      flexDirection: "row",
      gap: 8,
      alignItems: "baseline",
    },
    title: { fontFamily: "Georgia", fontSize: 32, fontWeight: "700", color: colors.textPrimary },
    titleAccent: {
      fontFamily: "Georgia",
      fontSize: 32,
      fontWeight: "700",
      fontStyle: "italic",
      color: colors.accentBlue,
    },
    inputBar: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
  });
}
