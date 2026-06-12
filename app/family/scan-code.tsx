import { useState, useCallback, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { useTheme } from "@/hooks/useTheme";
import { ScanCodeBody } from "@/components/ScanCodeBody";
import { ScanConnectModal } from "@/components/ScanConnectModal";
import { ManualCodeModal } from "@/components/ManualCodeModal";
import { CameraPermissionError } from "@/components/CameraPermissionError";
import { connectFamilyMember } from "@/lib/p2p";
import { useFamilyStore } from "@/store/useFamilyStore";
import type { FamilyMember } from "@/types/family";

export default function ScanCodeScreen() {
  const colors = useTheme();
  const { addMember, updateMemberStatus } = useFamilyStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [paused, setPaused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [pendingKey, setPendingKey] = useState("");

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handleCodeDetected = useCallback(
    (data: string) => {
      if (paused) return;
      setPaused(true);
      setPendingKey(data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowModal(true);
      }, 600);
    },
    [paused]
  );

  const handleManualSubmit = useCallback((code: string) => {
    setPendingKey(code);
    setShowManual(false);
    setShowModal(true);
  }, []);

  const handleConfirm = useCallback(
    async (name: string, relationship: string) => {
      const member: FamilyMember = {
        id: Date.now().toString(),
        name,
        relationship,
        publicKey: pendingKey,
        connectionStatus: "pending",
        lastSynced: null,
        // The scanner is the viewer. Only the device whose code was scanned
        // gets the "share your data?" consent prompt; sharing from this
        // device can still be enabled later from the member's card.
        shareEnabled: false,
      };
      await addMember(member);
      setShowModal(false);
      router.back();
      // Attempt P2P handshake non-blocking; update status when resolved
      connectFamilyMember(pendingKey)
        .then(() => updateMemberStatus(member.id, "online"))
        .catch(() => updateMemberStatus(member.id, "offline"));
    },
    [addMember, updateMemberStatus, pendingKey]
  );

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: "Georgia", fontSize: 14, color: colors.textSecondary }}>
            Requesting camera access…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
        <CameraPermissionError
          onBack={() => router.back()}
          onRequestPermission={requestPermission}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <ScanCodeBody
        hasPermission={permission.granted}
        paused={paused}
        showSuccess={showSuccess}
        onBack={() => router.back()}
        onCodeDetected={handleCodeDetected}
        onEnterManually={() => setShowManual(true)}
      />

      <ManualCodeModal
        visible={showManual}
        onSubmit={handleManualSubmit}
        onDismiss={() => setShowManual(false)}
      />

      <ScanConnectModal
        visible={showModal}
        onConfirm={handleConfirm}
        onDismiss={() => {
          setShowModal(false);
          setPaused(false);
        }}
      />
    </SafeAreaView>
  );
}
