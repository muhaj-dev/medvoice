import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = {
  isSpeaking: boolean;
  onReadAloud: () => void;
  onSave: () => void;
  saved: boolean;
};

export function AnalysisActionButtons({ isSpeaking, onReadAloud, onSave, saved }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.readAloudBtn}
        onPress={onReadAloud}
        activeOpacity={0.75}
      >
        <Text style={styles.readAloudText}>
          {isSpeaking ? "⏹  STOP" : "🔊  READ ALOUD"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveBtn, saved && styles.savedBtn]}
        onPress={onSave}
        activeOpacity={0.85}
        disabled={saved}
      >
        <Text style={styles.saveBtnText}>
          {saved ? "✓  SAVED" : "💾  SAVE"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

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
