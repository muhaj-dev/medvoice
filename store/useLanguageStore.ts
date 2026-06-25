/**
 * App language preference. A single setting drives three things, all on-device:
 *   1. UI display language  — strings translated via QVAC NMT (see lib/i18n.ts)
 *   2. AI reply language    — the analysis/Q&A model is told to answer in it
 *   3. Read-aloud voice      — QVAC multilingual TTS speaks in it (lib/qvac.ts)
 *
 * Any language QVAC can translate is offered (see LANGUAGES in
 * constants/strings.ts); the four with a TTS voice (en/es/de/it) can also be
 * read aloud. Persisted to AsyncStorage so the choice survives restarts.
 */
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LANGUAGES, type Lang } from "@/constants/strings";

const LANGUAGE_KEY = "@medvoice:language";

type LanguageStore = {
  language: Lang;
  setLanguage: (lang: Lang) => Promise<void>;
  loadFromStorage: () => Promise<void>;
};

const isLang = (v: unknown): v is Lang =>
  typeof v === "string" && LANGUAGES.some((l) => l.code === v);

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: "en",

  setLanguage: async (language) => {
    set({ language });
    await AsyncStorage.setItem(LANGUAGE_KEY, language).catch((e) =>
      console.warn("[language] failed to persist language preference:", e)
    );
  },

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (isLang(raw)) set({ language: raw });
    } catch (e) {
      // corrupted storage — keep default English
      console.warn("[language] failed to load language preference:", e);
    }
  },
}));
