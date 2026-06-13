import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useUserStore } from "@/store/useUserStore";
import { useHealthStore } from "@/store/useHealthStore";
import { useModelStore } from "@/store/useModelStore";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { TapToTalkCard } from "@/components/TapToTalkCard";
import { RecentEntryCard } from "@/components/RecentEntryCard";
import { ModelLoadingModal } from "@/components/ModelLoadingModal";

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
  const colors = useTheme();
  const profile = useUserStore((s) => s.profile);
  const entries = useHealthStore((s) => s.entries);
  const recentEntries = useMemo(() => entries.slice(0, 3), [entries]);
  const { allReady, anyLoading, parakeet, medgemma, embedding, tts } = useModelStore();
  const [modelModalVisible, setModelModalVisible] = useState(false);

  const isReady = allReady();
  const isLoading = anyLoading();
  // Boot progress = download progress of all four model files.
  const states = { parakeet, medgemma, embedding, tts };
  const totalProgress = ['parakeet', 'medgemma', 'embedding', 'tts'].reduce((sum, k) => {
    const s = states[k as keyof typeof states];
    return sum + (s.status === 'ready' ? 100 : s.progress);
  }, 0) / 4;

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
          <Text style={{ fontFamily: 'monospace', fontSize: 11, color: colors.textSecondary, letterSpacing: 1.2 }}>
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
          <Text style={{ fontFamily: 'Georgia', fontSize: 28, fontWeight: '700', color: colors.textPrimary, lineHeight: 34 }}>
            {getGreeting()}
          </Text>
          <Text style={{ fontFamily: 'Georgia', fontSize: 28, fontWeight: '700', fontStyle: 'italic', color: colors.successGreen, lineHeight: 34 }}>
            {profile?.name ?? "there"}
          </Text>
        </View>

        {/* AI model status pill — always tappable to open modal */}
        <TouchableOpacity
          onPress={() => setModelModalVisible(true)}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
            backgroundColor: colors.bgCard, borderWidth: 1,
            borderColor: isReady ? colors.successGreen : isLoading ? colors.accentBlue : colors.border,
            borderRadius: 99, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 14, gap: 6,
          }}
        >
          <View style={{
            width: 6, height: 6, borderRadius: 3,
            backgroundColor: isReady ? colors.successGreen : isLoading ? colors.accentBlue : colors.textMuted,
          }} />
          <Text style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: 0.8,
            color: isReady ? colors.successGreen : isLoading ? colors.accentBlue : colors.textMuted,
          }}>
            {isReady ? 'AI READY' : `AI MODELS · ${Math.round(totalProgress)}%`}
          </Text>
          <Ionicons name="chevron-forward" size={10}
            color={isReady ? colors.successGreen : isLoading ? colors.accentBlue : colors.textMuted} />
        </TouchableOpacity>

        <ModelLoadingModal visible={modelModalVisible} onClose={() => setModelModalVisible(false)} />

        {/* Privacy badge */}
        <PrivacyBadge />

        {/* Tap to Talk card */}
        <View className="mt-4.5 mb-5.5">
          <TapToTalkCard />
        </View>

        {/* Recent Entries header */}
        <View className="flex-row items-center justify-between mb-3">
          <Text style={{ fontFamily: 'monospace', fontSize: 11, color: colors.textSecondary, letterSpacing: 1.2 }}>
            RECENT ENTRIES
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/timeline" as any)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={{ fontFamily: 'monospace', fontSize: 11, color: colors.accentBlue }}>SEE ALL →</Text>
          </TouchableOpacity>
        </View>

        {/* Entry list or empty state */}
        {recentEntries.length === 0 ? (
          <View className="items-center py-9 gap-1.5">
            <Text className="text-[32px] mb-2">🎙️</Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 15, color: colors.textSecondary }}>No entries yet</Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 }}>
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
