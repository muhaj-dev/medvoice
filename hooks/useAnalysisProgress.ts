/**
 * Drives the counting progress bar on the analysis screen — the same effect as
 * the model-download gate. Each pipeline step owns a slice of the bar: while a
 * step runs the bar creeps slowly toward `ceil` (the work takes an unknown
 * time); when it finishes it settles on `end`. Step 4 (model analysis) is the
 * longest, so it gets the widest band and the slowest creep.
 */
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import type { StepStatus } from "@/components/PipelineStepRow";

const BANDS: Record<number, { ceil: number; end: number; creep: number }> = {
  1: { ceil: 18, end: 20, creep: 3500 },
  2: { ceil: 38, end: 40, creep: 3500 },
  3: { ceil: 58, end: 60, creep: 3500 },
  4: { ceil: 92, end: 96, creep: 14000 },
  5: { ceil: 100, end: 100, creep: 400 },
};

export function useAnalysisProgress() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = progress.addListener(({ value }) => setPct(Math.round(value)));
    return () => progress.removeListener(id);
  }, [progress]);

  const animateTo = (value: number, duration: number) =>
    Animated.timing(progress, { toValue: value, duration, useNativeDriver: false }).start();

  const advance = (id: number, status: StepStatus) => {
    const band = BANDS[id];
    if (!band) return;
    if (status === "running") animateTo(band.ceil, band.creep);
    if (status === "done") animateTo(band.end, 300);
  };

  return { progress, pct, done, advance, finish: () => setDone(true) };
}
