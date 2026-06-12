/**
 * DISPLAY theme picker (Settings) — light / dark / system buttons.
 */
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useThemeStore } from "@/store/useThemeStore";
import type { ThemePreference } from "@/types/theme";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: string }[] = [
  { value: "light",  label: "Light",  icon: "☀️" },
  { value: "dark",   label: "Dark",   icon: "🌙" },
  { value: "system", label: "System", icon: "📱" },
];

export function ThemeSelector() {
  const colors = useTheme();
  const { preference, setPreference } = useThemeStore();

  return (
    <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
      <Text style={{ fontFamily: "Georgia", fontSize: 15, color: colors.textPrimary, marginBottom: 12 }}>
        Theme
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
                {opt.label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
