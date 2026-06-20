import { View, Text, TouchableOpacity, ActivityIndicator, Share, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTtsStore } from "@/store/useTtsStore";
import { VISIT_TTS_ID } from "@/components/VisitSummaryCard";
import type { ColorTokens } from "@/constants/colors";

type Props = {
  summary: string;
  ttsEnabled: boolean;
};

/**
 * Read Aloud + Share for the visit-prep brief. Share uses the OS share sheet
 * (plain text), so the user explicitly chooses where it goes — nothing leaves
 * the device automatically, in keeping with the privacy promise.
 */
export function VisitPrepActions({ summary, ttsEnabled }: Props) {
  const colors = useTheme();
  const styles = makeStyles(colors);

  const toggle = useTtsStore((s) => s.toggle);
  const activeId = useTtsStore((s) => s.activeId);
  const ttsStatus = useTtsStore((s) => s.status);
  const isSpeaking = activeId === VISIT_TTS_ID && ttsStatus === "playing";
  const isLoading = activeId === VISIT_TTS_ID && ttsStatus === "loading";

  const handleShare = () => {
    if (!summary) return;
    void Share.share({
      title: "My MedVoice visit summary",
      message: `My MedVoice visit summary\n\n${summary}`,
    }).catch(() => {});
  };

  return (
    <View style={styles.row}>
      {ttsEnabled && (
        <TouchableOpacity
          style={[styles.btn, styles.secondary]}
          onPress={() => toggle(VISIT_TTS_ID, summary)}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.accentBlue} />
          ) : (
            <Ionicons
              name={isSpeaking ? "stop-circle-outline" : "volume-high-outline"}
              size={18}
              color={colors.accentBlue}
            />
          )}
          <Text style={styles.secondaryText}>
            {isLoading ? "LOADING" : isSpeaking ? "STOP" : "READ ALOUD"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.btn, styles.primary]}
        onPress={handleShare}
        activeOpacity={0.85}
      >
        <Ionicons name="share-outline" size={18} color={colors.textPrimary} />
        <Text style={styles.primaryText}>SHARE</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    row: { flexDirection: "row", gap: 12 },
    btn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: 52,
      borderRadius: 14,
    },
    secondary: {
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryText: {
      fontFamily: "monospace",
      fontSize: 12,
      fontWeight: "600",
      color: colors.accentBlue,
      letterSpacing: 1.0,
    },
    primary: { backgroundColor: colors.accentBlue },
    primaryText: {
      fontFamily: "monospace",
      fontSize: 12,
      fontWeight: "600",
      color: colors.textPrimary,
      letterSpacing: 1.0,
    },
  });
}
