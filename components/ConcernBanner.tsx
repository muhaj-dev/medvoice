import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Severity = "moderate" | "mild" | "good";

type Props = {
  severity: Severity;
  patternCount?: number;
};

const CONFIG: Record<Severity, {
  label: string;
  color: string;
  bg: string;
  borderColor: string;
}> = {
  moderate: {
    label: "MODERATE CONCERN",
    color: colors.warningRed,
    bg: "rgba(248,113,113,0.1)",
    borderColor: "rgba(248,113,113,0.25)",
  },
  mild: {
    label: "MILD CONCERN",
    color: colors.warningAmber,
    bg: "rgba(251,191,36,0.08)",
    borderColor: "rgba(251,191,36,0.25)",
  },
  good: {
    label: "LOOKING GOOD",
    color: colors.successGreen,
    bg: "rgba(52,211,153,0.08)",
    borderColor: "rgba(52,211,153,0.25)",
  },
};

export function ConcernBanner({ severity, patternCount = 0 }: Props) {
  const cfg = CONFIG[severity];
  const showPatterns = severity !== "good" && patternCount > 0;

  return (
    <View style={[styles.banner, { backgroundColor: cfg.bg, borderColor: cfg.borderColor }]}>
      <Text style={styles.emoji}>⚠️</Text>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
          {showPatterns && (
            <Text style={[styles.count, { color: cfg.color }]}>
              · {patternCount} pattern{patternCount !== 1 ? "s" : ""} flagged
            </Text>
          )}
        </View>
        <Text style={styles.subtext}>Review MedPsy's findings below</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  emoji: {
    fontSize: 22,
    marginTop: 1,
  },
  content: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  label: {
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.0,
    flex: 1,
  },
  count: {
    fontFamily: "monospace",
    fontSize: 11,
    textAlign: "right",
    marginLeft: 8,
  },
  subtext: {
    fontFamily: "Georgia",
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
