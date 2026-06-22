import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import type { StringKey } from '@/constants/strings';

const RELATIONSHIPS: { value: string; key: StringKey }[] = [
  { value: 'Daughter', key: 'family.relDaughter' },
  { value: 'Son', key: 'family.relSon' },
  { value: 'Parent', key: 'family.relParent' },
  { value: 'Sibling', key: 'family.relSibling' },
  { value: 'Partner', key: 'family.relPartner' },
  { value: 'Other', key: 'family.relOther' },
];

type Props = {
  visible: boolean;
  onConfirm: (name: string, relationship: string) => void;
  onDismiss: () => void;
};

export function ConnectMemberModal({ visible, onConfirm, onDismiss }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');

  const handleConfirm = () => {
    if (!name.trim() || !relationship) return;
    onConfirm(name.trim(), relationship);
    setName('');
    setRelationship('');
  };

  const styles = StyleSheet.create({
    backdrop: { flex: 1 },
    sheet: {
      backgroundColor: colors.bgCard,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 20,
    },
    title: {
      fontFamily: 'Georgia',
      fontSize: 22,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 20,
    },
    input: {
      backgroundColor: colors.bgDeep,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontFamily: 'Georgia',
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 20,
    },
    sectionLabel: {
      fontFamily: 'monospace',
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1.2,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 24,
    },
    chip: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 99,
      paddingVertical: 8,
      paddingHorizontal: 14,
    },
    chipActive: {
      borderColor: colors.accentBlue,
      backgroundColor: 'rgba(59,130,246,0.12)',
    },
    chipText: {
      fontFamily: 'Georgia',
      fontSize: 14,
      color: colors.textSecondary,
    },
    chipTextActive: { color: colors.accentBlue },
    btn: {
      backgroundColor: colors.accentBlue,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
    },
    btnDisabled: { opacity: 0.4 },
    btnText: {
      fontFamily: 'monospace',
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 1.2,
      color: '#ffffff',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.backdrop} onPress={onDismiss} activeOpacity={1} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t('family.whoJustConnected')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('family.theirName')}
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
          />
          <Text style={styles.sectionLabel}>{t('family.relationshipLabel')}</Text>
          <View style={styles.chips}>
            {RELATIONSHIPS.map((r) => (
              <TouchableOpacity
                key={r.value}
                onPress={() => setRelationship(r.value)}
                style={[styles.chip, relationship === r.value && styles.chipActive]}
              >
                <Text style={[styles.chipText, relationship === r.value && styles.chipTextActive]}>
                  {t(r.key)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={handleConfirm}
            style={[styles.btn, (!name.trim() || !relationship) && styles.btnDisabled]}
            disabled={!name.trim() || !relationship}
          >
            <Text style={styles.btnText}>{t('family.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
