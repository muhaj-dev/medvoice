import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

export function ReadyMicDisplay() {
  return (
    <View style={styles.circle}>
      <Ionicons name="mic" size={52} color={colors.textSecondary} />
    </View>
  );
}

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
