import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export const ScanProcessingHeader = () => {
  const colors = useTheme();
  return (
    <View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>READING DOCUMENT</Text>
      <Text style={[styles.h1, { color: colors.textPrimary }]}>Understanding your</Text>
      <Text style={[styles.h1italic, { color: colors.accentBlue }]}>document</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontFamily: "monospace", fontSize: 11, letterSpacing: 1.54, marginBottom: 20 },
  h1: { fontFamily: "Georgia", fontSize: 32, fontWeight: "700", lineHeight: 38 },
  h1italic: {
    fontFamily: "Georgia",
    fontSize: 32,
    fontWeight: "700",
    fontStyle: "italic",
    lineHeight: 38,
    marginBottom: 36,
  },
});
