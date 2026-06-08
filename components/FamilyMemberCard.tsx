import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import type { FamilyMember } from '@/types/family';

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type Props = {
  member: FamilyMember;
};

export function FamilyMemberCard({ member }: Props) {
  const colors = useTheme();
  const isOnline = member.connectionStatus === 'online';
  const ringColor = isOnline ? colors.successGreen : colors.textMuted;
  const initial = member.name.charAt(0).toUpperCase();

  return (
    <View
      style={{
        backgroundColor: colors.bgCard,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {/* Avatar */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.bgDeep,
          borderWidth: 2,
          borderColor: ringColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: 'Georgia',
            fontSize: 18,
            fontWeight: '600',
            color: isOnline ? colors.successGreen : colors.textSecondary,
          }}
        >
          {initial}
        </Text>
      </View>

      {/* Name + sub */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: 'Georgia',
            fontSize: 17,
            fontWeight: '600',
            color: colors.textPrimary,
          }}
        >
          {member.name}
        </Text>
        <Text
          style={{
            fontFamily: 'Georgia',
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 2,
          }}
        >
          {member.relationship} · {timeAgo(member.lastSynced)}
        </Text>
      </View>

      {/* Status badge */}
      <View
        style={{
          borderWidth: 1,
          borderColor: isOnline ? colors.successGreen : colors.textMuted,
          borderRadius: 99,
          paddingVertical: 6,
          paddingHorizontal: 12,
        }}
      >
        <Text
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 1,
            color: isOnline ? colors.successGreen : colors.textMuted,
          }}
        >
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </Text>
      </View>
    </View>
  );
}
