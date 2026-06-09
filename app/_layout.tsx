import "../global.css";

import { useEffect } from "react";
import { AppState } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { useTheme } from "@/hooks/useTheme";
import { useThemeStore } from "@/store/useThemeStore";
import { useHealthStore } from "@/store/useHealthStore";
import { useFamilyStore } from "@/store/useFamilyStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { preloadAllModels, suspendQvac, resumeQvac } from "@/lib/qvac";

// Splash stays visible until app/index.tsx resolves the route
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colors = useTheme();
  const preference = useThemeStore((s) => s.preference);
  const loadEntries = useHealthStore((s) => s.loadFromDb);
  const loadMembers = useFamilyStore((s) => s.loadFromDb);
  const startReceiving = useFamilyStore((s) => s.startReceiving);
  const loadSettings = useSettingsStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadEntries();
    loadMembers();
    loadSettings();

    // Listen for health summaries pushed by connected family members (P2P).
    startReceiving();

    // Preload models ONE AT A TIME (sequential) so we never hold ~3.7 GB in
    // memory at once. Parallel loading triggers the OS OOM-killer (crash at ~50%).
    preloadAllModels();

    // Free GPU/CPU when the app moves to background; reclaim on foreground.
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "background") suspendQvac().catch(() => {});
      if (state === "active") resumeQvac().catch(() => {});
    });

    return () => sub.remove();
    // Store actions are stable refs, so this still runs once on mount.
  }, [loadEntries, loadMembers, loadSettings, startReceiving]);

  // StatusBar style: "light" = white icons (for dark bg), "dark" = dark icons (for light bg)
  const statusBarStyle = preference === "light" ? "dark" : "light";

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bgPrimary },
          animation: "slide_from_right",
        }}
      />
    </>
  );
}
