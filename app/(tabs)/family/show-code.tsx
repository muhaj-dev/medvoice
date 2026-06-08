import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '@/hooks/useTheme';
import { DeviceQRCode } from '@/components/DeviceQRCode';
import { WaitingForScanStatus } from '@/components/WaitingForScanStatus';
import { ConnectMemberModal } from '@/components/ConnectMemberModal';
import { getOrCreatePublicKey, onPeerConnected } from '@/lib/p2p';
import { useFamilyStore } from '@/store/useFamilyStore';
import type { FamilyMember } from '@/types/family';

export default function ShowCodeScreen() {
  const colors = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
    },
    backBtn: {
      alignSelf: 'flex-start',
      paddingVertical: 8,
      marginBottom: 8,
    },
    backText: {
      fontFamily: 'monospace',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 1,
    },
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
    },
    titleBlock: {
      alignItems: 'center',
      gap: 12,
    },
    title: {
      fontFamily: 'Georgia',
      fontSize: 26,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: 'Georgia',
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 260,
      lineHeight: 22,
    },
    qrBlock: {
      alignItems: 'center',
      gap: 16,
    },
    copyBtn: {
      borderWidth: 1,
      borderColor: colors.accentBlue,
      borderRadius: 99,
      paddingVertical: 10,
      paddingHorizontal: 28,
      minWidth: 160,
      alignItems: 'center',
    },
    copyBtnDone: {
      borderColor: colors.successGreen,
    },
    copyText: {
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1.2,
      color: colors.accentBlue,
    },
    copyTextDone: {
      color: colors.successGreen,
    },
    loadingBox: {
      alignItems: 'center',
      gap: 16,
      width: 240,
      height: 240,
      justifyContent: 'center',
      backgroundColor: colors.bgCard,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    loadingText: {
      fontFamily: 'Georgia',
      fontSize: 13,
      color: colors.textSecondary,
    },
    errorBox: {
      alignItems: 'center',
      gap: 16,
      width: 240,
      height: 240,
      justifyContent: 'center',
      backgroundColor: colors.bgCard,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    errorText: {
      fontFamily: 'Georgia',
      fontSize: 14,
      color: colors.warningRed,
      textAlign: 'center',
    },
    retryBtn: {
      borderWidth: 1,
      borderColor: colors.accentBlue,
      borderRadius: 99,
      paddingVertical: 8,
      paddingHorizontal: 20,
    },
    retryText: {
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1.2,
      color: colors.accentBlue,
    },
  });

  const { addMember } = useFamilyStore();
  const [publicKey, setPublicKey] = useState('');
  const [keyError, setKeyError] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingPeerKey, setPendingPeerKey] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getOrCreatePublicKey()
      .then(setPublicKey)
      .catch(() => setKeyError(true));
  }, []);

  useEffect(() => {
    const cleanup = onPeerConnected((peerKey) => {
      setPendingPeerKey(peerKey);
      setConnected(true);
      setTimeout(() => setShowModal(true), 1500);
    });
    return cleanup;
  }, []);

  const handleCopy = useCallback(async () => {
    if (!publicKey) return;
    await Clipboard.setStringAsync(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [publicKey]);

  const handleConfirm = useCallback(
    async (name: string, relationship: string) => {
      const member: FamilyMember = {
        id: Date.now().toString(),
        name,
        relationship,
        publicKey: pendingPeerKey,
        connectionStatus: 'online',
        lastSynced: new Date().toISOString(),
      };
      await addMember(member);
      setShowModal(false);
      router.back();
    },
    [addMember, pendingPeerKey]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <View style={styles.container}>
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 24 }}
        >
          <Text style={styles.backText}>← BACK</Text>
        </TouchableOpacity>

        {/* Centered content */}
        <View style={styles.body}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Your Device Code</Text>
            <Text style={styles.subtitle}>
              Ask your family member to scan this code with their MedVoice app
            </Text>
          </View>

          {keyError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>Could not generate device code.</Text>
              <TouchableOpacity
                onPress={() => {
                  setKeyError(false);
                  getOrCreatePublicKey().then(setPublicKey).catch(() => setKeyError(true));
                }}
                style={styles.retryBtn}
              >
                <Text style={styles.retryText}>RETRY</Text>
              </TouchableOpacity>
            </View>
          ) : publicKey ? (
            <View style={styles.qrBlock}>
              <DeviceQRCode publicKey={publicKey} />
              <TouchableOpacity
                onPress={handleCopy}
                style={[styles.copyBtn, copied && styles.copyBtnDone]}
                activeOpacity={0.75}
              >
                <Text style={[styles.copyText, copied && styles.copyTextDone]}>
                  {copied ? '✓  COPIED' : 'COPY CODE'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.accentBlue} size="large" />
              <Text style={styles.loadingText}>Generating code…</Text>
            </View>
          )}

          <WaitingForScanStatus connected={connected} />
        </View>
      </View>

      <ConnectMemberModal
        visible={showModal}
        onConfirm={handleConfirm}
        onDismiss={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
}

