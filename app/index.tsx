import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useUserStore } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useTheme } from "@/hooks/useTheme";

// Gate screen: loads persisted state then routes to onboarding or home tabs.
export default function Index() {
  const colors = useTheme();
  const loadFromStorage = useUserStore((s) => s.loadFromStorage);
  const loadTheme = useThemeStore((s) => s.loadFromStorage);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([loadFromStorage(), loadTheme()]).then(() => setReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync();
    router.replace((onboardingComplete ? "/(tabs)" : "/(onboarding)/welcome") as any);
  }, [ready, onboardingComplete]);

  return <View style={{ flex: 1, backgroundColor: colors.bgPrimary }} />;
}
