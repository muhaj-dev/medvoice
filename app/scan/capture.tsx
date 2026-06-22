import { useCallback, useEffect } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { ScanCaptureBody } from "@/components/ScanCaptureBody";
import { CameraPermissionError } from "@/components/CameraPermissionError";
import { useScanStore } from "@/store/useScanStore";

export default function ScanCaptureScreen() {
  const colors = useTheme();
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const setImageUri = useScanStore((s) => s.setImageUri);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handleCaptured = useCallback(
    (uri: string) => {
      // Start a fresh scan, store the photo, then run the OCR + analysis pipeline.
      useScanStore.getState().resetScan();
      setImageUri(uri);
      router.replace("/scan/processing" as any);
    },
    [setImageUri]
  );

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: "Georgia", fontSize: 14, color: colors.textSecondary }}>
            {t("scan.requestingCameraAccess")}
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
      <ScanCaptureBody
        hasPermission={permission.granted}
        onBack={() => router.back()}
        onCaptured={handleCaptured}
      />
    </SafeAreaView>
  );
}
