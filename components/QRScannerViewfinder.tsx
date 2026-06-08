import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CornerBrackets } from '@/components/CornerBrackets';
import { CameraView, cameraAvailable } from '@/lib/cameraModule';

type Props = {
  onCodeDetected: (data: string) => void;
  hasPermission: boolean;
  paused: boolean;
  showSuccess: boolean;
};

export function QRScannerViewfinder({ onCodeDetected, hasPermission, paused, showSuccess }: Props) {
  const colors = useTheme();
  const showCamera = cameraAvailable && hasPermission && !paused;

  const styles = StyleSheet.create({
    frame: {
      width: 300,
      height: 300,
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
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
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

  return (
    <View style={styles.frame}>
      {showCamera && (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={({ data }: { data: string }) => onCodeDetected(data)}
        />
      )}

      {!showCamera && !showSuccess && (
        <Text style={styles.placeholder}>
          {!cameraAvailable ? 'Camera not available' : 'Waiting for camera…'}
        </Text>
      )}

      {showSuccess && (
        <View style={styles.successOverlay}>
          <Text style={styles.successText}>✓  Code detected!</Text>
        </View>
      )}

      <CornerBrackets />
    </View>
  );
}
