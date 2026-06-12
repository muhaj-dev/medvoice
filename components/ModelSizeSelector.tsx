/**
 * AI MODEL size picker (Settings). The app defaults to the smallest 1.7B
 * model; on low-RAM phones the 4B option (~2.5 GB of weights) shows a warning
 * before switching, since the OS can kill the app mid-analysis.
 */
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsStore, type ModelSize } from "@/store/useSettingsStore";
import { getTotalRamGB, isLowRamDevice } from "@/lib/device";

const MODEL_OPTIONS: { value: ModelSize; label: string; description: string }[] = [
  { value: "1.7b", label: "1.7B", description: "Faster · Less RAM" },
  { value: "4b",   label: "4B",   description: "Accurate · More RAM" },
];

export function ModelSizeSelector() {
  const colors = useTheme();
  const { modelSize, setModelSize } = useSettingsStore();
  const lowRam = isLowRamDevice();

  const handleSelect = (size: ModelSize) => {
    if (size === "4b" && lowRam) {
      const ram = getTotalRamGB();
      Alert.alert(
        "Not recommended on this phone",
        `The 4B model needs about 2.5 GB of memory${
          ram ? ` and this phone has ${Math.round(ram)} GB of RAM` : ""
        }. It may run slowly or close unexpectedly. We recommend staying on the 1.7B model.`,
        [
          { text: "Keep 1.7B", style: "cancel" },
          { text: "Use 4B anyway", style: "destructive", onPress: () => setModelSize("4b") },
        ]
      );
      return;
    }
    setModelSize(size);
  };

  return (
    <View style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
      <Text style={{ fontFamily: "Georgia", fontSize: 15, color: colors.textPrimary, marginBottom: 12 }}>
        MedPsy Model Size
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {MODEL_OPTIONS.map((opt) => {
          const active = modelSize === opt.value;
          const discouraged = opt.value === "4b" && lowRam;
          const description = discouraged ? "Not recommended" : opt.description;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => handleSelect(opt.value)}
              activeOpacity={0.75}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: active ? colors.accentBlue : colors.border,
                backgroundColor: active ? `${colors.accentBlue}18` : colors.bgCard,
                gap: 2,
              }}
            >
              <Text style={{
                fontFamily: "monospace",
                fontSize: 14,
                fontWeight: "700",
                color: active ? colors.accentBlue : colors.textPrimary,
              }}>
                {opt.label}
              </Text>
              <Text style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: 0.3,
                color: discouraged
                  ? colors.warningAmber
                  : active ? colors.accentBlue : colors.textSecondary,
              }}>
                {description.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
