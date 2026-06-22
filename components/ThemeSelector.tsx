/**
 * DISPLAY theme picker (Settings) — light / dark / system buttons.
 */
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeStore } from "@/store/useThemeStore";
import type { ThemePreference } from "@/types/theme";
import type { StringKey } from "@/constants/strings";

const THEME_OPTIONS: { value: ThemePreference; labelKey: StringKey; icon: string }[] = [
  { value: "light",  labelKey: "misc.themeLight",  icon: "☀️" },
  { value: "dark",   labelKey: "misc.themeDark",   icon: "🌙" },
  { value: "system", labelKey: "misc.themeSystem", icon: "📱" },
];

export function ThemeSelector() {
  const colors = useTheme();
  const { t } = useTranslation();
  const { preference, setPreference } = useThemeStore();

  return (
    <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
      <Text style={{ fontFamily: "Georgia", fontSize: 15, color: colors.textPrimary, marginBottom: 12 }}>
        {t("misc.theme")}
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {THEME_OPTIONS.map((opt) => {
          const active = preference === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setPreference(opt.value)}
              activeOpacity={0.75}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: active ? colors.accentBlue : colors.border,
                backgroundColor: active ? `${colors.accentBlue}18` : colors.bgDeep,
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 20 }}>{opt.icon}</Text>
              <Text style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: 0.5,
                color: active ? colors.accentBlue : colors.textSecondary,
                fontWeight: active ? "700" : "400",
              }}>
                {t(opt.labelKey).toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
