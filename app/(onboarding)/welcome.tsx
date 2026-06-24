import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { languageMeta } from "@/constants/strings";
import { images } from "@/constants/images";
import { OnboardingProgressDots } from "@/components/OnboardingProgressDots";
import { FeatureRow } from "@/components/FeatureRow";
import { LanguagePickerModal } from "@/components/LanguagePickerModal";

const FEATURES = [
  { emoji: "🎙", key: "onboarding.feature.speak" },
  { emoji: "🧠", key: "onboarding.feature.analyze" },
  { emoji: "📡", key: "onboarding.feature.share" },
] as const;

export default function WelcomeScreen() {
  const colors = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const language = useLanguageStore((s) => s.language);
  const langMeta = languageMeta(language);
  const [pickerOpen, setPickerOpen] = useState(false);

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
    logoTile: {
      width: 120,
      height: 120,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.accentBlue,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 28,
      elevation: 14,
    },
    logoImage: {
      width: 120,
      height: 120,
      borderRadius: 28,
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
        {/* Language picker — first choice, so the whole app + voice match the
            user's language. Only the chosen language is downloaded. */}
        <View className="flex-row justify-end mb-4">
          <TouchableOpacity
            onPress={() => setPickerOpen(true)}
            activeOpacity={0.75}
            style={{
              flexDirection: "row", alignItems: "center", gap: 6,
              borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard,
              borderRadius: 99, paddingVertical: 7, paddingHorizontal: 12,
            }}
          >
            <Text style={{ fontSize: 16 }}>{langMeta.flag}</Text>
            <Text style={{ fontFamily: "Georgia", fontSize: 14, color: colors.textPrimary }}>
              {langMeta.nativeName}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View className="items-center mb-9">
          <OnboardingProgressDots current={2} />
        </View>

        {/* MedVoice shield mark with blue glow — shadow requires StyleSheet */}
        <View style={styles.logoTile} className="self-center mb-6">
          <Image
            source={images.logoIcon}
            style={styles.logoImage}
            contentFit="cover"
          />
        </View>

        <Text style={{ fontFamily: 'Georgia', fontSize: 32, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 8 }}>
          MedVoice
        </Text>
        <Text style={{ fontFamily: 'Georgia', fontSize: 18, fontStyle: 'italic', color: colors.accentBlue, textAlign: 'center', marginBottom: 16 }}>
          {t("onboarding.welcome.tagline")}
        </Text>
        <Text style={{ fontFamily: 'Georgia', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 28, lineHeight: 22, maxWidth: 280, alignSelf: 'center' }}>
          {t("onboarding.welcome.subtitle")}
        </Text>

        <View className="gap-2.5">
          {FEATURES.map((f) => (
            <FeatureRow key={f.emoji} emoji={f.emoji} text={t(f.key)} />
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
            {t("onboarding.welcome.getStarted")}
          </Text>
        </TouchableOpacity>
      </View>

      <LanguagePickerModal visible={pickerOpen} onClose={() => setPickerOpen(false)} />
    </SafeAreaView>
  );
}

