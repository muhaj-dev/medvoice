import { View, Text } from 'react-native';
import { colors } from '@/constants/colors';

const STEPS = [
  'Both phones need internet briefly',
  'One person shows their QR code',
  'The other person scans it',
  'Connected! Health updates sync automatically',
];

export function HowP2PWorksCard() {
  return (
    <View
      style={{
        backgroundColor: colors.bgCard,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 20,
        gap: 16,
      }}
    >
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 1.2,
          color: colors.textSecondary,
        }}
      >
        HOW P2P WORKS
      </Text>

      {STEPS.map((step, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: colors.bgDeep,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Text
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                fontWeight: '600',
                color: colors.accentBlue,
              }}
            >
              {i + 1}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Georgia',
              fontSize: 14,
              color: colors.textSecondary,
              lineHeight: 22,
              flex: 1,
            }}
          >
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
}
