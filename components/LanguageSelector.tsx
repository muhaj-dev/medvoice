/**
 * App language row (Settings → LANGUAGE). Shows the current language and opens
 * a searchable picker of every language QVAC can translate. Choosing one sets
 * it, translates the UI on-device (cached), makes the AI answer in it, and — for
 * the four voice languages — speaks it aloud. While a newly chosen language's
 * catalog is translating, a small "Translating…" indicator shows.
 */
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { languageMeta } from "@/constants/strings";
import { LanguagePickerModal } from "@/components/LanguagePickerModal";

export function LanguageSelector() {
  const colors = useTheme();
  const { t, translating } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const meta = languageMeta(language);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
      <View className="flex-row items-center justify-between mb-1">
        <Text style={{ fontFamily: "Georgia", fontSize: 15, color: colors.textPrimary }}>
          {t("settings.appLanguage")}
        </Text>
        {translating && (
          <View className="flex-row items-center gap-1.5">
            <ActivityIndicator size="small" color={colors.accentBlue} />
            <Text style={{ fontFamily: "monospace", fontSize: 10, color: colors.accentBlue }}>
              {t("settings.translating")}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => setPickerOpen(true)}
        activeOpacity={0.75}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: colors.accentBlue,
          backgroundColor: `${colors.accentBlue}18`,
        }}
      >
        <Text style={{ fontSize: 20 }}>{meta.flag}</Text>
        <Text style={{ flex: 1, fontFamily: "Georgia", fontSize: 16, fontWeight: "700", color: colors.accentBlue }}>
          {meta.nativeName}
        </Text>
        {meta.voice && <Ionicons name="volume-high" size={16} color={colors.successGreen} />}
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <Text style={{ fontFamily: "monospace", fontSize: 10, lineHeight: 15, color: colors.textSecondary, marginTop: 10 }}>
        {t("settings.voiceNote")}
      </Text>

      <LanguagePickerModal visible={pickerOpen} onClose={() => setPickerOpen(false)} />
    </View>
  );
}
