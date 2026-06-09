import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "@medvoice:v2:settings";

export type ModelSize = "1.7b" | "4b";

type Settings = {
  modelSize: ModelSize;
  ttsEnabled: boolean;
};

type SettingsStore = Settings & {
  setModelSize: (size: ModelSize) => Promise<void>;
  setTtsEnabled: (enabled: boolean) => Promise<void>;
  loadFromStorage: () => Promise<void>;
};

const DEFAULT: Settings = {
  modelSize: "4b",
  ttsEnabled: true,
};

const persist = async (patch: Partial<Settings>, current: Settings) => {
  const next = { ...current, ...patch };
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...DEFAULT,

  setModelSize: async (modelSize) => {
    set({ modelSize });
    await persist({ modelSize }, get());
  },

  setTtsEnabled: async (ttsEnabled) => {
    set({ ttsEnabled });
    await persist({ ttsEnabled }, get());
  },

  loadFromStorage: async () => {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    try {
      const saved: Partial<Settings> = JSON.parse(raw);
      const modelSize =
        saved.modelSize === "1.7b" || saved.modelSize === "4b"
          ? saved.modelSize
          : DEFAULT.modelSize;
      const ttsEnabled =
        typeof saved.ttsEnabled === "boolean"
          ? saved.ttsEnabled
          : DEFAULT.ttsEnabled;
      set({ modelSize, ttsEnabled });
    } catch {
      // corrupted storage — keep defaults
    }
  },
}));
