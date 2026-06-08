import "../global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

import { useTheme } from "@/hooks/useTheme";
import { useThemeStore } from "@/store/useThemeStore";
import { useHealthStore } from "@/store/useHealthStore";
import { useFamilyStore } from "@/store/useFamilyStore";

// Splash stays visible until app/index.tsx resolves the route
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colors = useTheme();
  const preference = useThemeStore((s) => s.preference);
  const loadEntries = useHealthStore((s) => s.loadFromDb);
  const loadMembers = useFamilyStore((s) => s.loadFromDb);

  useEffect(() => {
    loadEntries();
    loadMembers();
  }, []);

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
