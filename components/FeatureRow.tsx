import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = {
  emoji: string;
  text: string;
};

export function FeatureRow({ emoji, text }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 24,
  },
  text: {
    flex: 1,
    fontFamily: "Georgia",
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});
