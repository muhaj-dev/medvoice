import { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/useUserStore";
import { useHealthStore } from "@/store/useHealthStore";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { TapToTalkCard } from "@/components/TapToTalkCard";
import { RecentEntryCard } from "@/components/RecentEntryCard";

const DAYS = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
const MONTHS = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
                "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];

function getFormattedDate(): string {
  const now = new Date();
  return `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  return "Good evening,";
}

export default function HomeScreen() {
  const profile = useUserStore((s) => s.profile);
  const entries = useHealthStore((s) => s.entries);
  const recentEntries = useMemo(() => entries.slice(0, 3), [entries]);

  return (
    // SafeAreaView: className not supported — use inline style (AGENTS.md exception)
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      {/* ScrollView contentContainerStyle: must use style prop (AGENTS.md exception) */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Date + Settings button */}
        <View className="flex-row items-center justify-between mb-3.5">
          <Text className="font-code text-[11px] text-dim tracking-[1.2px]">
            {getFormattedDate()}
          </Text>
          <TouchableOpacity
            className="w-9.5 h-9.5 rounded-full bg-card border border-edge items-center justify-center"
            onPress={() => router.push("/(tabs)/settings" as any)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="settings-outline" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View className="mb-4">
          <Text className="font-georgia text-[28px] font-bold text-white leading-8.5">
            {getGreeting()}
          </Text>
          <Text className="font-georgia text-[28px] font-bold italic text-teal leading-8.5">
            {profile?.name ?? "there"}
          </Text>
        </View>

        {/* Privacy badge */}
        <PrivacyBadge />

        {/* Tap to Talk card */}
        <View className="mt-4.5 mb-5.5">
          <TapToTalkCard />
        </View>

        {/* Recent Entries header */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-code text-[11px] text-dim tracking-[1.2px]">
            RECENT ENTRIES
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/timeline" as any)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="font-code text-[11px] text-brand">SEE ALL →</Text>
          </TouchableOpacity>
        </View>

        {/* Entry list or empty state */}
        {recentEntries.length === 0 ? (
          <View className="items-center py-9 gap-1.5">
            <Text className="text-[32px] mb-2">🎙️</Text>
            <Text className="font-georgia text-[15px] text-dim">No entries yet</Text>
            <Text className="font-georgia text-[13px] text-ghost text-center leading-5">
              Tap the microphone above to get started
            </Text>
          </View>
        ) : (
          recentEntries.map((entry, i) => (
            <RecentEntryCard key={entry.id} entry={entry} isLatest={i === 0} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
