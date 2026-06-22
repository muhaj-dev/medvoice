import { View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';

type Props = {
  connectedCount: number;
};

export function P2PMeshBanner({ connectedCount }: Props) {
  const colors = useTheme();
  const { t } = useTranslation();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: 'rgba(52,211,153,0.3)',
        borderRadius: 14,
        backgroundColor: 'rgba(52,211,153,0.06)',
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: colors.successGreen,
        }}
      />
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: 12,
          fontWeight: '600',
          letterSpacing: 1.2,
          color: colors.successGreen,
        }}
      >
        {t('family.meshActivePrefix')}{connectedCount}{t('family.meshActiveSuffix')}
      </Text>
    </View>
  );
}
