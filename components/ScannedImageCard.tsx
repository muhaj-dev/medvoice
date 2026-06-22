import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

type Props = { uri: string };

/**
 * Shows the photo the user scanned, above the recognized text and summary.
 * The image is contained inside a rounded card so the reader can see the
 * original page next to MedPsy's explanation of it.
 */
export function ScannedImageCard({ uri }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 12,
    },
    label: {
      fontFamily: "monospace",
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 1.2,
      marginBottom: 10,
      paddingHorizontal: 6,
    },
    image: {
      width: "100%",
      aspectRatio: 3 / 4,
      borderRadius: 12,
      backgroundColor: colors.bgDeep,
    },
  });

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{t("scan.scannedDocumentLabel")}</Text>
      <Image source={{ uri }} style={styles.image} contentFit="cover" transition={150} />
    </View>
  );
}
