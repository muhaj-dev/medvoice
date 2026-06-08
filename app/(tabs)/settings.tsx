import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useThemeStore } from "@/store/useThemeStore";
import { useUserStore } from "@/store/useUserStore";
import { ProfileCard } from "@/components/ProfileCard";
import { SettingsSection } from "@/components/SettingsSection";
import { SettingsRow } from "@/components/SettingsRow";
import type { ThemePreference } from "@/types/theme";

const ICON_PINK   = "rgba(236,72,153,0.20)";
const ICON_GRAY   = "rgba(100,116,139,0.22)";
const ICON_ORANGE = "rgba(249,115,22,0.20)";
const ICON_RED    = "rgba(239,68,68,0.20)";
const ICON_AMBER  = "rgba(251,191,36,0.20)";

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀️" },
  { value: "dark",  label: "Dark",  icon: "🌙" },
  { value: "system",label: "System",icon: "📱" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useTheme();
  const profile = useUserStore((s) => s.profile);
  const { preference, setPreference } = useThemeStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: "Georgia", fontSize: 28, fontWeight: "700", color: colors.textPrimary, marginBottom: 24 }}>
          Settings
        </Text>

        {profile && (
          <ProfileCard
            profile={profile}
            onPress={() => router.push("/settings/edit-profile")}
          />
        )}

        {/* Display / Theme */}
        <SettingsSection title="DISPLAY">
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
        </SettingsSection>

        <SettingsSection title="AI MODEL">
          <SettingsRow
            icon="🧠"
            iconBg={ICON_PINK}
            label="MedPsy Model"
            value="4B · "
            valueSuffix="Active"
            valueSuffixColor={colors.successGreen}
          />
          <SettingsRow
            icon="💾"
            iconBg={ICON_GRAY}
            label="Storage used"
            value="2.6 GB"
          />
          <SettingsRow
            icon="📡"
            iconBg={ICON_GRAY}
            label="Network mode"
            value="Offline"
            isLast
          />
        </SettingsSection>

        <SettingsSection title="PRIVACY">
          <SettingsRow
            icon="🔒"
            iconBg={ICON_ORANGE}
            label="Data location"
            value="On-device only"
            valueColor={colors.successGreen}
          />
          <SettingsRow
            icon="🛡️"
            iconBg={ICON_RED}
            label="Cloud sync"
            value="Disabled"
            valueColor={colors.warningRed}
          />
          <SettingsRow
            icon="🔑"
            iconBg={ICON_ORANGE}
            label="P2P encryption"
            value="Enabled"
            valueColor={colors.successGreen}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="ABOUT">
          <SettingsRow
            icon="⚡"
            iconBg={ICON_AMBER}
            label="Powered by"
            value="QVAC SDK"
          />
          <SettingsRow
            icon="📄"
            iconBg={ICON_GRAY}
            label="License"
            value="Apache 2.0"
          />
          <SettingsRow
            icon="🏆"
            iconBg={ICON_AMBER}
            label="Hackathon"
            value="QVAC Unleash Edge AI"
            valueFontSize={11}
            isLast
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
