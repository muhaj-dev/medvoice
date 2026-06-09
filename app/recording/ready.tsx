import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { ReadyMicDisplay } from "@/components/ReadyMicDisplay";
import { PulsingMicButton } from "@/components/PulsingMicButton";
import { preloadAllModels } from "@/lib/qvac";

export default function RecordingReadyScreen() {
  const colors = useTheme();

  // Ensure the sequential preload is running (no-op if already started).
  // Guarantees Parakeet is downloading before the user records.
  useEffect(() => {
    preloadAllModels();
  }, []);

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    backBtn: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 4,
      alignSelf: "flex-start",
    },
    backText: {
      fontFamily: "monospace",
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    content: {
      flex: 1,
      alignItems: "center",
      paddingTop: 28,
    },
    readyLabel: {
      fontFamily: "monospace",
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 0.18 * 11,
      marginBottom: 36,
    },
    micWrap: {
      marginBottom: 36,
    },
    heading: {
      fontFamily: "Georgia",
      fontSize: 28,
      fontWeight: "700",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 14,
    },
    description: {
      fontFamily: "Georgia",
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      maxWidth: 280,
    },
    buttonArea: {
      alignItems: "center",
      paddingBottom: 52,
    },
  });

  return (
    <SafeAreaView style={styles.root}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.backText}>← BACK</Text>
      </TouchableOpacity>

      {/* Upper content */}
      <View style={styles.content}>
        <Text style={styles.readyLabel}>READY TO LISTEN</Text>

        <View style={styles.micWrap}>
          <ReadyMicDisplay />
        </View>

        <Text style={styles.heading}>How are you feeling?</Text>

        <Text style={styles.description}>
          Tap the button below and speak naturally. MedPsy will analyze your
          health update on this device.
        </Text>
      </View>

      {/* Button anchored at bottom */}
      <View style={styles.buttonArea}>
        <PulsingMicButton />
      </View>
    </SafeAreaView>
  );
}
