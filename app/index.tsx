import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useUserStore } from "@/store/useUserStore";
import { colors } from "@/constants/colors";

// Gate screen: loads persisted state then routes to onboarding or home tabs.
export default function Index() {
  const loadFromStorage = useUserStore((s) => s.loadFromStorage);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadFromStorage().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync();
    router.replace(onboardingComplete ? "/(tabs)" : "/(onboarding)");
  }, [ready, onboardingComplete]);

  return <View style={{ flex: 1, backgroundColor: colors.bgPrimary }} />;
}
