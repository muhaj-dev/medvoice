import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Home-screen entry point for "Ask MedVoice" — conversational voice query over
 * the user's own health history. A compact row card matching ScanDocumentCard,
 * sitting alongside the other secondary actions beneath Tap to Talk.
 */
export function AskHealthCard() {
  const colors = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 16,
      minHeight: 48,
    },
    pressed: { opacity: 0.85 },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.successGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontFamily: "Georgia",
      fontSize: 17,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    subtitle: {
      fontFamily: "Georgia",
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
  });

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push("/ask" as any)}
    >
      <View style={styles.iconBox}>
        <Ionicons name="sparkles" size={22} color={colors.textPrimary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{t("ask.cardTitle")}</Text>
        <Text style={styles.subtitle}>{t("ask.cardSubtitle")}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}
