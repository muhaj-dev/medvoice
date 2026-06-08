import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/useHealthStore";
import { TimelineSearchBar } from "@/components/TimelineSearchBar";
import { TimelineEntryCard } from "@/components/TimelineEntryCard";
import { TimelineVerticalLine } from "@/components/TimelineVerticalLine";
import type { HealthEntry } from "@/types/health";

function filterEntries(entries: HealthEntry[], query: string): HealthEntry[] {
  if (!query.trim()) return entries;
  const q = query.toLowerCase();
  return entries.filter(
    (e) =>
      e.transcript.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export default function TimelineScreen() {
  const { entries } = useHealthStore();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<HealthEntry[]>(entries);

  useEffect(() => {
    setFiltered(filterEntries(entries, query));
  }, [entries, query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Heading */}
        <View className="px-5 pt-4 pb-6">
          <Text className="font-georgia text-[36px] font-bold text-white leading-[44px]">
            Health
          </Text>
          <Text className="font-georgia text-[36px] font-bold italic text-brand leading-[44px]">
            Timeline
          </Text>
        </View>

        {/* Search */}
        <View className="px-5 mb-6">
          <TimelineSearchBar onSearch={setQuery} />
        </View>

        {/* Entries */}
        {filtered.length === 0 ? (
          <View className="items-center pt-[60px] px-10 gap-3">
            <Text className="text-[36px]">🔍</Text>
            <Text className="font-georgia text-[15px] text-dim text-center">
              No entries found
            </Text>
            <Text className="font-georgia text-[13px] text-ghost text-center leading-5">
              {query
                ? "Try a different search term"
                : "Record your first health entry to get started"}
            </Text>
          </View>
        ) : (
          <View className="px-5 relative">
            <TimelineVerticalLine />
            {filtered.map((entry) => (
              <TimelineEntryCard key={entry.id} entry={entry} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
