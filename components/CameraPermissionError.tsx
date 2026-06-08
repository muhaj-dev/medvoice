import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

type Props = {
  onBack: () => void;
  onRequestPermission: () => void;
};

export function CameraPermissionError({ onBack, onRequestPermission }: Props) {
  return (
    <View style={styles.wrap}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 24 }}
      >
        <Text style={styles.backText}>← BACK</Text>
      </TouchableOpacity>
      <View style={styles.body}>
        <Text style={styles.title}>Camera access required</Text>
        <Text style={styles.subtitle}>
          Enable camera access in Settings to scan QR codes.
        </Text>
        <TouchableOpacity onPress={onRequestPermission} style={styles.btn}>
          <Text style={styles.btnText}>ENABLE CAMERA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 32, paddingVertical: 8 },
  backText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  btn: {
    backgroundColor: colors.accentBlue,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  btnText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: '#ffffff',
  },
});
