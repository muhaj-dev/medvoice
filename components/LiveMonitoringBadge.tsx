import { View, Text, StyleSheet } from "react-native";

export function LiveMonitoringBadge() {
  return (
    <View style={styles.pill}>
      <View style={styles.dot} />
      <Text style={styles.label}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(52,211,153,0.12)",
    borderWidth: 1,
    borderColor: "rgba(52,211,153,0.3)",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: "#34d399",
  },
  label: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#34d399",
    fontWeight: "600",
    letterSpacing: 0.8,
  },
});
