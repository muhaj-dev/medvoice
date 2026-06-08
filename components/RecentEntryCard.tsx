import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import type { HealthEntry } from "@/types/health";

type Props = {
  entry: HealthEntry;
  isLatest?: boolean;
};

function formatTimestamp(iso: string): string {
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
  if (startOfEntry.getTime() === startOfToday.getTime()) return `Today · ${time}`;
  if (startOfEntry.getTime() === startOfYesterday.getTime()) return `Yesterday · ${time}`;
  return `${d.toLocaleDateString("en-US", { weekday: "short" })} · ${time}`;
}

function severityColor(severity: HealthEntry["severity"]): string {
  if (severity === "moderate") return colors.warningRed;
  if (severity === "mild") return colors.warningAmber;
  return colors.successGreen;
}

export function RecentEntryCard({ entry, isLatest }: Props) {
  return (
    <View className="bg-card border border-edge rounded-2xl px-4 py-3.5 gap-2 mb-2.5">
      {/* Top row */}
      <View className="flex-row items-center gap-2">
        {/* StyleSheet for severity dot: dynamic color cannot be a NativeWind class */}
        <View style={[styles.dot, { backgroundColor: severityColor(entry.severity) }]} />
        <Text className="font-code text-[11px] text-dim flex-1">
          {formatTimestamp(entry.timestamp)}
        </Text>
        {isLatest && (
          <Text className="font-code text-[10px] text-brand tracking-[0.6px]">
            LATEST
          </Text>
        )}
      </View>

      {/* Transcript */}
      <Text
        className="font-georgia text-[14px] text-dim italic leading-5.25"
        numberOfLines={2}
      >
        "{entry.transcript}"
      </Text>

      {/* Tag pills */}
      {entry.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5">
          {entry.tags.slice(0, 4).map((tag) => (
            <View key={tag} className="medv-tag">
              <Text className="font-code text-[10px] text-dim">{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // StyleSheet for dot: backgroundColor is runtime-dynamic (severity value),
  // so it cannot be expressed as a static NativeWind class.
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
