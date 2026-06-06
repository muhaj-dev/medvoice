import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { colors } from "@/constants/colors";

// Keep the splash screen up until the app is ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Using system fonts (Georgia / monospace) — no custom font loading needed.
    // If bundled fonts are added in the future, load them here with useFonts()
    // before calling hideAsync().
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      {/* Light icons on dark background throughout the entire app */}
      <StatusBar style="light" backgroundColor={colors.bgPrimary} />

      <Stack
        screenOptions={{
          headerShown: false,
          // Ensures every screen defaults to the dark background colour
          contentStyle: { backgroundColor: colors.bgPrimary },
          // Smooth slide animation across all screen transitions
          animation: "slide_from_right",
        }}
      />
    </>
  );
}
