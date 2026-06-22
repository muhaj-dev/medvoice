import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import type { StringKey } from "@/constants/strings";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

type TabConfig = {
  icon: IoniconsName;
  iconActive: IoniconsName;
  labelKey: StringKey;
};

const TAB_CONFIG: Record<string, TabConfig> = {
  index:       { icon: "home-outline",     iconActive: "home",     labelKey: "tab.home"     },
  timeline:    { icon: "time-outline",     iconActive: "time",     labelKey: "tab.timeline" },
  family:      { icon: "people-outline",   iconActive: "people",   labelKey: "tab.family"   },
  "care-view": { icon: "eye-outline",      iconActive: "eye",      labelKey: "tab.careView" },
  settings:    { icon: "settings-outline", iconActive: "settings", labelKey: "tab.settings" },
};

type CustomTabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    emit: (event: {
      type: string;
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      className="flex-row pt-2"
      style={{
        backgroundColor: colors.bgCard,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        // Keep the bar above the Android/iOS system navigation area.
        paddingBottom: Math.max(insets.bottom, 10),
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name];
        const label = config ? t(config.labelKey) : route.name.toUpperCase();
        const iconName = config?.icon ?? ("help-outline" as IoniconsName);
        const iconActive = config?.iconActive ?? ("help" as IoniconsName);

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center gap-0.5"
          >
            <Ionicons
              name={isFocused ? iconActive : iconName}
              size={22}
              color={isFocused ? colors.tabActive : colors.tabInactive}
            />
            <Text
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                letterSpacing: 0.5,
                color: isFocused ? colors.tabActive : colors.tabInactive,
              }}
            >
              {label}
            </Text>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: isFocused ? colors.tabDot : "transparent",
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <CustomTabBar {...(props as unknown as CustomTabBarProps)} />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="timeline" />
      <Tabs.Screen name="family" />
      <Tabs.Screen name="care-view" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
