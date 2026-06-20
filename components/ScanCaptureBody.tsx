import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { DocumentCameraView } from "@/components/DocumentCameraView";

type Props = {
  hasPermission: boolean;
  onBack: () => void;
  onCaptured: (uri: string) => void;
};

export const ScanCaptureBody = ({ hasPermission, onBack, onCaptured }: Props) => {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 24 }}
      >
        <Text style={[styles.backText, { color: colors.textSecondary }]}>← BACK</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Scan a Document</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Point your camera at the page
        </Text>
      </View>

      <View style={styles.viewfinderWrap}>
        <DocumentCameraView hasPermission={hasPermission} onCaptured={onCaptured} />
      </View>

      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {"Hold steady and fill the frame with the text.\nTap the button to capture."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  backBtn: { alignSelf: "flex-start", marginBottom: 24, paddingVertical: 8 },
  backText: { fontFamily: "monospace", fontSize: 12, letterSpacing: 1 },
  header: { alignItems: "center", gap: 10, marginBottom: 24 },
  title: { fontFamily: "Georgia", fontSize: 24, fontWeight: "700", textAlign: "center" },
  subtitle: { fontFamily: "Georgia", fontSize: 14, textAlign: "center" },
  viewfinderWrap: { alignItems: "center", marginBottom: 24 },
  hint: { fontFamily: "Georgia", fontSize: 13, textAlign: "center", lineHeight: 22 },
});
