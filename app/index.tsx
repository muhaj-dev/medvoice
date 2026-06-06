import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";

const FEATURES = [
  { icon: "🎙", label: "Voice-powered health logging" },
  { icon: "🧠", label: "MedPsy-4B on-device AI analysis" },
  { icon: "🔒", label: "No cloud, no accounts, no tracking" },
  { icon: "👨‍👩‍👦", label: "Family health sharing via P2P" },
];

export default function Index() {
  return (
    // SafeAreaView — className not supported, inline style required
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      edges={["top", "bottom"]}
    >
      <View className="flex-1 items-center justify-center px-6 gap-6">
        {/* Logo + app name */}
        <View className="items-center gap-2.5">
          <View
            className="w-25 h-25 rounded-full items-center justify-center"
            style={{
              borderWidth: 1,
              borderColor: "rgba(59,130,246,0.25)",
              backgroundColor: "rgba(59,130,246,0.06)",
            }}
          >
            <Image
              source={images.appIcon}
              className="w-17 h-17 rounded-3.5"
              resizeMode="contain"
            />
          </View>
          <Text className="font-georgia text-[34px] font-bold italic text-teal">
            MedVoice
          </Text>
          <Text className="font-georgia text-[15px] text-dim text-center">
            Your Private Health Companion
          </Text>
        </View>

        {/* Privacy badge — rgba not in theme */}
        <View
          className="flex-row items-center gap-1.5 rounded-full px-3.5 py-1.75"
          style={{
            backgroundColor: "rgba(52,211,153,0.10)",
            borderWidth: 1,
            borderColor: "rgba(52,211,153,0.32)",
          }}
        >
          <View className="w-1.75 h-1.75 rounded-full bg-teal" />
          <Text className="font-code text-[11px] font-semibold tracking-[1.2px] text-white">
            ALL DATA ON-DEVICE
          </Text>
        </View>

        {/* Feature list */}
        <View className="w-full bg-card rounded-2xl border border-edge py-1">
          {FEATURES.map((f) => (
            <View key={f.label} className="flex-row items-center gap-3 px-4 py-3">
              <Text className="text-[18px] w-6.5 text-center">{f.icon}</Text>
              <Text className="font-georgia text-[14px] text-dim flex-1">
                {f.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Onboarding CTA */}
        <Link href="/onboarding" asChild>
          <TouchableOpacity
            className="w-full bg-brand rounded-3.5 py-4 items-center justify-center min-h-13"
            activeOpacity={0.85}
          >
            <Text className="font-georgia text-base font-bold text-surface">
              Get Started  →
            </Text>
          </TouchableOpacity>
        </Link>

        <Text className="font-code text-[10px] tracking-[1px] text-ghost text-center">
          Phase 0 · App Shell
        </Text>
      </View>
    </SafeAreaView>
  );
}
