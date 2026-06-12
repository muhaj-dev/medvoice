import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { ColorTokens } from "@/constants/colors";

type Props = { summary: string };

/**
 * The MedPsy free-text summary — the same text a connected family member
 * sees in Care View, shown to the patient on their own device.
 */
export function MedPsySummaryCard({ summary }: Props) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (!summary) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>MEDPSY SUMMARY</Text>
      <Text style={styles.text}>{summary}</Text>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 16,
      gap: 8,
    },
    label: {
      fontFamily: "monospace",
      fontSize: 10,
      fontWeight: "600",
      color: colors.accentBlue,
      letterSpacing: 1.0,
    },
    text: {
      fontFamily: "Georgia",
      fontSize: 14,
      color: colors.textPrimary,
      lineHeight: 22,
    },
  });
}
