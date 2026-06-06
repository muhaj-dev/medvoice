import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";

export default function FamilyScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      edges={["top"]}
    >
      <View className="flex-1 items-center justify-center gap-2">
        <Text className="font-georgia text-[28px] font-bold text-white">
          Family
        </Text>
        <Text className="font-code text-[11px] tracking-[1.4px] text-ghost">
          COMING SOON
        </Text>
      </View>
    </SafeAreaView>
  );
}
