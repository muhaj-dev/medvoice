import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

export function ReadyMicDisplay() {
  const colors = useTheme();

  const styles = StyleSheet.create({
    circle: {
      width: 160,
      height: 160,
      borderRadius: 80,
      backgroundColor: colors.bgCard,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.7,
      shadowRadius: 28,
      elevation: 14,
    },
  });

  return (
    <View style={styles.circle}>
      <Ionicons name="mic" size={52} color={colors.textSecondary} />
    </View>
  );
}
