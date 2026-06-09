import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useUserStore } from "@/store/useUserStore";

export default function EditProfileScreen() {
  const colors = useTheme();
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);

  const [name, setName] = useState(profile?.name ?? "");
  const [age, setAge] = useState(profile?.age?.toString() ?? "");
  const [conditions, setConditions] = useState(profile?.conditions.join(", ") ?? "");
  const [medications, setMedications] = useState(profile?.medications.join(", ") ?? "");

  const handleSave = () => {
    if (!name.trim() || !profile) return;
    setProfile({
      ...profile,
      name: name.trim(),
      age: age ? parseInt(age, 10) : undefined,
      conditions: conditions.split(",").map((s) => s.trim()).filter(Boolean),
      medications: medications.split(",").map((s) => s.trim()).filter(Boolean),
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3.5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-[38px] h-[38px] items-center justify-center"
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text className="font-georgia text-[18px] font-bold text-white">Edit Profile</Text>
          <View className="w-[38px]" />
        </View>

        <ScrollView
          contentContainerClassName="px-5 pt-2 pb-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-4">
            <View>
              <Text className="font-code text-[11px] text-dim tracking-[1.2px] mb-1.5">
                YOUR NAME *
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className="bg-card border-edge border-[1.5px] rounded-xl h-14 px-4 font-georgia text-base text-white"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View>
              <Text className="font-code text-[11px] text-dim tracking-[1.2px] mb-1.5">
                AGE
              </Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                className="bg-card border-edge border-[1.5px] rounded-xl h-14 px-4 font-georgia text-base text-white"
                keyboardType="numeric"
                maxLength={3}
                returnKeyType="next"
              />
            </View>

            <View>
              <Text className="font-code text-[11px] text-dim tracking-[1.2px] mb-1.5">
                KNOWN CONDITIONS
              </Text>
              <TextInput
                value={conditions}
                onChangeText={setConditions}
                className="bg-card border-edge border-[1.5px] rounded-xl h-14 px-4 font-georgia text-base text-white"
                placeholder="e.g. Type 2 diabetes, arthritis"
                placeholderTextColor={colors.textMuted}
                returnKeyType="next"
              />
            </View>

            <View>
              <Text className="font-code text-[11px] text-dim tracking-[1.2px] mb-1.5">
                CURRENT MEDICATIONS
              </Text>
              <TextInput
                value={medications}
                onChangeText={setMedications}
                className="bg-card border-edge border-[1.5px] rounded-xl h-14 px-4 font-georgia text-base text-white"
                placeholder="e.g. Metformin 500mg"
                placeholderTextColor={colors.textMuted}
                returnKeyType="done"
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-5 pb-2">
          <TouchableOpacity
            onPress={handleSave}
            className={`bg-brand rounded-[14px] h-14 items-center justify-center${!name.trim() ? " opacity-40" : ""}`}
            activeOpacity={0.8}
            disabled={!name.trim()}
          >
            <Text className="font-code text-[13px] font-semibold text-white tracking-[1.2px]">
              SAVE CHANGES
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
