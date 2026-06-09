import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet, LayoutChangeEvent } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export type StepStatus = "pending" | "running" | "done";

type Props = {
  icon: string;
  label: string;
  status: StepStatus;
  isLast?: boolean;
};

function RunningIndicator() {
  const colors = useTheme();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.15, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: 20,
          height: 2,
          borderRadius: 1,
          backgroundColor: colors.accentBlue,
        },
        { opacity },
      ]}
    />
  );
}

function ProgressBar() {
  const colors = useTheme();
  const [widthAnim] = useState(() => new Animated.Value(0));
  const started = useRef(false);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && !started.current) {
      started.current = true;
      Animated.timing(widthAnim, {
        toValue: w,
        duration: 2200,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <View
      style={{
        height: 2,
        marginTop: 8,
        overflow: "hidden",
        borderRadius: 1,
      }}
      onLayout={handleLayout}
    >
      <Animated.View
        style={{
          height: 2,
          backgroundColor: colors.accentBlue,
          borderRadius: 1,
          width: widthAnim,
        }}
      />
    </View>
  );
}

export function PipelineStepRow({ icon, label, status, isLast }: Props) {
  const colors = useTheme();

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    iconBoxGreen: {
      backgroundColor: colors.successGreen,
      borderColor: colors.successGreen,
    },
    emoji: {
      fontSize: 20,
    },
    greenCheck: {
      fontSize: 18,
      color: colors.textPrimary,
      fontWeight: "700",
    },
    labelWrap: {
      flex: 1,
    },
    label: {
      fontFamily: "monospace",
      fontSize: 13,
      color: colors.textPrimary,
      lineHeight: 20,
    },
    labelMuted: {
      color: colors.textSecondary,
    },
    statusSlot: {
      width: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    checkmark: {
      fontSize: 16,
      color: colors.successGreen,
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.row}>
      {/* Icon container */}
      <View style={[styles.iconBox, isLast && styles.iconBoxGreen]}>
        {isLast ? (
          <Text style={styles.greenCheck}>✓</Text>
        ) : (
          <Text style={styles.emoji}>{icon}</Text>
        )}
      </View>

      {/* Label area — column for last step to fit progress bar */}
      <View style={styles.labelWrap}>
        <Text
          style={[styles.label, isLast && styles.labelMuted]}
          numberOfLines={2}
        >
          {label}
        </Text>
        {isLast && status === "running" && <ProgressBar />}
      </View>

      {/* Status right-side indicator (non-last steps only) */}
      <View style={styles.statusSlot}>
        {status === "done" && !isLast && (
          <Text style={styles.checkmark}>✓</Text>
        )}
        {status === "running" && !isLast && <RunningIndicator />}
      </View>
    </View>
  );
}
