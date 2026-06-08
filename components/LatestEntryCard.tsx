import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import type { HealthEntry } from "@/types/health";

type Props = {
  entry: HealthEntry;
};

const AMBER_KEYWORDS = ["glucose", "blood", "sugar", "pressure", "cholesterol", "insulin"];

function tagColor(tag: string): string {
  return AMBER_KEYWORDS.some((k) => tag.toLowerCase().includes(k))
    ? colors.warningAmber
    : colors.textSecondary;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const entryStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  if (entryStart.getTime() === todayStart.getTime()) return `Today · ${time}`;
  return `${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · ${time}`;
}

export function LatestEntryCard({ entry }: Props) {
  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.entryLabel}>LATEST ENTRY</Text>
        <Text style={styles.timestamp}>{formatTimestamp(entry.timestamp)}</Text>
      </View>

      <View style={styles.divider} />

      {/* Transcript */}
      <Text style={styles.transcript}>"{entry.transcript}"</Text>

      <View style={styles.divider} />

      {/* MedPsy summary */}
      <Text style={styles.summaryLabel}>MEDPSY SUMMARY</Text>
      <Text style={styles.summaryText}>{entry.analysis}</Text>

      {/* Tag pills */}
      {entry.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {entry.tags.slice(0, 4).map((tag) => {
            const tc = tagColor(tag);
            return (
              <View key={tag} style={[styles.tagPill, { borderColor: tc }]}>
                <Text style={[styles.tagText, { color: tc }]}>{tag}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  entryLabel: {
    fontFamily: "monospace",
    fontSize: 10,
    color: colors.accentBlue,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  timestamp: {
    fontFamily: "Georgia",
    fontSize: 12,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  transcript: {
    fontFamily: "Georgia",
    fontSize: 15,
    fontStyle: "italic",
    color: colors.textSecondary,
    lineHeight: 24,
  },
  summaryLabel: {
    fontFamily: "monospace",
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: "600",
    letterSpacing: 1.0,
    marginBottom: 8,
  },
  summaryText: {
    fontFamily: "Georgia",
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontFamily: "Georgia",
    fontSize: 12,
    fontWeight: "500",
  },
});
