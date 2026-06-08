import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Alert, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AudioModule } from "expo-audio";
import { colors } from "@/constants/colors";

export function PulsingMicButton() {
  const pulseOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseOpacity]);

  const handlePress = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Microphone Access Needed",
          "MedVoice needs the microphone to record your health update privately on this device. Please enable it in Settings.",
          [{ text: "OK" }]
        );
        return;
      }
    } catch {
      // Permission API unavailable — proceed and let the recorder handle it
    }
    router.push("/recording/active" as any);
  };

  return (
    <View style={styles.container}>
      {/* Pulsing glow ring behind the button */}
      <Animated.View style={[styles.glowRing, { opacity: pulseOpacity }]} />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.85}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="mic" size={28} color={colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.tapLabel}>Tap to start</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: "rgba(59, 130, 246, 0.35)",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accentBlue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accentBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 12,
  },
  tapLabel: {
    position: "absolute",
    top: 108,
    fontFamily: "Georgia",
    fontSize: 13,
    color: colors.textSecondary,
  },
});
