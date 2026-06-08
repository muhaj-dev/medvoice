import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import type { Pattern } from "@/store/useRecordingStore";

type Props = { pattern: Pattern };

const SEVERITY_COLORS = {
  moderate: colors.warningRed,
  mild: colors.warningAmber,
};

export function PatternCard({ pattern }: Props) {
  const severityColor = SEVERITY_COLORS[pattern.severity];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{pattern.emoji}</Text>
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{pattern.name}</Text>
          <View style={[styles.badge, { borderColor: severityColor }]}>
            <Text style={[styles.badgeText, { color: severityColor }]}>
              {pattern.severity.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{pattern.description}</Text>
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
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  emoji: {
    fontSize: 26,
    lineHeight: 34,
  },
  nameBlock: {
    flex: 1,
    gap: 6,
  },
  name: {
    fontFamily: "Georgia",
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 24,
  },
  badge: {
    borderWidth: 1.5,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  description: {
    fontFamily: "Georgia",
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
