import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = { text: string };

/**
 * Shows the raw text recognized from the scanned page. Large, high-contrast,
 * non-italic body type so the reader can verify the OCR against the paper.
 */
export function ScannedTextCard({ text }: Props) {
  const colors = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 18,
    },
    label: {
      fontFamily: "monospace",
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 1.2,
      marginBottom: 10,
    },
    text: {
      fontFamily: "Georgia",
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 24,
    },
    empty: {
      fontFamily: "Georgia",
      fontSize: 15,
      fontStyle: "italic",
      color: colors.textSecondary,
      lineHeight: 24,
    },
  });

  return (
    <View style={styles.card}>
      <Text style={styles.label}>📄 SCANNED TEXT</Text>
      <Text style={text ? styles.text : styles.empty}>
        {text || "No readable text was found in the photo. Try again with better lighting."}
      </Text>
    </View>
  );
}
