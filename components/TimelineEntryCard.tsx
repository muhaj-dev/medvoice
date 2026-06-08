import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from "react-native";
import { colors } from "@/constants/colors";
import type { HealthEntry, Severity } from "@/types/health";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = { entry: HealthEntry };

const DOT_COLOR: Record<NonNullable<Severity>, string> = {
  moderate: colors.warningRed,
  mild: colors.warningAmber,
  good: colors.successGreen,
};

const SEVERITY_COLOR: Record<NonNullable<Severity>, string> = {
  moderate: colors.warningRed,
  mild: colors.warningAmber,
  good: colors.successGreen,
};

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

export function TimelineEntryCard({ entry }: Props) {
  const [expanded, setExpanded] = useState(true);

  const dotColor = entry.severity ? DOT_COLOR[entry.severity] : colors.textMuted;
  const sevColor = entry.severity ? SEVERITY_COLOR[entry.severity] : colors.textMuted;

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View style={styles.row}>
      {/* Timeline dot */}
      <View style={styles.dotCol}>
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      </View>

      {/* Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={handleToggle}
        activeOpacity={0.85}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.timestamp}>{formatTimestamp(entry.timestamp)}</Text>
          <Text style={styles.chevron}>{expanded ? "∧" : "∨"}</Text>
        </View>

        {expanded && (
          <>
            <Text style={styles.transcript}>
              {'"'}{entry.transcript}{'"'}
            </Text>

            {/* Footer */}
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

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  dotCol: {
    width: 20,
    alignItems: "center",
    paddingTop: 18,
    zIndex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
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
  timestamp: {
    fontFamily: "Georgia",
    fontSize: 13,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  transcript: {
    fontFamily: "Georgia",
    fontSize: 15,
    fontStyle: "italic",
    color: colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
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
  badge: {
    borderWidth: 1.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: "monospace",
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
