import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useModelStore, ModelStatus } from '@/store/useModelStore';
import { useSettingsStore } from '@/store/useSettingsStore';

function statusIcon(status: ModelStatus): string {
  if (status === 'ready')   return '✓';
  if (status === 'loading') return '↓';
  if (status === 'error')   return '✕';
  return '○';
}

type Props = { visible: boolean; onClose: () => void };

export function ModelLoadingModal({ visible, onClose }: Props) {
  const colors = useTheme();
  const { parakeet, medgemma, embedding, tts, allReady } = useModelStore();
  const states = { parakeet, medgemma, embedding, tts };
  const modelSize = useSettingsStore((s) => s.modelSize);

  // All four model files download at boot (downloading is cheap on memory; they
  // load into RAM one at a time on demand). Health-analysis size depends on the
  // selected model (Settings → AI Model).
  const MODELS: { key: keyof typeof states; label: string; size: string }[] = [
    { key: 'parakeet',  label: 'Voice Recognition', size: '750 MB' },
    { key: 'medgemma',  label: 'Health Analysis',   size: modelSize === '4b' ? '2.5 GB' : '1.1 GB' },
    { key: 'embedding', label: 'Semantic Search',   size: '330 MB' },
    { key: 'tts',       label: 'Text-to-Speech',    size: '132 MB' },
  ];

  const totalProgress =
    MODELS.reduce((sum, m) => {
      const s = states[m.key];
      return sum + (s.status === 'ready' ? 100 : s.progress);
    }, 0) / MODELS.length;

  const ready = allReady();

  const s = StyleSheet.create({
    backdrop:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    sheet:      { backgroundColor: colors.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24,
                  borderWidth: 1, borderColor: colors.border, paddingBottom: 36 },
    handle:     { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border,
                  alignSelf: 'center', marginTop: 10, marginBottom: 20 },
    header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingHorizontal: 20, marginBottom: 20 },
    title:      { fontFamily: 'monospace', fontSize: 12, letterSpacing: 1.2, color: colors.textSecondary },
    closeBtn:   { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bgDeep,
                  borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    body:       { paddingHorizontal: 20 },
    trackBg:    { height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 4, overflow: 'hidden' },
    trackFill:  { height: 4, borderRadius: 2, backgroundColor: ready ? colors.successGreen : colors.accentBlue },
    pctRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    pctLabel:   { fontFamily: 'monospace', fontSize: 10, color: colors.textMuted, letterSpacing: 0.8 },
    pctValue:   { fontFamily: 'monospace', fontSize: 10, color: ready ? colors.successGreen : colors.accentBlue, letterSpacing: 0.8 },
    divider:    { height: 1, backgroundColor: colors.border, marginBottom: 16 },
    row:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
    iconBox:    { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.bgDeep,
                  borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    iconText:   { fontFamily: 'monospace', fontSize: 13 },
    rowInfo:    { flex: 1 },
    rowLabel:   { fontFamily: 'Georgia', fontSize: 14 },
    rowMeta:    { fontFamily: 'monospace', fontSize: 10, marginTop: 1 },
    progressRow:{ height: 3, borderRadius: 2, backgroundColor: colors.border, marginTop: 5, overflow: 'hidden' },
    progressFill:{ height: 3, borderRadius: 2, backgroundColor: colors.accentBlue },
    note:       { fontFamily: 'monospace', fontSize: 10, color: colors.textMuted, textAlign: 'center',
                  letterSpacing: 0.5, marginTop: 20 },
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={s.sheet}>
            <View style={s.handle} />

            <View style={s.header}>
              <Text style={s.title}>AI MODELS</Text>
              <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
                <Ionicons name="close" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={s.body}>
              {/* Overall progress bar */}
              <View style={s.trackBg}>
                <View style={[s.trackFill, { width: `${totalProgress}%` }]} />
              </View>
              <View style={s.pctRow}>
                <Text style={s.pctLabel}>{ready ? 'ALL MODELS READY' : 'DOWNLOADING'}</Text>
                <Text style={s.pctValue}>{Math.round(totalProgress)}%</Text>
              </View>

              <View style={s.divider} />

              {/* Per-model rows */}
              {MODELS.map(({ key, label, size }) => {
                const state = states[key];
                const isReady   = state.status === 'ready';
                const isLoading = state.status === 'loading';
                const isError   = state.status === 'error';
                const color = isReady ? colors.successGreen
                            : isError ? colors.warningRed
                            : isLoading ? colors.accentBlue
                            : colors.textMuted;

                return (
                  <View key={key} style={s.row}>
                    <View style={[s.iconBox, { borderColor: color }]}>
                      <Text style={[s.iconText, { color }]}>{statusIcon(state.status)}</Text>
                    </View>
                    <View style={s.rowInfo}>
                      <Text style={[s.rowLabel, { color }]}>{label}</Text>
                      <Text style={[s.rowMeta, { color: colors.textMuted }]}>
                        {isLoading ? `${state.progress}% of ${size}` : size}
                      </Text>
                      {isLoading && (
                        <View style={s.progressRow}>
                          <View style={[s.progressFill, { width: `${state.progress}%` }]} />
                        </View>
                      )}
                    </View>
                    <Text style={[s.rowMeta, { color }]}>
                      {isLoading ? `${state.progress}%` : isReady ? 'READY' : isError ? 'ERROR' : 'IDLE'}
                    </Text>
                  </View>
                );
              })}

              <Text style={s.note}>Downloads once · Always on-device · No cloud</Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
