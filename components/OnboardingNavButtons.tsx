import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = {
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueEnabled: boolean;
};

export function OnboardingNavButtons({
  onBack,
  onContinue,
  continueLabel = "CONTINUE →",
  continueEnabled,
}: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
        <Text style={styles.backText}>← BACK</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onContinue}
        disabled={!continueEnabled}
        activeOpacity={continueEnabled ? 0.85 : 1}
        style={[styles.continueBtn, continueEnabled && styles.continueBtnActive]}
      >
        <Text style={[styles.continueText, continueEnabled && styles.continueTextActive]}>
          {continueLabel}
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
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: colors.textSecondary,
  },
  continueBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
  },
  continueBtnActive: {
    backgroundColor: colors.accentBlue,
    borderColor: colors.accentBlue,
  },
  continueText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: colors.textSecondary,
  },
  continueTextActive: {
    color: colors.textPrimary,
  },
});
