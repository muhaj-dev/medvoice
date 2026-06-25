import { useEffect, useState } from "react";
import { View, Text, Animated, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

type Props = { transcript: string; warming?: boolean };

export function LiveTranscriptCard({ transcript, warming = false }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
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
  // While the voice model warms up (and no words yet), show a loading state so
  // the user knows the app is preparing rather than ignoring them.
  const showWarming = warming && !hasText;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: "rgba(21, 29, 46, 0.9)",
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 16,
      padding: 20,
    },
    warmingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    warmingText: {
      flex: 1,
      fontFamily: "Georgia",
      fontStyle: "italic",
      fontSize: 15,
      color: colors.textSecondary,
      lineHeight: 24,
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
      {showWarming ? (
        <View
          style={styles.warmingRow}
          accessible
          accessibilityRole="alert"
          accessibilityLabel={t("recording.warmingModel")}
          accessibilityLiveRegion="polite"
        >
          <ActivityIndicator size="small" color={colors.accentBlue} />
          <Text style={styles.warmingText}>{t("recording.warmingModel")}</Text>
        </View>
      ) : (
        <Text style={hasText ? styles.text : styles.placeholder}>
          {hasText ? transcript : t("recording.listening")}
          <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
            {" |"}
          </Animated.Text>
        </Text>
      )}
    </View>
  );
}
