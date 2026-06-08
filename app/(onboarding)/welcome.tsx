import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { OnboardingProgressDots } from "@/components/OnboardingProgressDots";
import { FeatureRow } from "@/components/FeatureRow";

const FEATURES = [
  { emoji: "🎙", text: "Speak naturally about how you feel" },
  { emoji: "🧠", text: "MedPsy AI analyzes your health locally" },
  { emoji: "📡", text: "Share with family via private P2P" },
] as const;

export default function WelcomeScreen() {
  const router = useRouter();

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

        <Text className="font-georgia text-[32px] font-bold text-white text-center mb-2">
          MedVoice
        </Text>
        <Text className="font-georgia text-[18px] italic text-brand text-center mb-4">
          Your Private Health Companion
        </Text>
        <Text
          className="font-georgia text-[14px] text-dim text-center mb-7 self-center"
          style={{ lineHeight: 22, maxWidth: 280 }}
        >
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
