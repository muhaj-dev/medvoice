import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTtsStore } from "@/store/useTtsStore";
import { useSettingsStore } from "@/store/useSettingsStore";

type Props = {
  // Unique per screen context (e.g. `tl-<id>`), since local + synced entries
  // can share an id. See useTtsStore.
  id: string;
  text: string;
};

/**
 * "READ ALOUD → loading → STOP" pill that speaks the displayed text on tap.
 * Reads directly from the text it's given (the on-screen summary) — no model
 * call to regenerate it. Hidden when TTS is off in Settings or there's no text.
 */
export function ReadAloudButton({ id, text }: Props) {
  const colors = useTheme();
  const ttsEnabled = useSettingsStore((s) => s.ttsEnabled);
  const activeId = useTtsStore((s) => s.activeId);
  const status = useTtsStore((s) => s.status);
  const toggle = useTtsStore((s) => s.toggle);

  if (!ttsEnabled || !text.trim()) return null;

  const mine = activeId === id;
  const loading = mine && status === "loading";
  const playing = mine && status === "playing";
  const tint = playing ? colors.warningRed : colors.accentBlue;

  const styles = StyleSheet.create({
    btn: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 7,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: playing ? colors.warningRed : colors.border,
      backgroundColor: colors.bgDeep,
      minHeight: 40,
    },
    text: {
      fontFamily: "monospace",
      fontSize: 11,
      fontWeight: "600",
      letterSpacing: 0.8,
      color: tint,
    },
  });

  const label = loading ? "LOADING…" : playing ? "⏹  STOP" : "🔊  READ ALOUD";

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => toggle(id, text)}
      activeOpacity={0.75}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {loading && <ActivityIndicator size="small" color={colors.accentBlue} />}
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}
