/**
 * UI string catalog + supported languages.
 *
 * English is the single source of truth. For every other language the VALUES
 * below are translated on-device by QVAC NMT (Bergamot) the first time that
 * language is selected, then cached (see lib/i18n.ts). Components read strings
 * by key through the useTranslation() hook, falling back to English.
 *
 * The picker lists every language QVAC can translate into (Bergamot NMT). Four
 * of them (en/es/de/it) also have a TTS voice and can be read aloud; the rest
 * are translated for reading + AI answers only. See hasVoice() / VOICE_LANGS.
 */

import { timelineStrings } from "./i18n/timeline";
import { familyStrings } from "./i18n/family";
import { careViewStrings } from "./i18n/careView";
import { recordingStrings } from "./i18n/recording";
import { analysisStrings } from "./i18n/analysis";
import { askStrings } from "./i18n/ask";
import { scanStrings } from "./i18n/scan";
import { visitPrepStrings } from "./i18n/visitPrep";
import { onboardingStrings } from "./i18n/onboarding";
import { profileStrings } from "./i18n/profile";
import { miscStrings } from "./i18n/misc";

// Every language QVAC can translate the UI + AI answers into (Bergamot en→xx).
// `voice: true` marks the four QVAC also has a TTS voice for (TTS_LANGUAGES) —
// only those can be read aloud; the rest are read/answer-only.
export const LANG_CODES = [
  "en", "es", "de", "it", // ← have a spoken voice
  "fr", "pt", "nl", "ru", "uk", "pl", "cs", "sk", "sl", "hr", "sr", "bs",
  "bg", "ro", "el", "hu", "fi", "et", "lv", "lt", "da", "sv", "nb",
  "is", "sq", "ca", "az", "tr", "ar", "fa", "he", "hi", "bn", "gu", "kn",
  "ml", "ta", "te", "vi", "id", "ms", "zh", "ja", "ko",
] as const;

export type Lang = (typeof LANG_CODES)[number];

// Languages QVAC ships a TTS voice for — the only ones that can be spoken aloud.
export const VOICE_LANGS = ["en", "es", "de", "it"] as const;
export type VoiceLang = (typeof VOICE_LANGS)[number];

export const hasVoice = (lang: Lang): lang is VoiceLang =>
  (VOICE_LANGS as readonly string[]).includes(lang);

export type LanguageMeta = {
  code: Lang;
  /** Name in the language itself, shown in the picker. */
  nativeName: string;
  /** English name — used to instruct the AI to reply in this language. */
  englishName: string;
  flag: string;
  /** True when this language can be read aloud (QVAC has a TTS voice). */
  voice?: boolean;
};

export const LANGUAGES: LanguageMeta[] = [
  { code: "en", nativeName: "English",            englishName: "English",    flag: "🇬🇧", voice: true },
  { code: "es", nativeName: "Español",            englishName: "Spanish",    flag: "🇪🇸", voice: true },
  { code: "de", nativeName: "Deutsch",            englishName: "German",     flag: "🇩🇪", voice: true },
  { code: "it", nativeName: "Italiano",           englishName: "Italian",    flag: "🇮🇹", voice: true },
  { code: "fr", nativeName: "Français",           englishName: "French",     flag: "🇫🇷" },
  { code: "pt", nativeName: "Português",          englishName: "Portuguese", flag: "🇵🇹" },
  { code: "nl", nativeName: "Nederlands",         englishName: "Dutch",      flag: "🇳🇱" },
  { code: "ru", nativeName: "Русский",            englishName: "Russian",    flag: "🇷🇺" },
  { code: "uk", nativeName: "Українська",         englishName: "Ukrainian",  flag: "🇺🇦" },
  { code: "pl", nativeName: "Polski",             englishName: "Polish",     flag: "🇵🇱" },
  { code: "cs", nativeName: "Čeština",            englishName: "Czech",      flag: "🇨🇿" },
  { code: "sk", nativeName: "Slovenčina",         englishName: "Slovak",     flag: "🇸🇰" },
  { code: "sl", nativeName: "Slovenščina",        englishName: "Slovenian",  flag: "🇸🇮" },
  { code: "hr", nativeName: "Hrvatski",           englishName: "Croatian",   flag: "🇭🇷" },
  { code: "sr", nativeName: "Српски",             englishName: "Serbian",    flag: "🇷🇸" },
  { code: "bs", nativeName: "Bosanski",           englishName: "Bosnian",    flag: "🇧🇦" },
  { code: "bg", nativeName: "Български",           englishName: "Bulgarian",  flag: "🇧🇬" },
  { code: "ro", nativeName: "Română",             englishName: "Romanian",   flag: "🇷🇴" },
  { code: "el", nativeName: "Ελληνικά",           englishName: "Greek",      flag: "🇬🇷" },
  { code: "hu", nativeName: "Magyar",             englishName: "Hungarian",  flag: "🇭🇺" },
  { code: "fi", nativeName: "Suomi",              englishName: "Finnish",    flag: "🇫🇮" },
  { code: "et", nativeName: "Eesti",              englishName: "Estonian",   flag: "🇪🇪" },
  { code: "lv", nativeName: "Latviešu",           englishName: "Latvian",    flag: "🇱🇻" },
  { code: "lt", nativeName: "Lietuvių",           englishName: "Lithuanian", flag: "🇱🇹" },
  { code: "da", nativeName: "Dansk",              englishName: "Danish",     flag: "🇩🇰" },
  { code: "sv", nativeName: "Svenska",            englishName: "Swedish",    flag: "🇸🇪" },
  { code: "nb", nativeName: "Norsk",              englishName: "Norwegian",  flag: "🇳🇴" },
  { code: "is", nativeName: "Íslenska",           englishName: "Icelandic",  flag: "🇮🇸" },
  { code: "sq", nativeName: "Shqip",              englishName: "Albanian",   flag: "🇦🇱" },
  { code: "ca", nativeName: "Català",             englishName: "Catalan",    flag: "🇪🇸" },
  { code: "az", nativeName: "Azərbaycanca",       englishName: "Azerbaijani",flag: "🇦🇿" },
  { code: "tr", nativeName: "Türkçe",             englishName: "Turkish",    flag: "🇹🇷" },
  { code: "ar", nativeName: "العربية",            englishName: "Arabic",     flag: "🇸🇦" },
  { code: "fa", nativeName: "فارسی",              englishName: "Persian",    flag: "🇮🇷" },
  { code: "he", nativeName: "עברית",              englishName: "Hebrew",     flag: "🇮🇱" },
  { code: "hi", nativeName: "हिन्दी",               englishName: "Hindi",      flag: "🇮🇳" },
  { code: "bn", nativeName: "বাংলা",              englishName: "Bengali",    flag: "🇧🇩" },
  { code: "gu", nativeName: "ગુજરાતી",            englishName: "Gujarati",   flag: "🇮🇳" },
  { code: "kn", nativeName: "ಕನ್ನಡ",              englishName: "Kannada",    flag: "🇮🇳" },
  { code: "ml", nativeName: "മലയാളം",            englishName: "Malayalam",  flag: "🇮🇳" },
  { code: "ta", nativeName: "தமிழ்",              englishName: "Tamil",      flag: "🇮🇳" },
  { code: "te", nativeName: "తెలుగు",             englishName: "Telugu",     flag: "🇮🇳" },
  { code: "vi", nativeName: "Tiếng Việt",         englishName: "Vietnamese", flag: "🇻🇳" },
  { code: "id", nativeName: "Bahasa Indonesia",   englishName: "Indonesian", flag: "🇮🇩" },
  { code: "ms", nativeName: "Bahasa Melayu",      englishName: "Malay",      flag: "🇲🇾" },
  { code: "zh", nativeName: "中文",                englishName: "Chinese",    flag: "🇨🇳" },
  { code: "ja", nativeName: "日本語",              englishName: "Japanese",   flag: "🇯🇵" },
  { code: "ko", nativeName: "한국어",              englishName: "Korean",     flag: "🇰🇷" },
];

