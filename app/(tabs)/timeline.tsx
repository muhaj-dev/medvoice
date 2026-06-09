import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useHealthStore } from "@/store/useHealthStore";
import { TimelineSearchBar } from "@/components/TimelineSearchBar";
import { TimelineEntryCard } from "@/components/TimelineEntryCard";
import { TimelineVerticalLine } from "@/components/TimelineVerticalLine";
import { semanticSearch } from "@/lib/embeddings";
import type { HealthEntry } from "@/types/health";

export default function TimelineScreen() {
  const colors = useTheme();
  const { entries } = useHealthStore();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HealthEntry[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Empty query shows all entries (see `displayed` below) — nothing to search.
    if (!query.trim()) return;
    let cancelled = false;

    // All state updates live inside this async fn so none run synchronously
    // in the effect body (avoids cascading-render lint + keeps loading UX).
    const run = async () => {
      setIsSearching(true);
      try {
        const results = await semanticSearch(query, entries);
        if (!cancelled) setSearchResults(results);
      } catch {
        // Keyword fallback if the embedding model isn't ready yet.
        const q = query.toLowerCase();
        const fallback = entries.filter(
          (e) =>
            e.transcript.toLowerCase().includes(q) ||
            e.tags.some((t) => t.toLowerCase().includes(q))
        );
        if (!cancelled) setSearchResults(fallback);
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [query, entries]);

  const trimmed = query.trim();
  const displayed = trimmed ? (searchResults ?? []) : entries;
  // Only show the spinner while actively searching a non-empty query.
  const showSearching = !!trimmed && isSearching;

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
          <Text style={{ fontFamily: 'Georgia', fontSize: 36, fontWeight: '700', color: colors.textPrimary, lineHeight: 44 }}>
            Health
          </Text>
          <Text style={{ fontFamily: 'Georgia', fontSize: 36, fontWeight: '700', fontStyle: 'italic', color: colors.accentBlue, lineHeight: 44 }}>
            Timeline
          </Text>
        </View>

        {/* Search */}
        <View className="px-5 mb-6">
          <TimelineSearchBar onSearch={setQuery} />
        </View>

        {/* Searching indicator */}
        {showSearching && (
          <View className="items-center pt-6 pb-2">
            <ActivityIndicator size="small" color={colors.accentBlue} />
            <Text style={{ fontFamily: "monospace", fontSize: 11, color: colors.textSecondary, letterSpacing: 1, marginTop: 8 }}>
              SEARCHING...
            </Text>
          </View>
        )}

        {/* Entries */}
        {!showSearching && displayed.length === 0 ? (
          <View className="items-center pt-[60px] px-10 gap-3">
            <Text className="text-[36px]">🔍</Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 15, color: colors.textSecondary, textAlign: 'center' }}>
              No entries found
            </Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 }}>
              {query
                ? "Try a different search term"
                : "Record your first health entry to get started"}
            </Text>
          </View>
        ) : !showSearching ? (
          <View className="px-5 relative">
            <TimelineVerticalLine />
            {displayed.map((entry) => (
              <TimelineEntryCard key={entry.id} entry={entry} />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
