import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { ColorTokens } from "@/constants/colors";
import type { HealthEntry } from "@/types/health";

type Props = {
  entry: HealthEntry;
  isLast: boolean;
};

function severityColor(severity: HealthEntry["severity"], colors: ColorTokens): string {
  if (severity === "moderate") return colors.warningRed;
  if (severity === "mild") return colors.warningAmber;
  return colors.successGreen;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);
  const entryStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  if (entryStart.getTime() === todayStart.getTime()) return `Today · ${time}`;
  if (entryStart.getTime() === yesterdayStart.getTime()) return `Yesterday · ${time}`;
  return `${d.toLocaleDateString("en-US", { weekday: "short" })} · ${time}`;
}

export function CareViewEntryRow({ entry, isLast }: Props) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const sc = severityColor(entry.severity, colors);

  return (
    <View style={styles.row}>
      <View style={styles.leftCol}>
        <View style={[styles.dot, { backgroundColor: sc }]} />
        {!isLast && <View style={[styles.line, { backgroundColor: sc }]} />}
      </View>

      <View style={[styles.content, isLast && styles.contentLast]}>
        <Text style={styles.timestamp}>{formatTimestamp(entry.timestamp)}</Text>
        <Text style={styles.transcript} numberOfLines={2}>
          {`"${entry.transcript}"`}
        </Text>
      </View>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    row: { flexDirection: "row", gap: 14 },
    leftCol: { alignItems: "center", width: 10 },
    dot: { width: 10, height: 10, borderRadius: 5, marginTop: 15, flexShrink: 0 },
    line: { flex: 1, width: 2, marginTop: 5, borderRadius: 1, opacity: 0.5 },
    content: {
      flex: 1,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 10,
      gap: 5,
    },
    contentLast: { marginBottom: 0 },
    timestamp: { fontFamily: "Georgia", fontSize: 12, color: colors.textSecondary },
    transcript: {
      fontFamily: "Georgia",
      fontSize: 13,
      fontStyle: "italic",
      color: colors.textSecondary,
      lineHeight: 19,
    },
  });
}
