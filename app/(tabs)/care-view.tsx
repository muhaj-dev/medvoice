import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useFamilyStore } from "@/store/useFamilyStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { prewarmTTS } from "@/lib/tts";
import { LiveMonitoringBadge } from "@/components/LiveMonitoringBadge";
import { ConcernFlaggedBanner } from "@/components/ConcernFlaggedBanner";
import { LatestEntryCard } from "@/components/LatestEntryCard";
import { CareViewEntryRow } from "@/components/CareViewEntryRow";
import { CareViewEmptyState } from "@/components/CareViewEmptyState";
import { CareViewMemberSwitcher } from "@/components/CareViewMemberSwitcher";

function deriveConcernCount(severity: string | null): number {
  if (severity === "moderate") return 2;
  if (severity === "mild") return 1;
  return 0;
}

// Public keys can differ in case/whitespace between a scanned QR and the
// sender key on the wire — normalize before matching entries to a member.
const normKey = (k: string | undefined) => (k ?? "").trim().toLowerCase();

export default function CareViewScreen() {
  const colors = useTheme();
  const members = useFamilyStore((s) => s.members);
  const syncedEntries = useFamilyStore((s) => s.syncedEntries);
  // null until the user picks someone — then we honor their choice; otherwise
  // default to a live member, falling back to the first connected one.
  const [pickedId, setPickedId] = useState<string | null>(null);
  const ttsEnabled = useSettingsStore((s) => s.ttsEnabled);

  // Care View loads no other AI model, so warming TTS here makes Read Aloud
  // on the entry cards near-instant with nothing to compete for RAM.
  useEffect(() => {
    if (ttsEnabled) prewarmTTS();
  }, [ttsEnabled]);

  if (members.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
        <CareViewEmptyState />
      </SafeAreaView>
    );
  }

  const selectedMember =
    members.find((m) => m.id === pickedId) ??
    members.find((m) => m.connectionStatus === "online") ??
    members[0];
  const isLive = selectedMember.connectionStatus === "online";

  // Only this member's synced entries (newest first — already sorted in store).
  const memberEntries = syncedEntries.filter(
    (e) => normKey(e.fromKey) === normKey(selectedMember.publicKey)
  );
  const latestEntry = memberEntries[0] ?? null;
  const recentEntries = memberEntries.slice(1);
  const count = deriveConcernCount(latestEntry?.severity ?? null);

  // Entry count per member (by id) — shown in the switcher so it's clear who
  // has synced data and entries are visibly partitioned per person.
  const entryCounts: Record<string, number> = {};
  for (const m of members) {
    entryCounts[m.id] = syncedEntries.filter(
      (e) => normKey(e.fromKey) === normKey(m.publicKey)
    ).length;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-3.5">
          <Text style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1.2 }}>
            MONITORING
          </Text>
          <LiveMonitoringBadge online={isLive} />
        </View>

        {/* Member switcher — pick whose health to view */}
        <View className="mb-4">
          <CareViewMemberSwitcher
            members={members}
            selectedId={selectedMember.id}
            entryCounts={entryCounts}
            onSelect={setPickedId}
          />
        </View>

        <View className="mb-5">
          <Text style={{ fontFamily: 'Georgia', fontSize: 32, fontWeight: '700', color: colors.textPrimary, lineHeight: 38 }}>
            {selectedMember.name}&apos;s
          </Text>
          <Text style={{ fontFamily: 'Georgia', fontSize: 32, fontWeight: '700', fontStyle: 'italic', color: colors.successGreen, lineHeight: 38 }}>
            Health
          </Text>
        </View>

        {latestEntry && <ConcernFlaggedBanner count={count} />}

        {latestEntry ? (
          <LatestEntryCard entry={latestEntry} />
        ) : (
          <View style={{ backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 14, gap: 8 }}>
            <Text style={{ fontSize: 28 }}>📡</Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>
              Waiting for P2P sync
            </Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 12, color: colors.textMuted, textAlign: 'center', lineHeight: 18 }}>
              {selectedMember.name} needs to open their MedVoice app to sync health data
            </Text>
          </View>
        )}

        <Text style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1.2, marginBottom: 14 }}>
          ENTRY HISTORY · READ ONLY
        </Text>

        {recentEntries.length > 0 ? (
          recentEntries.map((entry, i) => (
            <CareViewEntryRow key={entry.id} entry={entry} isLast={i === recentEntries.length - 1} />
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
