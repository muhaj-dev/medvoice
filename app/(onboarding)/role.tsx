import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import { OnboardingProgressDots } from "@/components/OnboardingProgressDots";
import { RoleCard } from "@/components/RoleCard";
import { OnboardingNavButtons } from "@/components/OnboardingNavButtons";
import { useUserStore } from "@/store/useUserStore";
import type { UserRole } from "@/types/user";

const ROLES = [
  {
    id: "patient" as UserRole,
    emoji: "🧑",
    title: "I am tracking my own health",
    description: "Log daily symptoms, get AI insights, stay on top of your wellbeing",
  },
  {
    id: "caregiver" as UserRole,
    emoji: "👥",
    title: "I am caring for a family member",
    description: "Monitor a loved one's health, receive updates, stay connected privately",
  },
];

export default function RoleScreen() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(profile?.role ?? null);

  const handleContinue = () => {
    if (!selectedRole) return;
    setProfile({
      name: profile?.name ?? "",
      age: profile?.age,
      role: selectedRole,
      conditions: profile?.conditions ?? [],
      medications: profile?.medications ?? [],
    });
    router.push("/(onboarding)/profile");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View className="items-center mb-9">
          <OnboardingProgressDots current={2} />
        </View>

        <View className="mb-7">
          <Text className="font-georgia text-[28px] font-bold text-white leading-9">
            How will you use
          </Text>
          <Text className="font-georgia text-[28px] font-bold italic text-brand leading-9 mb-2.5">
            MedVoice?
          </Text>
          <Text className="font-georgia text-[14px] text-dim">
            We'll personalise the app for you.
          </Text>
        </View>

        <View style={{ gap: 14 }}>
          {ROLES.map((role) => (
            <RoleCard
              key={role.id}
              emoji={role.emoji}
              title={role.title}
              description={role.description}
              selected={selectedRole === role.id}
              onPress={() => setSelectedRole(role.id)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <OnboardingNavButtons
          onBack={() => router.back()}
          onContinue={handleContinue}
          continueEnabled={selectedRole !== null}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  footer: { paddingHorizontal: 20, paddingBottom: 8 },
});
