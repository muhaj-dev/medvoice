import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { ensureCatalog } from "@/lib/i18n";
import { OnboardingProgressDots } from "@/components/OnboardingProgressDots";
import { LanguageList } from "@/components/LanguageList";
import type { Lang } from "@/constants/strings";

// First onboarding step: pick the language. Everything after (UI, AI replies,
// voice read-aloud) follows this choice. Only the chosen language is translated.
export default function LanguageScreen() {
  const colors = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  useEffect(() => {
    if (onboardingComplete) router.replace("/(tabs)" as any);
  }, [onboardingComplete, router]);

  const handleSelect = (lang: Lang) => {
    if (lang === language) return;
    void setLanguage(lang);
    void ensureCatalog(lang); // translate only the chosen language, once
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }} edges={["top", "bottom"]}>
      <View className="items-center mt-5 mb-8">
        <OnboardingProgressDots current={1} />
      </View>

      <View className="px-5 mb-5">
        <Text style={{ fontFamily: "Georgia", fontSize: 28, fontWeight: "700", color: colors.textPrimary, lineHeight: 36 }}>
          {t("onboarding.language.title")}
        </Text>
        <Text style={{ fontFamily: "Georgia", fontSize: 14, color: colors.textSecondary, marginTop: 6, lineHeight: 21 }}>
          {t("onboarding.language.subtitle")}
        </Text>
      </View>

      <LanguageList selected={language} onSelect={handleSelect} />

      <View className="px-5 pb-2 pt-2">
        <TouchableOpacity
          onPress={() => router.push("/(onboarding)/welcome")}
          activeOpacity={0.85}
          style={{ backgroundColor: colors.accentBlue, borderRadius: 14, height: 54, alignItems: "center", justifyContent: "center" }}
        >
          <Text className="font-code text-[14px] font-bold text-white tracking-[0.5px]">
            {t("onboarding.nav.continue")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
