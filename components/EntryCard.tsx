import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import type { HealthEntry } from "@/types/health";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatTimestamp(timestamp: string): string {
  const entry = new Date(timestamp);
  const now = new Date();

  const timeStr = entry.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const sameYear = entry.getFullYear() === now.getFullYear();
  const sameMonth = entry.getMonth() === now.getMonth();
  const sameDay = entry.getDate() === now.getDate();

  if (sameYear && sameMonth && sameDay) return `Today · ${timeStr}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    entry.getFullYear() === yesterday.getFullYear() &&
    entry.getMonth() === yesterday.getMonth() &&
    entry.getDate() === yesterday.getDate()
  ) {
    return `Yesterday · ${timeStr}`;
  }

  const daysAgo = Math.floor(
    (now.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysAgo < 7) return `${DAY_NAMES[entry.getDay()]} · ${timeStr}`;

  return `${MONTH_NAMES[entry.getMonth()]} ${entry.getDate()} · ${timeStr}`;
}

// dot color is computed at runtime (dynamic style — StyleSheet exception)
function getDotColor(severity: HealthEntry["severity"]): string {
  if (severity === "moderate") return colors.warningRed;
  if (severity === "mild") return colors.warningAmber;
  return colors.successGreen;
}

type EntryCardProps = {
  entry: HealthEntry;
};

export function EntryCard({ entry }: EntryCardProps) {
  const router = useRouter();
  const dotColor = getDotColor(entry.severity);
  const timestamp = formatTimestamp(entry.timestamp);

  return (
    <View className="bg-card border border-edge rounded-2xl px-4 py-3.5 mb-2.5">
      {/* Top row: dot + timestamp + VIEW → */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          {/* backgroundColor is dynamic → inline style (dynamic style exception) */}
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
          <Text className="font-code text-[12px] text-dim">{timestamp}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.navigate({
              pathname: "/analysis/summary" as any,
              params: { id: entry.id },
            })
          }
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 12, right: 8 }}
        >
          <Text className="font-code text-[11px] font-semibold text-brand tracking-[0.5px]">
            VIEW →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transcript snippet */}
      <Text
        className="font-georgia italic text-[13px] text-dim leading-4.75 mb-2.5"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        "{entry.transcript}"
      </Text>

      {/* Category tag pills */}
      {entry.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <View key={tag} className="bg-edge rounded-full px-2 py-0.5">
              <Text className="font-code text-[10px] text-dim">{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
