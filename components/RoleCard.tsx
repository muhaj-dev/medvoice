import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  emoji: string;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

export function RoleCard({ emoji, title, description, selected, onPress }: Props) {
  const colors = useTheme();

  const styles = StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.bgCard,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 20,
      gap: 14,
    },
    cardSelected: {
      backgroundColor: "rgba(59,130,246,0.08)",
      borderColor: colors.accentBlue,
    },
    checkmark: {
      position: "absolute",
      top: 14,
      right: 14,
    },
    emojiWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.05)",
      alignItems: "center",
      justifyContent: "center",
    },
    emoji: {
      fontSize: 22,
    },
    textWrap: {
      flex: 1,
      paddingRight: 24,
    },
    title: {
      fontFamily: "Georgia",
      fontSize: 17,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    description: {
      fontFamily: "Georgia",
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, selected && styles.cardSelected]}
    >
      {selected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={22} color={colors.accentBlue} />
        </View>
      )}
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}
