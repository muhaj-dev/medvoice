import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  isSpeaking: boolean;
  ttsEnabled?: boolean;
  onReadAloud: () => void;
  onSave: () => void;
  saved: boolean;
  isSaving?: boolean;
};

export function AnalysisActionButtons({ isSpeaking, ttsEnabled = true, onReadAloud, onSave, saved, isSaving }: Props) {
  const colors = useTheme();

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
      <TouchableOpacity
        style={[styles.readAloudBtn, !ttsEnabled && { opacity: 0.4 }]}
        onPress={ttsEnabled ? onReadAloud : undefined}
        activeOpacity={0.75}
        disabled={!ttsEnabled}
      >
        <Text style={styles.readAloudText}>
          {!ttsEnabled ? "🔇  TTS OFF" : isSpeaking ? "⏹  STOP" : "🔊  READ ALOUD"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveBtn, saved && styles.savedBtn]}
        onPress={onSave}
        activeOpacity={0.85}
        disabled={saved || isSaving}
      >
        <Text style={styles.saveBtnText}>
          {saved ? "✓  SAVED" : isSaving ? "SAVING..." : "💾  SAVE"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
