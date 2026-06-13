import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { ColorTokens } from "@/constants/colors";

type Props = { online?: boolean };

export function LiveMonitoringBadge({ online = true }: Props) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors, online), [colors, online]);

  return (
    <View style={styles.pill}>
      <View style={styles.dot} />
      <Text style={styles.label}>{online ? "LIVE" : "OFFLINE"}</Text>
    </View>
  );
}

function makeStyles(colors: ColorTokens, online: boolean) {
  const tone = online ? colors.successGreen : colors.textMuted;
  return StyleSheet.create({
    pill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: online ? "rgba(52,211,153,0.12)" : "transparent",
      borderWidth: 1,
      borderColor: online ? "rgba(52,211,153,0.3)" : colors.border,
      borderRadius: 99,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 99,
      backgroundColor: tone,
    },
    label: {
      fontFamily: "monospace",
      fontSize: 10,
      color: tone,
      fontWeight: "600",
      letterSpacing: 0.8,
    },
  });
}
