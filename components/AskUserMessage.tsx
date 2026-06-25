import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import type { ColorTokens } from "@/constants/colors";

type Props = { text: string };

/**
 * The user's question in the chat thread — a right-aligned bubble, like the
 * "you" message in ChatGPT/Claude. MedVoice's answer renders below it.
 */
export function AskUserMessage({ text }: Props) {
  const colors = useTheme();
  const styles = makeStyles(colors);

  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

function makeStyles(colors: ColorTokens) {
  return StyleSheet.create({
    row: { flexDirection: "row", justifyContent: "flex-end" },
    bubble: {
      maxWidth: "85%",
      backgroundColor: colors.accentBlue,
      borderRadius: 18,
      borderBottomRightRadius: 6,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    text: {
      fontFamily: "Georgia",
      fontSize: 15,
      color: "#ffffff",
      lineHeight: 22,
    },
  });
}
