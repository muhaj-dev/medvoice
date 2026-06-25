import { View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  current: number;
  total?: number;
};

export function OnboardingProgressDots({ current, total = 4 }: Props) {
  const colors = useTheme();

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    dot: {
      height: 8,
      borderRadius: 4,
    },
    dotActive: {
      width: 24,
      backgroundColor: colors.accentBlue,
    },
    dotPast: {
      width: 8,
      backgroundColor: colors.accentBlue,
      opacity: 0.5,
    },
    dotInactive: {
      width: 8,
      backgroundColor: colors.textMuted,
    },
  });

  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
        <View
          key={n}
          style={[
            styles.dot,
            n === current
              ? styles.dotActive
              : n < current
              ? styles.dotPast
              : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}
