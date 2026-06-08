import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { QRScannerViewfinder } from '@/components/QRScannerViewfinder';
import { ScanConnectModal } from '@/components/ScanConnectModal';
import { connectFamilyMember } from '@/lib/p2p';
import { useFamilyStore } from '@/store/useFamilyStore';
import type { FamilyMember } from '@/types/family';

export default function ScanCodeScreen() {
  const { addMember } = useFamilyStore();
  const [paused, setPaused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingKey, setPendingKey] = useState('');

  const handleCodeDetected = useCallback(
    (data: string) => {
      if (paused) return;
      setPaused(true);
      setPendingKey(data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowModal(true);
      }, 500);
    },
    [paused]
  );

  const handleConfirm = useCallback(
    async (name: string, relationship: string) => {
      const member: FamilyMember = {
        id: Date.now().toString(),
        name,
        relationship,
        publicKey: pendingKey,
        connectionStatus: 'pending',
        lastSynced: null,
      };
      await connectFamilyMember(pendingKey);
      await addMember(member);
      setShowModal(false);
      router.back();
    },
    [addMember, pendingKey]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 24 }}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Scan Family Member's Code</Text>
          <Text style={styles.subtitle}>Point your camera at their QR code</Text>
        </View>

        <View style={styles.viewfinderWrap}>
          <QRScannerViewfinder
            onCodeDetected={handleCodeDetected}
            paused={paused}
            showSuccess={showSuccess}
          />
        </View>

        <Text style={styles.hint}>
          The code will be detected automatically.{'\n'}No need to tap anything.
        </Text>
      </ScrollView>

      <ScanConnectModal
        visible={showModal}
        onConfirm={handleConfirm}
        onDismiss={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  backBtn: { alignSelf: 'flex-start', marginBottom: 32, paddingVertical: 8 },
  backText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  header: { alignItems: 'center', gap: 12, marginBottom: 32 },
  title: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Georgia',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  viewfinderWrap: { alignItems: 'center', marginBottom: 28 },
  hint: {
    fontFamily: 'Georgia',
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
