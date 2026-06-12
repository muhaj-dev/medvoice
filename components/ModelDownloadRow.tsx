/**
 * One model row in the download gate — status icon, label, size, progress.
 * `background` rows (search, read-aloud) don't block app entry; they show
 * BACKGROUND instead of WAITING so users know they won't be held up.
 */
import { Text, View, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { ModelState, ModelStatus } from "@/store/useModelStore";

function statusIcon(status: ModelStatus): string {
  if (status === "ready") return "✓";
  if (status === "loading") return "↓";
  if (status === "error") return "✕";
  return "○";
}

type Props = {
  label: string;
  size: string;
  state: ModelState;
  background?: boolean;
};

export function ModelDownloadRow({ label, size, state, background }: Props) {
  const colors = useTheme();
  const isReady = state.status === "ready";
  const isLoading = state.status === "loading";
  const isError = state.status === "error";
  const color = isReady
    ? colors.successGreen
    : isError
    ? colors.warningRed
    : isLoading
    ? colors.accentBlue
    : colors.textMuted;

  const statusText = isLoading
    ? `${state.progress}%`
    : isReady
    ? "READY"
    : isError
    ? "ERROR"
    : background
    ? "BACKGROUND"
    : "WAITING";

  return (
    <View style={s.row}>
      <View style={[s.iconBox, { backgroundColor: colors.bgCard, borderColor: color }]}>
        <Text style={[s.iconText, { color }]}>{statusIcon(state.status)}</Text>
      </View>
      <View style={s.rowInfo}>
        <Text style={[s.rowLabel, { color }]}>{label}</Text>
        <Text style={[s.rowMeta, { color: colors.textMuted }]}>
          {isLoading ? `${state.progress}% of ${size}` : size}
        </Text>
      </View>
      <Text style={[s.rowMeta, { color }]}>{statusText}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 9, gap: 12 },
  iconBox: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  iconText: { fontFamily: "monospace", fontSize: 13 },
  rowInfo: { flex: 1 },
  rowLabel: { fontFamily: "Georgia", fontSize: 14 },
  rowMeta: { fontFamily: "monospace", fontSize: 10, marginTop: 1 },
});
