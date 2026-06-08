import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

type TabConfig = {
  icon: IoniconsName;
  iconActive: IoniconsName;
  label: string;
};

const TAB_CONFIG: Record<string, TabConfig> = {
  index:       { icon: "home-outline",     iconActive: "home",     label: "HOME"      },
  timeline:    { icon: "time-outline",     iconActive: "time",     label: "TIMELINE"  },
  family:      { icon: "people-outline",   iconActive: "people",   label: "FAMILY"    },
  "care-view": { icon: "eye-outline",      iconActive: "eye",      label: "CARE VIEW" },
  settings:    { icon: "settings-outline", iconActive: "settings", label: "SETTINGS"  },
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
  return (
    <View className="flex-row bg-surface border-t border-edge h-18 pt-2 pb-2.5">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name] ?? {
          icon: "help-outline" as IoniconsName,
          iconActive: "help" as IoniconsName,
          label: route.name.toUpperCase(),
        };

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
              name={isFocused ? config.iconActive : config.icon}
              size={22}
              color={isFocused ? colors.textPrimary : colors.textMuted}
            />
            <Text
              className={`font-code text-[10px] tracking-[0.5px] ${
                isFocused ? "text-white" : "text-ghost"
              }`}
            >
              {config.label}
            </Text>
            <View
              className={`w-1 h-1 rounded-full ${
                isFocused ? "bg-brand" : "bg-transparent"
              }`}
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
