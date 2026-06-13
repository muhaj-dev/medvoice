import { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { ReadAloudButton } from "@/components/ReadAloudButton";
import { SpokenText } from "@/components/SpokenText";
import type { ColorTokens } from "@/constants/colors";
import type { HealthEntry, Severity } from "@/types/health";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = { entry: HealthEntry };

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  const time = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diffDays === 0) return `Today • ${time}`;
  if (diffDays === 1) return `Yesterday • ${time}`;
  const day = date.toLocaleDateString([], { weekday: "short" });
  return `${day} • ${time}`;
}

function severityColor(severity: NonNullable<Severity>, colors: ColorTokens): string {
  if (severity === "moderate") return colors.warningRed;
  if (severity === "mild") return colors.warningAmber;
  return colors.successGreen;
}

export function TimelineEntryCard({ entry }: Props) {
  const colors = useTheme();
  const [expanded, setExpanded] = useState(true);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const dotColor = entry.severity ? severityColor(entry.severity, colors) : colors.textMuted;
  const sevColor = entry.severity ? severityColor(entry.severity, colors) : colors.textMuted;

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={styles.row}>
      <View style={styles.dotCol}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      </View>

      <TouchableOpacity style={styles.card} onPress={handleToggle} activeOpacity={0.85}>
        <View style={styles.header}>
          <Text style={styles.timestamp}>{formatTimestamp(entry.timestamp)}</Text>
          <Text style={styles.chevron}>{expanded ? "∧" : "∨"}</Text>
        </View>

        {expanded && (
          <>
            <Text style={styles.transcript}>
              {'"'}{entry.transcript}{'"'}
            </Text>

            {!!entry.analysis && (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>MEDPSY SUMMARY</Text>
                <SpokenText id={`tl-${entry.id}`} text={entry.analysis} style={styles.summaryText} />
                <ReadAloudButton id={`tl-${entry.id}`} text={entry.analysis} />
              </View>
            )}

            <View style={styles.footer}>
              <View style={styles.tags}>
                {entry.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              {entry.severity && (
                <View style={[styles.badge, { borderColor: sevColor }]}>
                  <Text style={[styles.badgeText, { color: sevColor }]}>
                    {entry.severity.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
    dotCol: { width: 20, alignItems: "center", paddingTop: 18, zIndex: 1 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    card: {
      flex: 1,
      marginLeft: 12,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 16,
      gap: 12,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    timestamp: { fontFamily: "Georgia", fontSize: 13, color: colors.textSecondary },
    chevron: { fontSize: 12, color: colors.textSecondary },
    transcript: {
      fontFamily: "Georgia",
      fontSize: 15,
      fontStyle: "italic",
      color: colors.textSecondary,
      lineHeight: 24,
    },
    summaryBox: {
      backgroundColor: colors.bgDeep,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      gap: 6,
    },
    summaryLabel: {
      fontFamily: "monospace",
      fontSize: 10,
      fontWeight: "600",
      color: colors.accentBlue,
      letterSpacing: 1.0,
    },
    summaryText: {
      fontFamily: "Georgia",
      fontSize: 13,
      color: colors.textPrimary,
      lineHeight: 20,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
    },
    tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, flex: 1 },
    tag: {
      backgroundColor: colors.border,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 99,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },
    tagText: {
      fontFamily: "monospace",
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 0.3,
    },
    badge: { borderWidth: 1.5, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
    badgeText: { fontFamily: "monospace", fontSize: 10, letterSpacing: 0.5 },
  });
}
