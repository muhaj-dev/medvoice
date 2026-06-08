import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = { summary: string; tags: string[] };

export function AnalysisSummaryCard({ summary, tags }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>MEDPSY ANALYSIS</Text>
      <Text style={styles.summary}>{summary}</Text>
      {tags.length > 0 && (
        <View style={styles.tags}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  label: {
    fontFamily: "monospace",
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  summary: {
    fontFamily: "Georgia",
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 23,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: "monospace",
    fontSize: 10,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
});
