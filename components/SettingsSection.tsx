import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function SettingsSection({ title, children }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: "hidden",
  },
});
