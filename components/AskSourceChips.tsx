import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import type { ColorTokens } from "@/constants/colors";
import type { HealthEntry } from "@/types/health";

type Props = { sources: HealthEntry[] };

function shortDate(iso: string, locale: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { month: "short", day: "numeric" });
}

/**
 * The past entries the answer was grounded in — shown beneath the answer so the
 * user can see (and open) exactly what MedVoice drew from. This is the trust
 * signal that makes an on-device RAG answer feel honest, not made up.
 */
export function AskSourceChips({ sources }: Props) {
  const colors = useTheme();
  const { t, language } = useTranslation();
  const styles = makeStyles(colors);

  if (sources.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t("ask.fromHistory")}</Text>
      <View style={styles.chips}>
        {sources.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.chip}
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/timeline" as any)}
          >
            <Text style={styles.chipDate}>{shortDate(entry.timestamp, language)}</Text>
            <Text style={styles.chipText} numberOfLines={1}>
              {entry.tags[0] ?? entry.transcript.slice(0, 24)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    wrap: { gap: 10 },
    label: {
      fontFamily: "monospace",
      fontSize: 10,
      fontWeight: "600",
      color: colors.textSecondary,
      letterSpacing: 1.2,
    },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 99,
      paddingVertical: 8,
      paddingHorizontal: 12,
      maxWidth: "100%",
    },
    chipDate: {
      fontFamily: "monospace",
      fontSize: 10,
      color: colors.accentBlue,
      letterSpacing: 0.5,
    },
    chipText: {
      fontFamily: "Georgia",
      fontSize: 12,
      color: colors.textSecondary,
      flexShrink: 1,
    },
  });
}
