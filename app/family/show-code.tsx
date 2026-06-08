import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/hooks/useTheme";
import { ShowCodeContent } from "@/components/ShowCodeContent";
import { ConnectMemberModal } from "@/components/ConnectMemberModal";
import { getOrCreatePublicKey, onPeerConnected } from "@/lib/p2p";
import { useFamilyStore } from "@/store/useFamilyStore";
import type { FamilyMember } from "@/types/family";

export default function ShowCodeScreen() {
  const colors = useTheme();
  const { addMember } = useFamilyStore();

  const [publicKey, setPublicKey] = useState("");
  const [keyError, setKeyError] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingPeerKey, setPendingPeerKey] = useState("");
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

  const handleRetry = useCallback(() => {
    setKeyError(false);
    getOrCreatePublicKey().then(setPublicKey).catch(() => setKeyError(true));
  }, []);

  const handleConfirm = useCallback(
    async (name: string, relationship: string) => {
      const member: FamilyMember = {
        id: Date.now().toString(),
        name,
        relationship,
        publicKey: pendingPeerKey,
        connectionStatus: "online",
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 24 }}
        >
          <Text style={[styles.backText, { color: colors.textSecondary }]}>
            ← BACK
          </Text>
        </TouchableOpacity>

        <ShowCodeContent
          publicKey={publicKey}
          keyError={keyError}
          connected={connected}
          copied={copied}
          onCopy={handleCopy}
          onRetry={handleRetry}
        />
      </View>

      <ConnectMemberModal
        visible={showModal}
        onConfirm={handleConfirm}
        onDismiss={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 8,
  },
  backText: {
    fontFamily: "monospace",
    fontSize: 12,
    letterSpacing: 1,
  },
});
