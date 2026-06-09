import { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  connected: boolean;
};

export function WaitingForScanStatus({ connected }: Props) {
  const colors = useTheme();
  const [pulse] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    if (connected) {
      pulse.stopAnimation();
      pulse.setValue(1);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [connected, pulse]);

  return (
    <View style={{ alignItems: 'center', gap: 20 }}>
      {connected ? (
        <View
          style={{
            backgroundColor: colors.successGreen,
            borderRadius: 99,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              fontWeight: '600',
              letterSpacing: 1.2,
              color: '#0f172a',
            }}
          >
            CONNECTED ✓
          </Text>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: 'rgba(52,211,153,0.12)',
            borderWidth: 1,
            borderColor: 'rgba(52,211,153,0.3)',
            borderRadius: 99,
            paddingVertical: 10,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Animated.View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.successGreen,
              opacity: pulse,
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
            WAITING FOR SCAN...
          </Text>
        </View>
      )}

      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text
          style={{
            fontFamily: 'Georgia',
            fontSize: 13,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          This code is unique to your device.
        </Text>
        <Text
          style={{
            fontFamily: 'Georgia',
            fontSize: 13,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          Health data is encrypted end-to-end.
        </Text>
      </View>
    </View>
  );
}
