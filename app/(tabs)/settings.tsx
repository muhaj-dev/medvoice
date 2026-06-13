import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useUserStore } from "@/store/useUserStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ProfileCard } from "@/components/ProfileCard";
import { SettingsSection } from "@/components/SettingsSection";
import { SettingsRow } from "@/components/SettingsRow";
import { ThemeSelector } from "@/components/ThemeSelector";
import { ModelSizeSelector } from "@/components/ModelSizeSelector";

const ICON_PINK   = "rgba(236,72,153,0.20)";
const ICON_GRAY   = "rgba(100,116,139,0.22)";
const ICON_ORANGE = "rgba(249,115,22,0.20)";
const ICON_RED    = "rgba(239,68,68,0.20)";
const ICON_AMBER  = "rgba(251,191,36,0.20)";

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useTheme();
  const profile = useUserStore((s) => s.profile);
  const { modelSize, ttsEnabled, setTtsEnabled } = useSettingsStore();

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

        <SettingsSection title="DISPLAY">
          <ThemeSelector />
        </SettingsSection>

        <SettingsSection title="AI MODEL">
          <ModelSizeSelector />
          <SettingsRow
            icon="🔊"
            iconBg={ICON_PINK}
            label="Read aloud (TTS)"
            value={ttsEnabled ? "Enabled" : "Disabled"}
            valueColor={ttsEnabled ? colors.successGreen : colors.textMuted}
            onPress={() => setTtsEnabled(!ttsEnabled)}
          />
          <SettingsRow
            icon="💾"
            iconBg={ICON_GRAY}
            label="Storage used"
            value={modelSize === "4b" ? "2.6 GB" : "1.1 GB"}
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
