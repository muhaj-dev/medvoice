import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { hasVoice } from "@/constants/strings";

type Props = {
  isSpeaking: boolean;
  isLoading?: boolean;
  ttsEnabled?: boolean;
  onReadAloud: () => void;
  onSave: () => void;
  saved: boolean;
  isSaving?: boolean;
};

export function AnalysisActionButtons({ isSpeaking, isLoading = false, ttsEnabled = true, onReadAloud, onSave, saved, isSaving }: Props) {
  const colors = useTheme();
  const { t, language } = useTranslation();
  // Read-aloud only exists for languages QVAC can speak (en/es/de/it).
  const voiceAvailable = hasVoice(language);

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: 12,
    },
    readAloudBtn: {
      flex: 1,
      height: 52,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    readAloudText: {
      fontFamily: "monospace",
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    saveBtn: {
      flex: 1,
      height: 52,
      backgroundColor: colors.accentBlue,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    savedBtn: {
      backgroundColor: colors.successGreen,
    },
    saveBtnText: {
      fontFamily: "monospace",
      fontSize: 11,
      color: colors.textPrimary,
      fontWeight: "600",
      letterSpacing: 0.5,
    },
  });

  return (
    <View style={styles.row}>
      {voiceAvailable && (
        <TouchableOpacity
          style={[styles.readAloudBtn, !ttsEnabled && { opacity: 0.4 }]}
          onPress={ttsEnabled ? onReadAloud : undefined}
          activeOpacity={0.75}
          disabled={!ttsEnabled}
        >
          {isLoading && <ActivityIndicator size="small" color={colors.accentBlue} style={{ marginRight: 7 }} />}
          <Text style={styles.readAloudText}>
            {!ttsEnabled
              ? t("analysis.ttsOff")
              : isLoading
              ? t("analysis.loading")
              : isSpeaking
              ? t("analysis.stop")
              : t("analysis.readAloud")}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.saveBtn, saved && styles.savedBtn]}
        onPress={onSave}
        activeOpacity={0.85}
        disabled={saved || isSaving}
      >
        <Text style={styles.saveBtnText}>
          {saved ? t("analysis.saved") : isSaving ? t("analysis.saving") : t("analysis.save")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
