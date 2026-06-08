import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useModelStore, ModelName, ModelStatus } from '@/store/useModelStore';

const MODELS: { key: ModelName; label: string; size: string }[] = [
  { key: 'parakeet', label: 'Voice Recognition', size: '750 MB' },
  { key: 'medgemma', label: 'Health Analysis', size: '2.5 GB' },
  { key: 'embedding', label: 'Semantic Search', size: '330 MB' },
  { key: 'tts', label: 'Text-to-Speech', size: '132 MB' },
];

function statusIcon(status: ModelStatus): string {
  if (status === 'ready') return '✓';
  if (status === 'loading') return '↓';
  if (status === 'error') return '✕';
  return '○';
}

export function ModelLoadingCard() {
  const colors = useTheme();
  const { parakeet, medgemma, embedding, tts, allReady } = useModelStore();
  const states = { parakeet, medgemma, embedding, tts };

  if (allReady()) return null;

  const totalProgress =
    MODELS.reduce((sum, m) => {
      const s = states[m.key];
      return sum + (s.status === 'ready' ? 100 : s.progress);
    }, 0) / MODELS.length;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    label: { fontFamily: 'monospace', fontSize: 10, color: colors.textSecondary, letterSpacing: 1.2 },
    pct: { fontFamily: 'monospace', fontSize: 12, color: colors.accentBlue },
    trackBg: { height: 3, borderRadius: 2, backgroundColor: colors.border, marginBottom: 14, overflow: 'hidden' },
    trackFill: { height: 3, borderRadius: 2, backgroundColor: colors.accentBlue },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, gap: 10 },
    icon: { fontFamily: 'monospace', fontSize: 13, width: 18, textAlign: 'center' },
    name: { fontFamily: 'Georgia', fontSize: 13, flex: 1 },
    meta: { fontFamily: 'monospace', fontSize: 11 },
    note: {
      fontFamily: 'monospace',
      fontSize: 10,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 12,
      letterSpacing: 0.5,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>AI MODELS · FIRST RUN</Text>
        <Text style={styles.pct}>{Math.round(totalProgress)}%</Text>
      </View>

      <View style={styles.trackBg}>
        <View style={[styles.trackFill, { width: `${totalProgress}%` }]} />
      </View>

      {MODELS.map(({ key, label, size }) => {
        const state = states[key];
        const isReady = state.status === 'ready';
        const isLoading = state.status === 'loading';
        const color = isReady
          ? colors.success
          : isLoading
          ? colors.accentBlue
          : colors.textMuted;

        return (
          <View key={key} style={styles.row}>
            <Text style={[styles.icon, { color }]}>{statusIcon(state.status)}</Text>
            <Text style={[styles.name, { color }]}>{label}</Text>
            <Text style={[styles.meta, { color }]}>
              {isLoading ? `${state.progress}%` : size}
            </Text>
          </View>
        );
      })}

      <Text style={styles.note}>Downloads once · Always on-device · No cloud</Text>
    </View>
  );
}
