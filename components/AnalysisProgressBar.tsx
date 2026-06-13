/**
 * Overall analysis progress — mirrors the model-download gate's counting bar.
 * Shows an animated track fill plus a live percentage as the pipeline moves
 * from transcribe → scan → RAG → analyze → complete. The number is driven by
 * `pct` (already animated in the processing screen); `anim` drives the fill
 * width so the two stay perfectly in sync.
 */
import { View, Text, Animated, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  anim: Animated.Value;
  pct: number;
  done: boolean;
};

export function AnalysisProgressBar({ anim, pct, done }: Props) {
  const colors = useTheme();

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  const accent = done ? colors.successGreen : colors.accentBlue;

  return (
    <View style={s.wrap}>
      <View style={[s.trackBg, { backgroundColor: colors.border }]}>
        <Animated.View style={[s.trackFill, { width, backgroundColor: accent }]} />
      </View>
      <View style={s.pctRow}>
        <Text style={[s.pctLabel, { color: colors.textMuted }]}>
          {done ? "ANALYSIS COMPLETE" : "ANALYZING ON DEVICE"}
        </Text>
        <Text style={[s.pctValue, { color: accent }]}>{pct}%</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: 24 },
  trackBg: { height: 5, borderRadius: 3, marginBottom: 6, overflow: "hidden" },
  trackFill: { height: 5, borderRadius: 3 },
  pctRow: { flexDirection: "row", justifyContent: "space-between" },
  pctLabel: { fontFamily: "monospace", fontSize: 10, letterSpacing: 0.8 },
  pctValue: { fontFamily: "monospace", fontSize: 10, letterSpacing: 0.8 },
});
