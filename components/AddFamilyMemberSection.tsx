import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

export function AddFamilyMemberSection() {
  const colors = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1.2,
          color: colors.textSecondary,
        }}
      >
        ADD A FAMILY MEMBER
      </Text>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        {/* Show My Code */}
        <TouchableOpacity
          onPress={() => router.push('/family/show-code')}
          activeOpacity={0.75}
          style={{
            flex: 1,
            backgroundColor: colors.bgCard,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 24,
            paddingHorizontal: 16,
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Ionicons name="qr-code-outline" size={28} color={colors.accentBlue} />
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              fontWeight: '600',
              letterSpacing: 1.2,
              color: colors.accentBlue,
              textAlign: 'center',
            }}
          >
            SHOW MY{'\n'}CODE
          </Text>
        </TouchableOpacity>

        {/* Scan Code */}
        <TouchableOpacity
          onPress={() => router.push('/family/scan-code')}
          activeOpacity={0.75}
          style={{
            flex: 1,
            backgroundColor: colors.bgCard,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 24,
            paddingHorizontal: 16,
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Ionicons name="camera-outline" size={28} color={colors.accentBlue} />
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              fontWeight: '600',
              letterSpacing: 1.2,
              color: colors.accentBlue,
              textAlign: 'center',
            }}
          >
            SCAN CODE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
