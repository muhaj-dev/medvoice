import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useFamilyStore } from "@/store/useFamilyStore";
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
  const syncedEntries = useFamilyStore((s) => s.syncedEntries);

  const connectedMember =
    members.find((m) => m.connectionStatus === "online") ?? null;

  if (!connectedMember) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
        <CareViewEmptyState />
      </SafeAreaView>
    );
  }

  const latestEntry = syncedEntries[0] ?? null;
  const recentEntries = syncedEntries.slice(1, 4);
  const count = deriveConcernCount(latestEntry?.severity ?? null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* MONITORING + LIVE badge */}
        <View className="flex-row items-center justify-between mb-3.5">
          <Text style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1.2 }}>
            MONITORING
          </Text>
          <LiveMonitoringBadge />
        </View>

        {/* Name heading */}
        <View className="mb-5">
          <Text style={{ fontFamily: 'Georgia', fontSize: 32, fontWeight: '700', color: colors.textPrimary, lineHeight: 38 }}>
            {connectedMember.name}'s
          </Text>
          <Text style={{ fontFamily: 'Georgia', fontSize: 32, fontWeight: '700', fontStyle: 'italic', color: colors.successGreen, lineHeight: 38 }}>
            Health
          </Text>
        </View>

        {/* Concern banner */}
        {latestEntry && <ConcernFlaggedBanner count={count} />}

        {/* Latest entry */}
        {latestEntry ? (
          <LatestEntryCard entry={latestEntry} />
        ) : (
          <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 14, gap: 8 }}>
            <Text style={{ fontSize: 28 }}>📡</Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
              Waiting for P2P sync
            </Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 12, color: colors.textMuted, textAlign: 'center', lineHeight: 18 }}>
              {connectedMember?.name ?? 'Your family member'} needs to open their MedVoice app to sync health data
            </Text>
          </View>
        )}

        {/* Recent entries label */}
        <Text style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1.2, marginBottom: 14 }}>
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
            <Text style={{ fontFamily: 'Georgia', fontSize: 13, color: colors.textMuted }}>
              No previous entries
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
