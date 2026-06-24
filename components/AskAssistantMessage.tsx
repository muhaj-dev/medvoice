import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { AskMarkdown, stripMarkdown } from "@/components/AskMarkdown";
import { AskSourceChips } from "@/components/AskSourceChips";
import { useTtsStore } from "@/store/useTtsStore";
import { hasVoice } from "@/constants/strings";
import type { ColorTokens } from "@/constants/colors";
import type { ChatMessage } from "@/hooks/useHealthQuery";

type Props = { message: ChatMessage; ttsEnabled: boolean };

/**
 * One MedVoice answer in the chat thread: a labelled, left-aligned block that
 * streams in, renders markdown like ChatGPT/Claude, offers Read Aloud, and
 * shows the history entries it was grounded in.
 */
export function AskAssistantMessage({ message, ttsEnabled }: Props) {
  const colors = useTheme();
  const { t, language } = useTranslation();
  const styles = makeStyles(colors);

  const ttsId = message.id;
  const toggle = useTtsStore((s) => s.toggle);
  const activeId = useTtsStore((s) => s.activeId);
  const ttsStatus = useTtsStore((s) => s.status);
  const isSpeaking = activeId === ttsId && ttsStatus === "playing";
  const isTtsLoading = activeId === ttsId && ttsStatus === "loading";

  const thinking = message.status === "thinking";
  const answering = message.status === "answering";
  const hasText = message.text.length > 0;
  // Read-aloud only for languages QVAC can speak (en/es/de/it).
  const showReadAloud =
    ttsEnabled && hasVoice(language) && message.status === "done" && hasText;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t("ask.answerLabel")}</Text>

      {thinking ? (
        <View style={styles.thinkingRow}>
          <ActivityIndicator size="small" color={colors.accentBlue} />
          <Text style={styles.thinking}>{t("ask.searchingHistory")}</Text>
        </View>
      ) : (
        <>
          {hasText && <AskMarkdown text={message.text} />}
          {answering && !hasText && (
            <ActivityIndicator
              size="small"
              color={colors.accentBlue}
              style={{ alignSelf: "flex-start" }}
            />
          )}
        </>
      )}

      {showReadAloud && (
        <TouchableOpacity
          style={styles.readBtn}
          onPress={() => toggle(ttsId, stripMarkdown(message.text))}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isTtsLoading ? (
            <ActivityIndicator size="small" color={colors.accentBlue} />
          ) : (
            <Ionicons
              name={isSpeaking ? "stop-circle-outline" : "volume-high-outline"}
              size={18}
              color={colors.accentBlue}
            />
          )}
          <Text style={styles.readText}>
            {isTtsLoading ? t("ask.loading") : isSpeaking ? t("ask.stop") : t("ask.readAloud")}
          </Text>
        </TouchableOpacity>
      )}

      {message.sources && <AskSourceChips sources={message.sources} />}
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    wrap: {
      alignSelf: "flex-start",
      maxWidth: "100%",
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 18,
      borderBottomLeftRadius: 6,
      padding: 16,
      gap: 10,
    },
    label: {
      fontFamily: "monospace",
      fontSize: 10,
      fontWeight: "600",
      color: colors.accentBlue,
      letterSpacing: 1.0,
    },
    thinkingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    thinking: { fontFamily: "Georgia", fontSize: 14, color: colors.textSecondary },
    readBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      alignSelf: "flex-start",
      paddingTop: 2,
    },
    readText: {
      fontFamily: "monospace",
      fontSize: 11,
      fontWeight: "600",
      color: colors.accentBlue,
      letterSpacing: 1.0,
    },
  });
}
