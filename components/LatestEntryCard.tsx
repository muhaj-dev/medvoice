import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { SpokenText } from "@/components/SpokenText";
import type { ColorTokens } from "@/constants/colors";
import type { HealthEntry } from "@/types/health";

type Props = { entry: HealthEntry };

const AMBER_KEYWORDS = ["glucose", "blood", "sugar", "pressure", "cholesterol", "insulin"];

function tagColor(tag: string, colors: ColorTokens): string {
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
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.entryLabel}>LATEST ENTRY</Text>
        <Text style={styles.timestamp}>{formatTimestamp(entry.timestamp)}</Text>
      </View>

      <View style={styles.divider} />
      <Text style={styles.transcript}>{`"${entry.transcript}"`}</Text>
      <View style={styles.divider} />

      <Text style={styles.summaryLabel}>MEDPSY SUMMARY</Text>
      <SpokenText id={`cv-latest-${entry.id}`} text={entry.analysis} style={styles.summaryText} />

      <View style={styles.readAloud}>
        <ReadAloudButton id={`cv-latest-${entry.id}`} text={entry.analysis} />
      </View>

      {entry.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {entry.tags.slice(0, 4).map((tag) => {
            const tc = tagColor(tag, colors);
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

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
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
    timestamp: { fontFamily: "Georgia", fontSize: 12, color: colors.textSecondary },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
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
    summaryText: { fontFamily: "Georgia", fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
    readAloud: { marginTop: 12 },
    tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
    tagPill: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
    tagText: { fontFamily: "Georgia", fontSize: 12, fontWeight: "500" },
  });
}
