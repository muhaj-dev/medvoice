import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { SpokenText } from "@/components/SpokenText";
import type { ColorTokens } from "@/constants/colors";
import type { VisitStatus } from "@/hooks/useVisitPrep";

type Props = {
  summary: string;
  status: VisitStatus;
  entryCount: number;
};

// Shared TTS id so the Read Aloud control and SpokenText karaoke stay in sync.
export const VISIT_TTS_ID = "visit";

/**
 * The generated visit-prep brief. While generating with no text yet, shows a
 * caring loading state; otherwise renders the streamed summary with karaoke
 * highlighting as it's read aloud.
 */
export function VisitSummaryCard({ summary, status, entryCount }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
  const styles = makeStyles(colors);

  const generating = status === "generating";

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{t("visitPrep.summaryLabel")}</Text>
      {entryCount > 0 && (
        <Text style={styles.meta}>
          {t("visitPrep.metaPrefix")} {entryCount}{" "}
          {entryCount === 1 ? t("visitPrep.metaEntry") : t("visitPrep.metaEntries")}
        </Text>
      )}

      {generating && summary.length === 0 ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={colors.accentBlue} />
          <Text style={styles.loading}>{t("visitPrep.reviewing")}</Text>
        </View>
      ) : (
        <SpokenText id={VISIT_TTS_ID} text={summary} style={styles.text} />
      )}
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 16,
      gap: 8,
    },
    label: {
      fontFamily: "monospace",
      fontSize: 10,
      fontWeight: "600",
      color: colors.accentBlue,
      letterSpacing: 1.0,
    },
    meta: {
      fontFamily: "monospace",
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    text: {
      fontFamily: "Georgia",
      fontSize: 15,
      color: colors.textPrimary,
      lineHeight: 24,
      marginTop: 4,
    },
    loadingRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
    loading: { fontFamily: "Georgia", fontSize: 14, color: colors.textSecondary },
  });
}
