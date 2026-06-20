import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

/**
 * Home-screen entry point for the document-scan feature. A compact row card so
 * it reads as a secondary action beneath the primary "Tap to Talk" card.
 * Built for accessibility — large touch target, clear label, high contrast.
 */
export function ScanDocumentCard() {
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
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.accentBlue,
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
      onPress={() => router.push("/scan/capture" as any)}
    >
      <View style={styles.iconBox}>
        <Ionicons name="document-text" size={24} color={colors.textPrimary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Scan a Document</Text>
        <Text style={styles.subtitle}>Read a prescription or note aloud</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}
