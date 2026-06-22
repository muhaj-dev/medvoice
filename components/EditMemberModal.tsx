import { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { makeEditMemberStyles } from '@/components/EditMemberModal.styles';
import type { StringKey } from '@/constants/strings';
import type { FamilyMember } from '@/types/family';

const RELATIONSHIPS: { value: string; key: StringKey }[] = [
  { value: 'Daughter', key: 'family.relDaughter' },
  { value: 'Son', key: 'family.relSon' },
  { value: 'Parent', key: 'family.relParent' },
  { value: 'Sibling', key: 'family.relSibling' },
  { value: 'Partner', key: 'family.relPartner' },
  { value: 'Other', key: 'family.relOther' },
];

type Props = {
  member: FamilyMember | null;
  onSave: (name: string, relationship: string, shareEnabled: boolean) => void;
  onRemove: () => void;
  onDismiss: () => void;
};

export function EditMemberModal({ member, onSave, onRemove, onDismiss }: Props) {
  return (
    <Modal visible={!!member} transparent animationType="slide" onRequestClose={onDismiss}>
      {member && (
        <EditMemberForm
          member={member}
          onSave={onSave}
          onRemove={onRemove}
          onDismiss={onDismiss}
        />
      )}
    </Modal>
  );
}

// Separate component so the form remounts (fresh prefilled state) every time
// the modal opens — no setState-in-effect needed.
function EditMemberForm({
  member,
  onSave,
  onRemove,
  onDismiss,
}: Props & { member: FamilyMember }) {
  const colors = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => makeEditMemberStyles(colors), [colors]);
  const [name, setName] = useState(member.name);
  const [relationship, setRelationship] = useState(member.relationship);
  const [shareEnabled, setShareEnabled] = useState(member.shareEnabled);

  const handleSave = () => {
    if (!name.trim() || !relationship) return;
    onSave(name.trim(), relationship, shareEnabled);
  };

  const handleRemove = () => {
    Alert.alert(
      t('family.removeFamilyMember'),
      `${t('family.removeBodyPrefix')}${member.name}${t('family.removeBodySuffix')}`,
      [
        { text: t('family.cancel'), style: 'cancel' },
        { text: t('family.remove'), style: 'destructive', onPress: onRemove },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.backdrop} onPress={onDismiss} activeOpacity={1} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>{t('family.editFamilyMember')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('family.theirName')}
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
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
          <View style={styles.shareRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.shareTitle}>{t('family.shareMyHealthData')}</Text>
              <Text style={styles.shareSub}>
                {t('family.shareMyHealthDataSub')}
              </Text>
            </View>
            <Switch
              value={shareEnabled}
              onValueChange={setShareEnabled}
              trackColor={{ false: colors.border, true: colors.accentBlue }}
              thumbColor="#ffffff"
            />
          </View>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveBtn, (!name.trim() || !relationship) && styles.saveBtnDisabled]}
            disabled={!name.trim() || !relationship}
          >
            <Text style={styles.saveText}>{t('family.saveChanges')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
            <Text style={styles.removeText}>{t('family.removeMember')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
