import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import type { ColorTokens } from "@/constants/colors";

type Props = { onPick: (question: string) => void };

/**
 * Empty-state for the Ask screen. Example questions double as a how-to-use
 * hint and a one-tap way to try the feature without typing or speaking.
 */
export function AskSuggestions({ onPick }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
  const styles = makeStyles(colors);

  const SUGGESTIONS = [
    t("ask.suggestion1"),
    t("ask.suggestion2"),
    t("ask.suggestion3"),
    t("ask.suggestion4"),
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Ionicons name="sparkles-outline" size={26} color={colors.accentBlue} />
      </View>
      <Text style={styles.title}>{t("ask.emptyTitle")}</Text>
      <Text style={styles.subtitle}>{t("ask.emptySubtitle")}</Text>

      <View style={styles.list}>
        {SUGGESTIONS.map((q) => (
          <TouchableOpacity
            key={q}
            style={styles.suggestion}
            activeOpacity={0.7}
            onPress={() => onPick(q)}
          >
            <Text style={styles.suggestionText}>{q}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    wrap: { alignItems: "center", paddingTop: 24, gap: 10 },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    title: {
      fontFamily: "Georgia",
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    subtitle: {
      fontFamily: "Georgia",
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 21,
      paddingHorizontal: 12,
      marginBottom: 8,
    },
    list: { alignSelf: "stretch", gap: 10 },
    suggestion: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 16,
      minHeight: 48,
    },
    suggestionText: {
      flex: 1,
      fontFamily: "Georgia",
      fontSize: 15,
      color: colors.textPrimary,
    },
  });
}
