import { useEffect, useRef, useState } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

const BAR_COUNT = 18;

type Props = { isActive: boolean };

export function WaveformAnimation({ isActive }: Props) {
  const colors = useTheme();

  // Alternate tall/short bars for visual rhythm; colors come from theme
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => ({
    minH: i % 2 === 0 ? 10 : 6,
    maxH: i % 2 === 0 ? 32 : 14,
    color: i % 2 === 0 ? colors.accentBlue : colors.accentBlueLight,
  }));

  const [heights] = useState(() => bars.map((b) => new Animated.Value(b.minH)));
  const loops = useRef<Animated.CompositeAnimation[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isActive) {
      loops.current = heights.map((h, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(h, {
              toValue: bars[i].maxH,
              duration: 280 + (i % 6) * 60,
              useNativeDriver: false,
            }),
            Animated.timing(h, {
              toValue: bars[i].minH,
              duration: 280 + (i % 6) * 60,
              useNativeDriver: false,
            }),
          ])
        )
      );
      timers.current = heights.map((_, i) =>
        setTimeout(() => loops.current[i]?.start(), i * 80)
      );
    } else {
      timers.current.forEach(clearTimeout);
      loops.current.forEach((l) => l.stop());
      heights.forEach((h, i) => {
        Animated.timing(h, {
          toValue: bars[i].minH,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      timers.current.forEach(clearTimeout);
      loops.current.forEach((l) => l.stop());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, heights]);

  return (
    <View style={styles.row}>
      {heights.map((h, i) => (
        <Animated.View
          key={i}
          style={[styles.bar, { height: h, backgroundColor: bars[i].color }]}
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
    gap: 4,
    height: 48,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
});
