import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

export const ProcessingHeader = () => {
  const colors = useTheme();
  const { t } = useTranslation();
  return (
    <View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {t("analysis.processingLabel")}
      </Text>
      <Text style={[styles.h1, { color: colors.textPrimary }]}>
        {t("analysis.processingTitle")}
      </Text>
      <Text style={[styles.h1italic, { color: colors.accentBlue }]}>
        {t("analysis.processingTitleAccent")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: 1.54,
    marginBottom: 20,
  },
  h1: {
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 38,
  },
  h1italic: {
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "700",
    fontStyle: "italic",
    lineHeight: 38,
    marginBottom: 36,
  },
});
