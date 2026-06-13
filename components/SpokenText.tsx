import { useMemo } from "react";
import { Text, type TextStyle, type StyleProp } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTtsStore } from "@/store/useTtsStore";
import { splitSentences } from "@/lib/tts";

type Props = {
  // Must match the id passed to the Read Aloud control for this same text.
  id: string;
  text: string;
  style?: StyleProp<TextStyle>;
};

/**
 * Renders a summary as text that highlights the sentence currently being read
 * aloud (karaoke-style), advancing as playback moves through it. Splits the
 * text exactly like the TTS engine so the highlighted sentence lines up with
 * what's being spoken. When nothing is playing for this id, it's plain text.
 */
export function SpokenText({ id, text, style }: Props) {
  const colors = useTheme();
  const activeId = useTtsStore((s) => s.activeId);
  const status = useTtsStore((s) => s.status);
  const sentenceIndex = useTtsStore((s) => s.sentenceIndex);

  const sentences = useMemo(() => splitSentences(text), [text]);
  const active = activeId === id && status === "playing";

  // Not this text, or not playing → render as a single plain string (cheapest
  // and avoids any spacing drift from the split/rejoin).
  if (!active) return <Text style={style}>{text}</Text>;

  return (
    <Text style={style}>
      {sentences.map((s, i) => (
        <Text
          key={i}
          style={
            i === sentenceIndex
              ? { backgroundColor: colors.accentBlue + "33", color: colors.textPrimary }
              : undefined
          }
        >
          {s}
          {i < sentences.length - 1 ? " " : ""}
        </Text>
      ))}
    </Text>
  );
}
