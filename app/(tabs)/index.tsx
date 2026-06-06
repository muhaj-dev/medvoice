import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/useUserStore";
import { useHealthStore, computeInsightStats } from "@/store/useHealthStore";
import { EntryCard } from "@/components/EntryCard";
import type { InsightStat } from "@/types/health";

type ActiveTab = "entries" | "insights";

const DAYS = [
  "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
  "THURSDAY", "FRIDAY", "SATURDAY",
];
const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

function getFormattedDate(): string {
  const now = new Date();
  return `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}

// ─── Privacy Badge ────────────────────────────────────────────────────────────

function PrivacyBadge() {
  return (
    <View className="medv-badge medv-badge--privacy">
      <View className="w-2 h-2 rounded-full bg-teal" />
      <Text className="font-code text-[11px] font-semibold text-white tracking-[1.2px]">
        ALL DATA ON-DEVICE
      </Text>
    </View>
  );
}

// ─── Microphone Card ──────────────────────────────────────────────────────────

function MicrophoneCard({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-card border border-edge rounded-2xl p-6"
    >
      <View className="w-16 h-16 rounded-full bg-brand items-center justify-center mb-4">
        <Ionicons name="mic" size={28} color="#fff" />
      </View>
      <Text className="font-georgia text-[20px] font-semibold text-white mb-2">
        How are you feeling?
      </Text>
      <Text className="font-georgia text-[13px] text-dim leading-5">
        Tap to speak. MedPsy analyzes locally — your words never leave this
        device.
      </Text>
    </TouchableOpacity>
  );
}

// ─── Entries / Insights Toggle ────────────────────────────────────────────────

function EntriesInsightsToggle({
  active,
  onChange,
}: {
  active: ActiveTab;
  onChange: (tab: ActiveTab) => void;
}) {
  return (
    <View className="medv-toggle">
      <TouchableOpacity
        onPress={() => onChange("entries")}
        activeOpacity={0.7}
        className={`medv-toggle-item ${active === "entries" ? "medv-toggle-item--active" : ""}`}
      >
        <Text
          className={`font-code text-[12px] font-semibold tracking-[1px] ${
            active === "entries" ? "text-white" : "text-dim"
          }`}
        >
          ENTRIES
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange("insights")}
        activeOpacity={0.7}
        className={`medv-toggle-item ${active === "insights" ? "medv-toggle-item--active" : ""}`}
      >
        <Text
          className={`font-code text-[12px] font-semibold tracking-[1px] ${
            active === "insights" ? "text-white" : "text-dim"
          }`}
        >
          INSIGHTS
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Insight Stat Card ────────────────────────────────────────────────────────

function InsightStatCard({ stat }: { stat: InsightStat }) {
  // Conditional Tailwind classes — full strings are literals so the scanner picks them up
  const valueClass =
    stat.trendColor === "red"
      ? "text-danger"
      : stat.trendColor === "green"
      ? "text-teal"
      : "text-warn";

  const trendSymbol =
    stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "~";

  return (
    <View className="medv-card">
      <View className="flex-row justify-between items-start mb-1">
        <Text className="font-code text-[11px] font-semibold text-dim tracking-[1.2px]">
          {stat.label}
        </Text>
        <Text className={`text-[20px] font-bold ${valueClass}`}>
          {trendSymbol}
        </Text>
      </View>
      <View className="flex-row items-baseline gap-1.5">
        <Text className={`font-georgia text-[36px] font-bold ${valueClass}`}>
          {stat.value}
        </Text>
        <Text className="font-georgia text-[13px] text-dim">{stat.unit}</Text>
      </View>
    </View>
  );
}

// ─── Empty Entries State ──────────────────────────────────────────────────────

function EmptyEntriesState() {
  return (
    <View className="items-center justify-center py-12 gap-2.5">
      <Ionicons name="mic-outline" size={36} color={colors.textSecondary} />
      <Text className="font-georgia text-[16px] text-dim mt-1">
        No entries yet
      </Text>
      <Text className="font-georgia text-[13px] text-dim text-center leading-5 px-6 opacity-70">
        Tap the microphone above to log your first health update.
      </Text>
    </View>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useUserStore();
  const entries = useHealthStore((state) => state.entries);
  const [activeTab, setActiveTab] = useState<ActiveTab>("insights");

  const insightStats = useMemo(() => computeInsightStats(entries), [entries]);
  const dateLabel = useMemo(() => getFormattedDate(), []);
  const greeting = useMemo(() => getGreeting(), []);
  const displayName = profile?.name ?? "Friend";

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header row: date + family button ── */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-code text-[11px] font-semibold text-dim tracking-[1.2px]">
            {dateLabel}
          </Text>
          <TouchableOpacity
            onPress={() => router.navigate("/family")}
            activeOpacity={0.8}
            className="w-11 h-11 rounded-full bg-brand items-center justify-center"
          >
            <Ionicons name="people" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Greeting ── */}
        <View className="mb-4">
          <Text className="font-georgia text-[28px] text-white leading-9">
            {greeting}
          </Text>
          <Text className="font-georgia text-[28px] font-bold italic text-teal leading-9">
            {displayName}
          </Text>
        </View>

        {/* ── Privacy badge ── */}
        <View className="mb-5">
          <PrivacyBadge />
        </View>

        {/* ── Mic card ── */}
        <View className="mb-4">
          <MicrophoneCard onPress={() => router.navigate("/log")} />
        </View>

        {/* ── Toggle ── */}
        <View className="mb-4">
          <EntriesInsightsToggle active={activeTab} onChange={setActiveTab} />
        </View>

        {/* ── Content ── */}
        {activeTab === "insights" ? (
          <View className="gap-3">
            {insightStats.map((stat) => (
              <InsightStatCard key={stat.label} stat={stat} />
            ))}
          </View>
        ) : (
          <View>
            {entries.length === 0 ? (
              <EmptyEntriesState />
            ) : (
              <View>
                {entries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
