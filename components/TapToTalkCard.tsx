import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/colors";

export function TapToTalkCard() {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push("/recording/ready" as any)}
    >
      {/* Inner layout via NativeWind — Pressable owns only card bg/border/radius */}
      <View className="items-center py-8 px-6">
        {/* Outer glow halo: semi-transparent blue ring + shadow spread */}
        <View style={styles.glowHalo} className="items-center justify-center mb-4">
          {/* Solid blue mic circle */}
          <View style={styles.micCircle} className="items-center justify-center">
            <Ionicons name="mic" size={28} color={colors.textPrimary} />
          </View>
        </View>

        <Text className="font-georgia text-[22px] font-bold text-white text-center mb-1.5">
          Tap to Talk
        </Text>
        <Text className="font-georgia text-[14px] text-dim text-center">
          Tell me how you feel today
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.85,
  },
  glowHalo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(59, 130, 246, 0.18)",
    shadowColor: colors.accentBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 22,
    elevation: 14,
  },
  micCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentBlue,
  },
});
