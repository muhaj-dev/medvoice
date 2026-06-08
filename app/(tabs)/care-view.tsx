import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useFamilyStore } from "@/store/useFamilyStore";
import { useHealthStore } from "@/store/useHealthStore";
import { LiveMonitoringBadge } from "@/components/LiveMonitoringBadge";
import { ConcernFlaggedBanner } from "@/components/ConcernFlaggedBanner";
import { LatestEntryCard } from "@/components/LatestEntryCard";
import { CareViewEntryRow } from "@/components/CareViewEntryRow";
import { CareViewEmptyState } from "@/components/CareViewEmptyState";

function deriveConcernCount(severity: string | null): number {
  if (severity === "moderate") return 2;
  if (severity === "mild") return 1;
  return 0;
}

export default function CareViewScreen() {
  const colors = useTheme();
  const members = useFamilyStore((s) => s.members);
  const entries = useHealthStore((s) => s.entries);

  const connectedMember =
    members.find((m) => m.connectionStatus === "online") ?? members[0] ?? null;

  if (!connectedMember) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
        <CareViewEmptyState />
      </SafeAreaView>
    );
  }

  const latestEntry = entries[0] ?? null;
  const recentEntries = entries.slice(1, 4);
  const count = deriveConcernCount(latestEntry?.severity ?? null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* MONITORING + LIVE badge */}
        <View className="flex-row items-center justify-between mb-3.5">
          <Text className="font-code text-[10px] font-semibold text-dim tracking-[1.2px]">
            MONITORING
          </Text>
          <LiveMonitoringBadge />
        </View>

        {/* Name heading */}
        <View className="mb-5">
          <Text className="font-georgia text-[32px] font-bold text-white leading-[38px]">
            {connectedMember.name}&apos;s
          </Text>
          <Text className="font-georgia text-[32px] font-bold italic text-teal leading-[38px]">
            Health
          </Text>
        </View>

        {/* Concern banner */}
        {latestEntry && <ConcernFlaggedBanner count={count} />}

        {/* Latest entry */}
        {latestEntry ? (
          <LatestEntryCard entry={latestEntry} />
        ) : (
          <View className="bg-card border border-edge rounded-2xl p-[18px] items-center mb-3.5">
            <Text className="font-georgia text-[14px] text-dim">
              No entries synced yet
            </Text>
          </View>
        )}

        {/* Recent entries label */}
        <Text className="font-code text-[10px] font-semibold text-dim tracking-[1.2px] mb-3.5">
          RECENT ENTRIES · READ ONLY
        </Text>

        {recentEntries.length > 0 ? (
          recentEntries.map((entry, i) => (
            <CareViewEntryRow
              key={entry.id}
              entry={entry}
              isLast={i === recentEntries.length - 1}
            />
          ))
        ) : (
          <View className="items-center py-6">
            <Text className="font-georgia text-[13px] text-ghost">
              No previous entries
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
