import { View, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = {
  current: 1 | 2 | 3;
};

export function OnboardingProgressDots({ current }: Props) {
  return (
    <View style={styles.row}>
      {([1, 2, 3] as const).map((n) => (
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
