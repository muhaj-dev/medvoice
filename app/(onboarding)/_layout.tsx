import { Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export default function OnboardingLayout() {
  const colors = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
        animation: "slide_from_right",
      }}
    />
  );
}
