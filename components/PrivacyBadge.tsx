import { View, Text } from "react-native";

export function PrivacyBadge() {
  return (
    <View className="medv-badge medv-badge--privacy">
      <View className="w-1.5 h-1.5 rounded-full bg-teal" />
      <Text className="font-code text-[10px] text-teal tracking-[1px]">
        ALL DATA ON-DEVICE
      </Text>
    </View>
  );
}
