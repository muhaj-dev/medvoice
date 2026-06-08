import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  count: number;
};

export function ConcernFlaggedBanner({ count }: Props) {
  const colors = useTheme();
  if (count === 0) return null;

  const styles = StyleSheet.create({
    banner: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      backgroundColor: "rgba(248,113,113,0.1)",
      borderWidth: 1,
      borderColor: "rgba(248,113,113,0.2)",
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 14,
    },
    bell: {
      fontSize: 18,
      marginTop: 1,
    },
    content: {
      flex: 1,
      gap: 4,
    },
    title: {
      fontFamily: "monospace",
      fontSize: 13,
      color: colors.warningRed,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    subtitle: {
      fontFamily: "Georgia",
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },
  });

  return (
    <View style={styles.banner}>
      <Text style={styles.bell}>🔔</Text>
      <View style={styles.content}>
        <Text style={styles.title}>CONCERN FLAGGED</Text>
        <Text style={styles.subtitle}>
          {"MedPsy flagged"} {count} {count !== 1 ? "items" : "item"} {"in today's entry"}
        </Text>
      </View>
    </View>
  );
}
