import { View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export function TimelineVerticalLine() {
  const colors = useTheme();

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

  return <View style={styles.line} />;
}
