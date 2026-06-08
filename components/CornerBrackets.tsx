import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

// Blue L-shaped brackets at each corner of the QR viewfinder frame
export function CornerBrackets() {
  return (
    <>
      <View style={[styles.bar, styles.tlH]} />
      <View style={[styles.bar, styles.tlV]} />
      <View style={[styles.bar, styles.trH]} />
      <View style={[styles.bar, styles.trV]} />
      <View style={[styles.bar, styles.blH]} />
      <View style={[styles.bar, styles.blV]} />
      <View style={[styles.bar, styles.brH]} />
      <View style={[styles.bar, styles.brV]} />
    </>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', backgroundColor: colors.accentBlue },
  // Top-left
  tlH: { top: 0, left: 0, width: 25, height: 3 },
  tlV: { top: 0, left: 0, width: 3, height: 25 },
  // Top-right
  trH: { top: 0, right: 0, width: 25, height: 3 },
  trV: { top: 0, right: 0, width: 3, height: 25 },
  // Bottom-left
  blH: { bottom: 0, left: 0, width: 25, height: 3 },
  blV: { bottom: 0, left: 0, width: 3, height: 25 },
  // Bottom-right
  brH: { bottom: 0, right: 0, width: 25, height: 3 },
  brV: { bottom: 0, right: 0, width: 3, height: 25 },
});
