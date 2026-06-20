import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

/**
 * Timeline entry point for Doctor Visit Prep. Lives with the history view
 * because the brief is a summary OF that history — keeping Home focused on
 * capture (talk / scan / ask) and review actions next to the timeline.
 */
export function VisitPrepCard() {
  const colors = useTheme();

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
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.warningAmber,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontFamily: "Georgia",
      fontSize: 16,
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
      onPress={() => router.push("/visit-prep" as any)}
    >
      <View style={styles.iconBox}>
        <Ionicons name="clipboard-outline" size={22} color={colors.textPrimary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Prepare for a Doctor Visit</Text>
        <Text style={styles.subtitle}>A summary of your recent health to bring</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}
