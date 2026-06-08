import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export function TimelineVerticalLine() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 9,
    width: 2,
    backgroundColor: colors.border,
    zIndex: 0,
  },
});
