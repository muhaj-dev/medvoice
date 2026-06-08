import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = { transcript: string };

export function YouSaidCard({ transcript }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>YOU SAID</Text>
      <Text style={styles.transcript}>
        {'“'}{transcript || "No transcript available."}{'”'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.border,
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
  transcript: {
    fontFamily: "Georgia",
    fontSize: 15,
    fontStyle: "italic",
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
