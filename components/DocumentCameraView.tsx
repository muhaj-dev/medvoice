import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { CornerBrackets } from "@/components/CornerBrackets";
import { CameraView, cameraAvailable } from "@/lib/cameraModule";

type Props = {
  hasPermission: boolean;
  onCaptured: (uri: string) => void;
};

/**
 * Framed document viewfinder with a shutter button. Owns the camera ref and the
 * takePictureAsync call so the screen stays a thin composition layer. The photo
 * stays on-device; its URI is handed back via onCaptured for on-device OCR.
 */
export function DocumentCameraView({ hasPermission, onCaptured }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
  const cameraRef = useRef<any>(null);
  const [busy, setBusy] = useState(false);
  const showCamera = cameraAvailable && hasPermission;

  const capture = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo?.uri) onCaptured(photo.uri);
      else setBusy(false);
    } catch {
      setBusy(false);
    }
  };

  const styles = StyleSheet.create({
    frame: {
      width: 300,
      height: 380,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      backgroundColor: colors.bgCard,
      alignItems: "center",
      justifyContent: "center",
    },
    placeholder: {
      fontFamily: "Georgia",
      fontSize: 13,
      color: colors.textMuted,
      position: "absolute",
      textAlign: "center",
      paddingHorizontal: 24,
    },
    shutter: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.accentBlue,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 28,
    },
    shutterDisabled: { opacity: 0.5 },
  });

  return (
    <View style={{ alignItems: "center" }}>
      <View style={styles.frame}>
        {showCamera && (
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
        )}

        {!showCamera && (
          <Text style={styles.placeholder}>
            {!cameraAvailable ? t("scan.cameraNotAvailable") : t("scan.waitingForCamera")}
          </Text>
        )}

        <CornerBrackets />
      </View>

      <TouchableOpacity
        style={[styles.shutter, (!showCamera || busy) && styles.shutterDisabled]}
        onPress={capture}
        disabled={!showCamera || busy}
        activeOpacity={0.85}
      >
        {busy ? (
          <ActivityIndicator color={colors.textPrimary} />
        ) : (
          <Ionicons name="camera" size={30} color={colors.textPrimary} />
        )}
      </TouchableOpacity>
    </View>
  );
}
