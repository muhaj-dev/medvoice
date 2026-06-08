import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { DeviceQRCode } from "@/components/DeviceQRCode";
import { WaitingForScanStatus } from "@/components/WaitingForScanStatus";

type Props = {
  publicKey: string;
  keyError: boolean;
  connected: boolean;
  copied: boolean;
  onCopy: () => void;
  onRetry: () => void;
};

export const ShowCodeContent = ({
  publicKey,
  keyError,
  connected,
  copied,
  onCopy,
  onRetry,
}: Props) => {
  const colors = useTheme();

  return (
    <View style={styles.body}>
      <View style={styles.titleBlock}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Your Device Code
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Ask your family member to scan this code with their MedVoice app
        </Text>
      </View>

      {keyError ? (
        <View
          style={[
            styles.stateBox,
            { backgroundColor: colors.bgCard, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.errorText, { color: colors.warningRed }]}>
            Could not generate device code.
          </Text>
          <TouchableOpacity
            onPress={onRetry}
            style={[styles.pill, { borderColor: colors.accentBlue }]}
          >
            <Text style={[styles.pillText, { color: colors.accentBlue }]}>
              RETRY
            </Text>
          </TouchableOpacity>
        </View>
      ) : publicKey ? (
        <View style={styles.qrBlock}>
          <DeviceQRCode publicKey={publicKey} />
          <TouchableOpacity
            onPress={onCopy}
            style={[
              styles.pill,
              { borderColor: copied ? colors.success : colors.accentBlue },
            ]}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.pillText,
                { color: copied ? colors.success : colors.accentBlue },
              ]}
            >
              {copied ? "✓  COPIED" : "COPY CODE"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={[
            styles.stateBox,
            { backgroundColor: colors.bgCard, borderColor: colors.border },
          ]}
        >
          <ActivityIndicator color={colors.accentBlue} size="large" />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Generating code…
          </Text>
        </View>
      )}

      <WaitingForScanStatus connected={connected} />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  titleBlock: {
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontFamily: "Georgia",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Georgia",
    fontSize: 14,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 22,
  },
  qrBlock: {
    alignItems: "center",
    gap: 16,
  },
  stateBox: {
    alignItems: "center",
    gap: 16,
    width: 240,
    height: 240,
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
  },
  errorText: {
    fontFamily: "Georgia",
    fontSize: 14,
    textAlign: "center",
  },
  loadingText: {
    fontFamily: "Georgia",
    fontSize: 13,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 10,
    paddingHorizontal: 28,
    minWidth: 160,
    alignItems: "center",
  },
  pillText: {
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
  },
});
