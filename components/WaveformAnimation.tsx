import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

const BAR_COUNT = 18;

type BarSpec = { minH: number; maxH: number; color: string };

// Alternate tall/short bars so the waveform has visual rhythm
const BARS: BarSpec[] = Array.from({ length: BAR_COUNT }, (_, i) => {
  const tall = i % 2 === 0;
  return {
    minH: tall ? 10 : 6,
    maxH: tall ? 32 : 14,
    color: tall ? colors.accentBlue : colors.accentBlueLight,
  };
});

type Props = { isActive: boolean };

export function WaveformAnimation({ isActive }: Props) {
  const heights = useRef(BARS.map((b) => new Animated.Value(b.minH))).current;
  const loops = useRef<Animated.CompositeAnimation[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isActive) {
      loops.current = heights.map((h, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(h, {
              toValue: BARS[i].maxH,
              duration: 280 + (i % 6) * 60,
              useNativeDriver: false,
            }),
            Animated.timing(h, {
              toValue: BARS[i].minH,
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
          toValue: BARS[i].minH,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      timers.current.forEach(clearTimeout);
      loops.current.forEach((l) => l.stop());
    };
  }, [isActive]);

  return (
    <View style={styles.row}>
      {heights.map((h, i) => (
        <Animated.View
          key={i}
          style={[styles.bar, { height: h, backgroundColor: BARS[i].color }]}
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
