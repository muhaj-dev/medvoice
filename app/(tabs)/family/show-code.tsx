import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { DeviceQRCode } from '@/components/DeviceQRCode';
import { WaitingForScanStatus } from '@/components/WaitingForScanStatus';
import { ConnectMemberModal } from '@/components/ConnectMemberModal';
import { getOrCreatePublicKey, onPeerConnected } from '@/lib/p2p';
import { useFamilyStore } from '@/store/useFamilyStore';
import type { FamilyMember } from '@/types/family';

export default function ShowCodeScreen() {
  const { addMember } = useFamilyStore();
  const [publicKey, setPublicKey] = useState('');
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingPeerKey, setPendingPeerKey] = useState('');

  useEffect(() => {
    getOrCreatePublicKey().then(setPublicKey);
  }, []);

  useEffect(() => {
    const cleanup = onPeerConnected((peerKey) => {
      setPendingPeerKey(peerKey);
      setConnected(true);
      setTimeout(() => setShowModal(true), 1500);
    });
    return cleanup;
  }, []);

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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ alignSelf: 'flex-start', marginBottom: 32, paddingVertical: 8 }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 24 }}
        >
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              color: colors.textSecondary,
              letterSpacing: 1,
            }}
          >
            ← BACK
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', gap: 28 }}>
          <View style={{ alignItems: 'center', gap: 12 }}>
            <Text
              style={{
                fontFamily: 'Georgia',
                fontSize: 26,
                fontWeight: '700',
                color: colors.textPrimary,
                textAlign: 'center',
              }}
            >
              Your Device Code
            </Text>
            <Text
              style={{
                fontFamily: 'Georgia',
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: 'center',
                maxWidth: 260,
                lineHeight: 22,
              }}
            >
              Ask your family member to scan this code with their MedVoice app
            </Text>
          </View>

          <DeviceQRCode publicKey={publicKey} />
          <WaitingForScanStatus connected={connected} />
        </View>
      </ScrollView>

      <ConnectMemberModal
        visible={showModal}
        onConfirm={handleConfirm}
        onDismiss={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
}
