import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { SpokenText } from "@/components/SpokenText";
import { AskSourceChips } from "@/components/AskSourceChips";
import { useTtsStore } from "@/store/useTtsStore";
import { hasVoice } from "@/constants/strings";
import type { ColorTokens } from "@/constants/colors";
import type { HealthEntry } from "@/types/health";
import type { AskStatus } from "@/hooks/useHealthQuery";

type Props = {
  question: string;
  answer: string;
  status: AskStatus;
  sources: HealthEntry[];
  ttsEnabled: boolean;
};

// Read-aloud for the answer shares the global TTS store under this id, so the
// SpokenText below karaoke-highlights the sentence being spoken.
const TTS_ID = "ask";

/**
 * One question-and-answer exchange: the question asked, the streamed answer
 * (karaoke-highlighted while read aloud), a Read Aloud control, and the history
 * entries the answer was grounded in.
 */
export function AskAnswerCard({ question, answer, status, sources, ttsEnabled }: Props) {
  const colors = useTheme();
  const { t, language } = useTranslation();
  const styles = makeStyles(colors);

  const toggle = useTtsStore((s) => s.toggle);
  const activeId = useTtsStore((s) => s.activeId);
  const ttsStatus = useTtsStore((s) => s.status);
  const isSpeaking = activeId === TTS_ID && ttsStatus === "playing";
  const isTtsLoading = activeId === TTS_ID && ttsStatus === "loading";

  const thinking = status === "thinking";
  const answering = status === "answering";
  // Read-aloud only for languages QVAC can speak (en/es/de/it).
  const showReadAloud = ttsEnabled && hasVoice(language) && status === "done" && answer.length > 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.questionRow}>
        <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.question}>{question}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{t("ask.answerLabel")}</Text>

        {thinking ? (
          <View style={styles.thinkingRow}>
            <ActivityIndicator size="small" color={colors.accentBlue} />
            <Text style={styles.thinking}>{t("ask.searchingHistory")}</Text>
          </View>
        ) : (
          <SpokenText id={TTS_ID} text={answer} style={styles.answer} />
        )}

        {answering && answer.length === 0 && (
          <ActivityIndicator size="small" color={colors.accentBlue} style={{ alignSelf: "flex-start" }} />
        )}

        {showReadAloud && (
          <TouchableOpacity
            style={styles.readBtn}
            onPress={() => toggle(TTS_ID, answer)}
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
      </View>

      <AskSourceChips sources={sources} />
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    wrap: { gap: 14 },
    questionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    question: {
      flex: 1,
      fontFamily: "Georgia",
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      lineHeight: 22,
    },
    card: {
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
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
    answer: {
      fontFamily: "Georgia",
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 24,
    },
    thinkingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    thinking: {
      fontFamily: "Georgia",
      fontSize: 14,
      color: colors.textSecondary,
    },
    readBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      alignSelf: "flex-start",
      paddingTop: 4,
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
