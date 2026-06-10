import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, type Href } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { useRecordingStore } from "@/store/useRecordingStore";
import { useVoiceTranscription } from "@/hooks/useVoiceTranscription";
import { WaveformAnimation } from "@/components/WaveformAnimation";
import { LiveTranscriptCard } from "@/components/LiveTranscriptCard";
import { StopRecordingButton } from "@/components/StopRecordingButton";

export default function RecordingActiveScreen() {
  const colors = useTheme();
  const { setIsRecording, setFinalTranscript, resetRecording } = useRecordingStore();
  const { transcript, start, stop } = useVoiceTranscription();

  useEffect(() => {
    setIsRecording(true);
    start();
    // Stop transcription if the screen unmounts without an explicit stop.
    return () => {
      stop().catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStop = async () => {
    const text = await stop();
    setIsRecording(false);
    setFinalTranscript(text);
    router.replace("/analysis/processing" as Href);
  };

  const handleBack = async () => {
    await stop();
    setIsRecording(false);
    resetRecording();
    router.replace("/(tabs)" as Href);
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
          <WaveformAnimation isActive={true} />
        </View>

        <LiveTranscriptCard transcript={transcript} />
      </View>

      <View style={styles.stopArea}>
        <StopRecordingButton onPress={handleStop} />
      </View>
    </SafeAreaView>
  );
}
