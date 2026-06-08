import { View, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type Props = {
  publicKey: string;
};

export function DeviceQRCode({ publicKey }: Props) {
  return (
    <View
      style={{
        width: 240,
        height: 240,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
      }}
    >
      {publicKey ? (
        <QRCode
          value={publicKey}
          size={200}
          backgroundColor="#ffffff"
          color="#000000"
        />
      ) : (
        <ActivityIndicator color="#111827" size="large" />
      )}
    </View>
  );
}
