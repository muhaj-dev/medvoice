import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colors } from "@/constants/colors";

export function CareViewEmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👨‍👩‍👧</Text>
      <Text style={styles.title}>No one connected yet</Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/family" as any)}
        activeOpacity={0.7}
        style={styles.btn}
      >
        <Text style={styles.btnText}>Connect a family member →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  emoji: { fontSize: 48 },
  title: {
    fontFamily: "Georgia",
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    backgroundColor: "rgba(59,130,246,0.12)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.3)",
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: "Georgia",
    fontSize: 15,
    color: colors.accentBlue,
  },
});
