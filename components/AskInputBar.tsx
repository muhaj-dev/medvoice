import { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useRecordingStore } from "@/store/useRecordingStore";
import { useVoiceTranscription } from "@/hooks/useVoiceTranscription";
import type { ColorTokens } from "@/constants/colors";

type Props = {
  onSubmit: (question: string) => void;
  busy: boolean;
};

/**
 * Combined text + voice input for "Ask MedVoice". Type a question and send, or
 * tap the mic to ask out loud — live transcription fills the field as you
 * speak (reusing the same on-device Parakeet capture as the recording flow),
 * and releasing the mic submits the spoken question automatically.
 */
export function AskInputBar({ onSubmit, busy }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
  const styles = makeStyles(colors);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const { start, stop } = useVoiceTranscription();
  const liveTranscript = useRecordingStore((s) => s.transcript);

  // The field shows the live transcript while the mic is open, and the typed
  // value otherwise — derived, not synced, so there's no setState-in-effect.
  const displayValue = listening ? liveTranscript : text;

  // Stop capturing if the screen unmounts mid-listen.
  useEffect(() => {
    return () => {
      if (listening) stop().catch(() => {});
    };
  }, [listening, stop]);

  const handleMic = async () => {
    if (busy) return;
    if (listening) {
      const { text: finalText } = await stop();
      setListening(false);
      const q = (finalText || liveTranscript).trim();
      if (q) onSubmit(q);
    } else {
      setText("");
      setListening(true);
      start();
    }
  };

  const handleSend = () => {
    const q = text.trim();
    if (!q || busy) return;
    onSubmit(q);
  };

  const canSend = text.trim().length > 0 && !listening && !busy;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={displayValue}
        onChangeText={setText}
        editable={!listening && !busy}
        placeholder={
          listening ? t("ask.listening") : t("ask.inputPlaceholder")
        }
        placeholderTextColor={colors.textMuted}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        multiline
      />

      {canSend ? (
        <TouchableOpacity
          style={[styles.iconBtn, styles.sendBtn]}
          onPress={handleSend}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-up" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.iconBtn,
            listening ? styles.micActive : styles.micIdle,
          ]}
          onPress={handleMic}
          disabled={busy}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={listening ? "stop" : "mic"}
            size={20}
            color={listening ? colors.textPrimary : colors.accentBlue}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      paddingLeft: 16,
      paddingRight: 8,
      paddingVertical: 8,
      minHeight: 56,
    },
    input: {
      flex: 1,
      fontFamily: "Georgia",
      fontSize: 15,
      color: colors.textPrimary,
      paddingVertical: 8,
      maxHeight: 120,
    },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    sendBtn: { backgroundColor: colors.accentBlue },
    micIdle: {
      backgroundColor: colors.bgDeep,
      borderWidth: 1,
      borderColor: colors.border,
    },
    micActive: { backgroundColor: colors.warningRed },
  });
}
