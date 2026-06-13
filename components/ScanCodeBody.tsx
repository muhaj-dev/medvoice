import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { QRScannerViewfinder } from "@/components/QRScannerViewfinder";

type Props = {
  hasPermission: boolean;
  paused: boolean;
  showSuccess: boolean;
  onBack: () => void;
  onCodeDetected: (data: string) => void;
  onEnterManually: () => void;
};

export const ScanCodeBody = ({
  hasPermission,
  paused,
  showSuccess,
  onBack,
  onCodeDetected,
  onEnterManually,
}: Props) => {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 24 }}
      >
        <Text style={[styles.backText, { color: colors.textSecondary }]}>
          ← BACK
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {"Scan Family Member's Code"}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Point your camera at their QR code
        </Text>
      </View>

      <View style={styles.viewfinderWrap}>
        <QRScannerViewfinder
          onCodeDetected={onCodeDetected}
          hasPermission={hasPermission}
          paused={paused}
          showSuccess={showSuccess}
        />
      </View>

      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        {"The code will be detected automatically.\nNo need to tap anything."}
      </Text>

      <TouchableOpacity
        onPress={onEnterManually}
        style={styles.manualBtn}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.manualText, { color: colors.accentBlue }]}>
          NO QR CODE? ENTER CODE MANUALLY
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 32,
    paddingVertical: 8,
  },
  backText: {
    fontFamily: "monospace",
    fontSize: 12,
    letterSpacing: 1,
  },
  header: {
    alignItems: "center",
    gap: 10,
    marginBottom: 36,
  },
  title: {
    fontFamily: "Georgia",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Georgia",
    fontSize: 14,
    textAlign: "center",
  },
  viewfinderWrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  hint: {
    fontFamily: "Georgia",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 22,
  },
  manualBtn: {
    alignSelf: "center",
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
    justifyContent: "center",
  },
  manualText: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textAlign: "center",
  },
});
