/**
 * Full-screen launch gate. Blocks the app only until the CORE models (voice +
 * analysis) are downloaded — search and read-aloud finish in the background.
 * If a core download fails but voice is ready, the user can continue in a
 * degraded voice-journal mode instead of being locked out. Warns up front when
 * the phone doesn't have enough free storage for the download.
 */
import { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useModelStore } from "@/store/useModelStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { retryModelDownloads } from "@/lib/qvac";
import { getFreeDiskGB } from "@/lib/device";
import { ModelDownloadRow } from "@/components/ModelDownloadRow";

export function ModelDownloadGate() {
  const colors = useTheme();
  const { parakeet, medgemma, embedding, tts, coreReady } = useModelStore();
  const modelSize = useSettingsStore((s) => s.modelSize);

  const [dismissed, setDismissed] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [checkScale] = useState(() => new Animated.Value(0));
  const [freeGB] = useState(() => getFreeDiskGB());

  // Only the core models gate the app. Background model errors never block.
  const ready = coreReady();
  const core = [parakeet, medgemma];
  const hasError = core.some((m) => m.status === "error");
  const downloading = core.some((m) => m.status === "loading");
  const canContinueDegraded =
    hasError && !downloading && parakeet.status === "ready";

  const requiredGB = modelSize === "4b" ? 3.8 : 2.4;
  const lowDisk = !ready && freeGB !== null && freeGB < requiredGB;

  const coreProgress =
    core.reduce((sum, m) => sum + (m.status === "ready" ? 100 : m.progress), 0) /
    core.length;

  useEffect(() => {
    if (ready) {
      Animated.spring(checkScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
    }
  }, [ready, checkScale]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await retryModelDownloads();
    } finally {
      setRetrying(false);
    }
  };

  // Once the user enters the app, never show the gate again this session.
  if (dismissed) return null;

  const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bgPrimary, paddingHorizontal: 28, justifyContent: "center" },
    iconWrap: { alignItems: "center", marginBottom: 24 },
    check: {
      width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center",
      backgroundColor: "rgba(52,211,153,0.12)", borderWidth: 1, borderColor: colors.successGreen,
    },
    spinnerBox: {
      width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center",
      backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    },
    title: { fontFamily: "Georgia", fontSize: 24, fontWeight: "700", color: colors.textPrimary, textAlign: "center", marginBottom: 6 },
    subtitle: { fontFamily: "Georgia", fontSize: 14, color: colors.textSecondary, textAlign: "center", marginBottom: 16, lineHeight: 22 },
    diskWarn: { fontFamily: "monospace", fontSize: 10, color: colors.warningAmber, textAlign: "center", letterSpacing: 0.5, marginBottom: 16, lineHeight: 16 },
    trackBg: { height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 6, overflow: "hidden" },
    trackFill: { height: 5, borderRadius: 3, backgroundColor: ready ? colors.successGreen : colors.accentBlue },
    pctRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
    pctLabel: { fontFamily: "monospace", fontSize: 10, color: colors.textMuted, letterSpacing: 0.8 },
    pctValue: { fontFamily: "monospace", fontSize: 10, color: ready ? colors.successGreen : colors.accentBlue, letterSpacing: 0.8 },
    btn: { borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 28 },
    btnText: { fontFamily: "monospace", fontSize: 13, fontWeight: "600", letterSpacing: 1.2, color: "#ffffff" },
    note: { fontFamily: "monospace", fontSize: 10, color: colors.textMuted, textAlign: "center", letterSpacing: 0.5, marginTop: 18 },
  });

  return (
    <Modal visible transparent={false} animationType="fade" onRequestClose={() => {}}>
      <View style={s.root}>
        <View style={s.iconWrap}>
          {ready ? (
            <Animated.View style={[s.check, { transform: [{ scale: checkScale }] }]}>
              <Ionicons name="checkmark" size={40} color={colors.successGreen} />
            </Animated.View>
          ) : (
            <View style={s.spinnerBox}>
              <Ionicons name="heart" size={32} color={colors.accentBlue} />
            </View>
          )}
        </View>

        <Text style={s.title}>{ready ? "You're all set" : "Preparing MedVoice"}</Text>
        <Text style={s.subtitle}>
          {ready
            ? "Voice and analysis are ready. Search and read-aloud finish downloading in the background."
            : "Downloading your private on-device AI. This happens once — Wi-Fi recommended."}
        </Text>
        {lowDisk && freeGB !== null && (
          <Text style={s.diskWarn}>
            LOW STORAGE: {freeGB.toFixed(1)} GB FREE, ~{requiredGB} GB NEEDED.{"\n"}
            FREE UP SPACE IF A DOWNLOAD FAILS.
          </Text>
        )}

        <View style={s.trackBg}>
          <View style={[s.trackFill, { width: `${coreProgress}%` }]} />
        </View>
        <View style={s.pctRow}>
          <Text style={s.pctLabel}>{ready ? "CORE MODELS READY" : "DOWNLOADING"}</Text>
          <Text style={s.pctValue}>{Math.round(coreProgress)}%</Text>
        </View>

        <ModelDownloadRow label="Voice Recognition" size="750 MB" state={parakeet} />
        <ModelDownloadRow label="Health Analysis" size={modelSize === "4b" ? "2.5 GB" : "1.1 GB"} state={medgemma} />
        <ModelDownloadRow label="Semantic Search" size="330 MB" state={embedding} background />
        <ModelDownloadRow label="Text-to-Speech" size="132 MB" state={tts} background />

        {ready ? (
          <TouchableOpacity style={[s.btn, { backgroundColor: colors.successGreen }]} activeOpacity={0.85} onPress={() => setDismissed(true)}>
            <Text style={s.btnText}>CONTINUE →</Text>
          </TouchableOpacity>
        ) : hasError ? (
          <>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: colors.accentBlue, opacity: retrying ? 0.5 : 1 }]}
              activeOpacity={0.85}
              disabled={retrying}
              onPress={handleRetry}
            >
              <Text style={s.btnText}>{retrying ? "RETRYING…" : "RETRY DOWNLOAD"}</Text>
            </TouchableOpacity>
            {canContinueDegraded && !retrying && (
              <TouchableOpacity
                style={[s.btn, { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border, marginTop: 10 }]}
                activeOpacity={0.85}
                onPress={() => setDismissed(true)}
              >
                <Text style={[s.btnText, { color: colors.textSecondary }]}>CONTINUE WITHOUT AI →</Text>
              </TouchableOpacity>
            )}
          </>
        ) : null}

        <Text style={s.note}>
          {canContinueDegraded
            ? "Voice journaling will work · AI analysis stays off until downloaded"
            : "Downloads once · Always on-device · No cloud"}
        </Text>
      </View>
    </Modal>
  );
}