export const languageMeta = (code: Lang): LanguageMeta =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];

// Core strings for the always-present chrome (tabs, home, settings). Every
// other screen contributes its own namespaced strings from constants/i18n/*.
const CORE_STRINGS = {
  // Tabs
  "tab.home": "HOME",
  "tab.timeline": "TIMELINE",
  "tab.family": "FAMILY",
  "tab.careView": "CARE VIEW",
  "tab.settings": "SETTINGS",

  // Home
  "home.morning": "Good morning,",
  "home.afternoon": "Good afternoon,",
  "home.evening": "Good evening,",
  "home.there": "there",
  "home.aiReady": "AI READY",
  "home.aiModels": "AI MODELS",
  "home.recentEntries": "RECENT ENTRIES",
  "home.seeAll": "SEE ALL",
  "home.noEntries": "No entries yet",
  "home.getStarted": "Tap the microphone above to get started",

  // Settings sections
  "settings.title": "Settings",
  "settings.display": "DISPLAY",
  "settings.language": "LANGUAGE",
  "settings.aiModel": "AI MODEL",
  "settings.privacy": "PRIVACY",
  "settings.about": "ABOUT",

  // Settings rows
  "settings.appLanguage": "App language",
  "settings.spokenBy": "Spoken by the AI voice",
  "settings.translating": "Translating…",
  "settings.chooseLanguage": "Choose your language",
  "settings.searchLanguages": "Search languages…",
  "settings.noLanguagesFound": "No languages found",
  "settings.voiceTag": "VOICE",
  "settings.voiceNote": "Voice read-aloud is available in English, Spanish, German and Italian. Other languages are translated for reading.",
  "settings.readAloud": "Read aloud (TTS)",
  "settings.enabled": "Enabled",
  "settings.disabled": "Disabled",
  "settings.storageUsed": "Storage used",
  "settings.networkMode": "Network mode",
  "settings.offline": "Offline",
  "settings.dataLocation": "Data location",
  "settings.onDeviceOnly": "On-device only",
  "settings.cloudSync": "Cloud sync",
  "settings.p2pEncryption": "P2P encryption",
  "settings.poweredBy": "Powered by",
  "settings.license": "License",
  "settings.hackathon": "Hackathon",
} as const;

// The full English catalog: core chrome + every feature's namespaced strings.
// Each feature owns its own file under constants/i18n/ so screens can be
// localized independently without touching this index.
export const EN_STRINGS = {
  ...CORE_STRINGS,
  ...timelineStrings,
  ...familyStrings,
  ...careViewStrings,
  ...recordingStrings,
  ...analysisStrings,
  ...askStrings,
  ...scanStrings,
  ...visitPrepStrings,
  ...onboardingStrings,
  ...profileStrings,
  ...miscStrings,
};

export type StringKey = keyof typeof EN_STRINGS;

export const STRING_KEYS = Object.keys(EN_STRINGS) as StringKey[];
