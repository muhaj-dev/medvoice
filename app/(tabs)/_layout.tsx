import { Tabs } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";

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
  const colors = useTheme();

  return (
    <View
      className="flex-row h-18 pt-2 pb-2.5"
      style={{ backgroundColor: colors.bgCard, borderTopWidth: 1, borderTopColor: colors.border }}
    >
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
              {config.label}
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
