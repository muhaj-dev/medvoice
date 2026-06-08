import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { CornerBrackets } from '@/components/CornerBrackets';
import { CameraView, cameraAvailable } from '@/lib/cameraModule';

type Props = {
  onCodeDetected: (data: string) => void;
  paused: boolean;
  showSuccess: boolean;
};

export function QRScannerViewfinder({ onCodeDetected, paused, showSuccess }: Props) {
  return (
    <View style={styles.frame}>
      {cameraAvailable && !paused && (
        <CameraView
          style={StyleSheet.absoluteFill}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={({ data }: { data: string }) => onCodeDetected(data)}
        />
      )}

      {!showSuccess && (
        <Text style={styles.placeholder}>Camera preview</Text>
      )}

      {showSuccess && (
        <View style={styles.successOverlay}>
          <Text style={styles.successText}>Code detected!</Text>
        </View>
      )}

      <CornerBrackets />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 300,
    height: 220,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontFamily: 'Georgia',
    fontSize: 13,
    color: colors.textMuted,
    position: 'absolute',
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(52,211,153,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    fontFamily: 'Georgia',
    fontSize: 16,
    fontWeight: '600',
    color: colors.successGreen,
  },
});
