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
import { makeEditMemberStyles } from '@/components/EditMemberModal.styles';
import type { FamilyMember } from '@/types/family';

const RELATIONSHIPS = ['Daughter', 'Son', 'Parent', 'Sibling', 'Partner', 'Other'];

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
      'Remove family member?',
      `${member.name} will no longer receive your health summaries.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: onRemove },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.backdrop} onPress={onDismiss} activeOpacity={1} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Edit family member</Text>
          <TextInput
            style={styles.input}
            placeholder="Their name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.sectionLabel}>RELATIONSHIP</Text>
          <View style={styles.chips}>
            {RELATIONSHIPS.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRelationship(r)}
                style={[styles.chip, relationship === r && styles.chipActive]}
              >
                <Text style={[styles.chipText, relationship === r && styles.chipTextActive]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.shareRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.shareTitle}>Share my health data</Text>
              <Text style={styles.shareSub}>
                They receive your entries, past and future
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
            <Text style={styles.saveText}>SAVE CHANGES</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
            <Text style={styles.removeText}>REMOVE MEMBER</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
