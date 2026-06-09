import { useEffect, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = { transcript: string };

export function LiveTranscriptCard({ transcript }: Props) {
  const colors = useTheme();
  const [cursorOpacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [cursorOpacity]);

  const hasText = transcript.length > 0;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: "rgba(21, 29, 46, 0.9)",
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 20,
    },
    text: {
      fontFamily: "Georgia",
      fontStyle: "italic",
      fontSize: 16,
      color: colors.textPrimary,
      lineHeight: 26,
    },
    placeholder: {
      fontFamily: "Georgia",
      fontStyle: "italic",
      fontSize: 16,
      color: colors.textMuted,
      lineHeight: 26,
    },
    cursor: {
      fontFamily: "Georgia",
      fontStyle: "italic",
      fontSize: 16,
      color: colors.textPrimary,
    },
  });

  return (
    <View style={styles.card}>
      <Text style={hasText ? styles.text : styles.placeholder}>
        {hasText ? transcript : "Listening..."}
        <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
          {" |"}
        </Animated.Text>
      </Text>
    </View>
  );
}
