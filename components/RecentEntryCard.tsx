import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import type { ColorTokens } from "@/constants/colors";
import type { HealthEntry } from "@/types/health";

type Props = {
  entry: HealthEntry;
  isLatest?: boolean;
};

function formatTimestamp(iso: string, todayLabel: string, yesterdayLabel: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86_400_000);
  const startOfEntry = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  if (startOfEntry.getTime() === startOfToday.getTime()) return `${todayLabel} · ${time}`;
  if (startOfEntry.getTime() === startOfYesterday.getTime()) return `${yesterdayLabel} · ${time}`;
  return `${d.toLocaleDateString("en-US", { weekday: "short" })} · ${time}`;
}

function severityColor(severity: HealthEntry["severity"], colors: ColorTokens): string {
  if (severity === "moderate") return colors.warningRed;
  if (severity === "mild") return colors.warningAmber;
  return colors.successGreen;
}

export function RecentEntryCard({ entry, isLatest }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={{
        backgroundColor: colors.bgCard,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 8,
        marginBottom: 10,
      }}
    >
      <View className="flex-row items-center gap-2">
        <View style={[styles.dot, { backgroundColor: severityColor(entry.severity, colors) }]} />
        <Text style={{ fontFamily: "monospace", fontSize: 11, color: colors.textMuted, flex: 1 }}>
          {formatTimestamp(entry.timestamp, t("timeline.today"), t("timeline.yesterday"))}
        </Text>
        {isLatest && (
          <Text style={{ fontFamily: "monospace", fontSize: 10, color: colors.accentBlue, letterSpacing: 0.6 }}>
            {t("timeline.latest")}
          </Text>
        )}
      </View>

      <Text
        style={{ fontFamily: "Georgia", fontSize: 14, color: colors.textSecondary, fontStyle: "italic", lineHeight: 21 }}
        numberOfLines={2}
      >
        {`"${entry.transcript}"`}
      </Text>

      {entry.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5">
          {entry.tags.slice(0, 4).map((tag) => (
            <View
              key={tag}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 99,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontFamily: "monospace", fontSize: 10, color: colors.textSecondary }}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: { width: 8, height: 8, borderRadius: 4 },
});
