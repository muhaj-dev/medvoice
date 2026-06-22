import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserStore } from "@/store/useUserStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ProfileCard } from "@/components/ProfileCard";
import { SettingsSection } from "@/components/SettingsSection";
import { SettingsRow } from "@/components/SettingsRow";
import { ThemeSelector } from "@/components/ThemeSelector";
import { ModelSizeSelector } from "@/components/ModelSizeSelector";
import { LanguageSelector } from "@/components/LanguageSelector";

const ICON_PINK   = "rgba(236,72,153,0.20)";
const ICON_GRAY   = "rgba(100,116,139,0.22)";
const ICON_ORANGE = "rgba(249,115,22,0.20)";
const ICON_RED    = "rgba(239,68,68,0.20)";
const ICON_AMBER  = "rgba(251,191,36,0.20)";

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useTheme();
  const { t } = useTranslation();
  const profile = useUserStore((s) => s.profile);
  const { modelSize, ttsEnabled, setTtsEnabled } = useSettingsStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontFamily: "Georgia", fontSize: 28, fontWeight: "700", color: colors.textPrimary, marginBottom: 24 }}>
          {t("settings.title")}
        </Text>

        {profile && (
          <ProfileCard
            profile={profile}
            onPress={() => router.push("/settings/edit-profile")}
          />
        )}

        <SettingsSection title={t("settings.display")}>
          <ThemeSelector />
        </SettingsSection>

        <SettingsSection title={t("settings.language")}>
          <LanguageSelector />
        </SettingsSection>

        <SettingsSection title={t("settings.aiModel")}>
          <ModelSizeSelector />
          <SettingsRow
            icon="🔊"
            iconBg={ICON_PINK}
            label={t("settings.readAloud")}
            value={ttsEnabled ? t("settings.enabled") : t("settings.disabled")}
            valueColor={ttsEnabled ? colors.successGreen : colors.textMuted}
            onPress={() => setTtsEnabled(!ttsEnabled)}
          />
          <SettingsRow
            icon="💾"
            iconBg={ICON_GRAY}
            label={t("settings.storageUsed")}
            value={modelSize === "4b" ? "2.6 GB" : "1.1 GB"}
          />
          <SettingsRow
            icon="📡"
            iconBg={ICON_GRAY}
            label={t("settings.networkMode")}
            value={t("settings.offline")}
            isLast
          />
        </SettingsSection>

        <SettingsSection title={t("settings.privacy")}>
          <SettingsRow
            icon="🔒"
            iconBg={ICON_ORANGE}
            label={t("settings.dataLocation")}
            value={t("settings.onDeviceOnly")}
            valueColor={colors.successGreen}
          />
          <SettingsRow
            icon="🛡️"
            iconBg={ICON_RED}
            label={t("settings.cloudSync")}
            value={t("settings.disabled")}
            valueColor={colors.warningRed}
          />
          <SettingsRow
            icon="🔑"
            iconBg={ICON_ORANGE}
            label={t("settings.p2pEncryption")}
            value={t("settings.enabled")}
            valueColor={colors.successGreen}
            isLast
          />
        </SettingsSection>

        <SettingsSection title={t("settings.about")}>
          <SettingsRow
            icon="⚡"
            iconBg={ICON_AMBER}
            label={t("settings.poweredBy")}
            value="QVAC SDK"
          />
          <SettingsRow
            icon="📄"
            iconBg={ICON_GRAY}
            label={t("settings.license")}
            value="Apache 2.0"
          />
          <SettingsRow
            icon="🏆"
            iconBg={ICON_AMBER}
            label={t("settings.hackathon")}
            value="QVAC Unleash Edge AI"
            valueFontSize={11}
            isLast
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
