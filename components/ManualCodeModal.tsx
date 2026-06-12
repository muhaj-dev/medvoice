/**
 * Manual family-code entry. For when there's no QR to scan — the user pastes or
 * types a family member's connection code, then continues to the same name +
 * relationship step the QR flow uses.
 */
import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  visible: boolean;
  onSubmit: (code: string) => void;
  onDismiss: () => void;
};

export function ManualCodeModal({ visible, onSubmit, onDismiss }: Props) {
  const colors = useTheme();
  const [code, setCode] = useState("");

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) setCode(text.trim());
  };

  const handleNext = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setCode("");
  };

  const styles = StyleSheet.create({
    backdrop: { flex: 1 },
    sheet: {
      backgroundColor: colors.bgCard,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 20,
    },
    title: {
      fontFamily: "Georgia",
      fontSize: 17,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 6,
    },
    subtitle: {
      fontFamily: "Georgia",
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 20,
      lineHeight: 20,
    },
    input: {
      backgroundColor: colors.bgDeep,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontFamily: "monospace",
      fontSize: 13,
      color: colors.textPrimary,
      minHeight: 96,
      textAlignVertical: "top",
      marginBottom: 12,
    },
    pasteBtn: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 4,
      marginBottom: 20,
    },
    pasteText: {
      fontFamily: "monospace",
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 1,
      color: colors.accentBlue,
    },
    btn: {
      backgroundColor: colors.accentBlue,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
    },
    btnDisabled: { opacity: 0.4 },
    btnText: {
      fontFamily: "monospace",
      fontSize: 13,
      fontWeight: "600",
      letterSpacing: 1.2,
      color: "#ffffff",
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.backdrop} onPress={onDismiss} activeOpacity={1} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Enter code manually</Text>
          <Text style={styles.subtitle}>
            Paste the connection code your family member shared with you.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Paste their code here"
            placeholderTextColor={colors.textMuted}
            value={code}
            onChangeText={setCode}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.pasteBtn} onPress={handlePaste} activeOpacity={0.7}>
            <Ionicons name="clipboard-outline" size={16} color={colors.accentBlue} />
            <Text style={styles.pasteText}>PASTE FROM CLIPBOARD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            style={[styles.btn, !code.trim() && styles.btnDisabled]}
            disabled={!code.trim()}
          >
            <Text style={styles.btnText}>NEXT →</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
