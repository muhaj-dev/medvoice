import { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useUserStore } from "@/store/useUserStore";
import { OnboardingProgressDots } from "@/components/OnboardingProgressDots";
import { FeatureRow } from "@/components/FeatureRow";

const FEATURES = [
  { emoji: "🎙", text: "Speak naturally about how you feel" },
  { emoji: "🧠", text: "MedPsy AI analyzes your health locally" },
  { emoji: "📡", text: "Share with family via private P2P" },
] as const;

export default function WelcomeScreen() {
  const colors = useTheme();
  const router = useRouter();
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);

  useEffect(() => {
    if (onboardingComplete) router.replace("/(tabs)" as any);
  }, [onboardingComplete, router]);

  const styles = StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    scroll: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
    },
    heartCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.bgCard,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.accentBlue,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 28,
      elevation: 14,
    },
    heartEmoji: {
      fontSize: 52,
    },
    getStartedBtn: {
      backgroundColor: colors.accentBlue,
      borderRadius: 14,
      height: 54,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-9">
          <OnboardingProgressDots current={1} />
        </View>

        {/* Heart circle with blue glow — shadow requires StyleSheet */}
        <View style={styles.heartCircle} className="self-center mb-6">
          <Text style={styles.heartEmoji}>❤️</Text>
        </View>

        <Text style={{ fontFamily: 'Georgia', fontSize: 32, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 8 }}>
          MedVoice
        </Text>
        <Text style={{ fontFamily: 'Georgia', fontSize: 18, fontStyle: 'italic', color: colors.accentBlue, textAlign: 'center', marginBottom: 16 }}>
          Your Private Health Companion
        </Text>
        <Text style={{ fontFamily: 'Georgia', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 28, lineHeight: 22, maxWidth: 280, alignSelf: 'center' }}>
          AI-powered health insights that live entirely on your phone. Your data
          never leaves your device. Ever.
        </Text>

        <View className="gap-2.5">
          {FEATURES.map((f) => (
            <FeatureRow key={f.emoji} emoji={f.emoji} text={f.text} />
          ))}
        </View>
      </ScrollView>

      <View className="px-5 pb-2">
        <TouchableOpacity
          onPress={() => router.push("/(onboarding)/role")}
          activeOpacity={0.85}
          style={styles.getStartedBtn}
        >
          <Text className="font-code text-[14px] font-bold text-white tracking-[0.5px]">
            GET STARTED →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

