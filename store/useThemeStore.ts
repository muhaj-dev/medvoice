import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemePreference } from "@/types/theme";

const THEME_KEY = "@medvoice:v2:theme_preference";

type ThemeStore = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
  loadFromStorage: () => Promise<void>;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  preference: "system",

  setPreference: async (preference) => {
    set({ preference });
    await AsyncStorage.setItem(THEME_KEY, preference);
  },

  loadFromStorage: async () => {
    const saved = await AsyncStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      set({ preference: saved });
    }
  },
}));
