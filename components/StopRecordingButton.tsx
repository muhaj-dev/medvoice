import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = { onPress: () => void };

export function StopRecordingButton({ onPress }: Props) {
  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        style={styles.btn}
        onPress={onPress}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.square} />
      </TouchableOpacity>
      <Text style={styles.label}>Tap to stop & analyze</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 14,
  },
  btn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.warningRed,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.warningRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  square: {
    width: 20,
    height: 20,
    backgroundColor: colors.textPrimary,
    borderRadius: 2,
  },
  label: {
    fontFamily: "Georgia",
    fontSize: 13,
    color: colors.textSecondary,
  },
});
