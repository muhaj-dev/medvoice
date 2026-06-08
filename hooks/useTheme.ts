import { useColorScheme } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";
import { lightColors, darkColors } from "@/constants/colors";
import type { ColorTokens } from "@/constants/colors";

export const useTheme = (): ColorTokens => {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((s) => s.preference);
  const scheme = preference === "system" ? systemScheme : preference;
  return scheme === "dark" ? darkColors : lightColors;
};
