import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAudioRecorder, AudioModule, RecordingPresets } from "expo-audio";
import { useTheme } from "@/hooks/useTheme";
import { useRecordingStore } from "@/store/useRecordingStore";
import { WaveformAnimation } from "@/components/WaveformAnimation";
import { LiveTranscriptCard } from "@/components/LiveTranscriptCard";
import { StopRecordingButton } from "@/components/StopRecordingButton";

// Demo words simulate word-by-word transcript while real audio records
const DEMO_WORDS = [
  "I've", "been", "having", "some", "knee", "pain", "today,",
  "especially", "when", "going", "up", "stairs.", "My", "blood",
  "glucose", "was", "a", "bit", "elevated", "this", "morning.",
];

export default function RecordingActiveScreen() {
  const colors = useTheme();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const { transcript, appendTranscript, setIsRecording, setAudioUri, setFinalTranscript, resetRecording } =
    useRecordingStore();
  const [waveActive, setWaveActive] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordIdxRef = useRef(0);

  const scheduleNextWord = () => {
    timerRef.current = setTimeout(() => {
      if (wordIdxRef.current < DEMO_WORDS.length) {
        appendTranscript(DEMO_WORDS[wordIdxRef.current]);
        wordIdxRef.current += 1;
        scheduleNextWord();
      }
    }, 420);
  };

  const startRecording = async () => {
    try {
      await AudioModule.setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch {}
    setIsRecording(true);
    scheduleNextWord();
  };

  useEffect(() => {
    startRecording();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStop = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setWaveActive(false);
    try { await audioRecorder.stop(); } catch {}
    const uri = audioRecorder.uri ?? null;
    setIsRecording(false);
    if (uri) setAudioUri(uri);
    setFinalTranscript(transcript);
    router.replace("/analysis/processing" as any);
  };

  const handleBack = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try { await audioRecorder.stop(); } catch {}
    resetRecording();
    router.replace("/(tabs)" as any);
  };

  const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bgPrimary },
    backBtn: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 4,
      alignSelf: "flex-start",
    },
    backText: {
      fontFamily: "monospace",
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    listeningLabel: {
      fontFamily: "monospace",
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 1.54,
      textAlign: "center",
      marginBottom: 32,
    },
    waveformWrap: {
      alignItems: "center",
      marginBottom: 32,
    },
    stopArea: {
      alignItems: "center",
      paddingBottom: 52,
    },
  });

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={handleBack}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.backText}>← BACK</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.listeningLabel}>LISTENING • ON DEVICE</Text>

        <View style={styles.waveformWrap}>
          <WaveformAnimation isActive={waveActive} />
        </View>

        <LiveTranscriptCard transcript={transcript} />
      </View>

      <View style={styles.stopArea}>
        <StopRecordingButton onPress={handleStop} />
      </View>
    </SafeAreaView>
  );
}
