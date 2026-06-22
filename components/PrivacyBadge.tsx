import { View, Text } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";

export function PrivacyBadge() {
  const { t } = useTranslation();
  return (
    <View className="medv-badge medv-badge--privacy">
      <View className="w-1.5 h-1.5 rounded-full bg-teal" />
      <Text className="font-code text-[10px] text-teal tracking-[1px]">
        {t("misc.allDataOnDevice")}
      </Text>
    </View>
  );
}
