import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
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
  const colors = useTheme();
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(profile?.role ?? null);

  useEffect(() => {
    if (onboardingComplete) router.replace("/(tabs)" as any);
  }, [onboardingComplete, router]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgPrimary }} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View className="items-center mb-9">
          <OnboardingProgressDots current={2} />
        </View>

        <View className="mb-7">
          <Text style={{ fontFamily: 'Georgia', fontSize: 28, fontWeight: '700', color: colors.textPrimary, lineHeight: 36 }}>
            How will you use
          </Text>
          <Text style={{ fontFamily: 'Georgia', fontSize: 28, fontWeight: '700', fontStyle: 'italic', color: colors.accentBlue, lineHeight: 36, marginBottom: 10 }}>
            MedVoice?
          </Text>
          <Text style={{ fontFamily: 'Georgia', fontSize: 14, color: colors.textSecondary }}>
            {"We'll personalise the app for you."}
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

      <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        <OnboardingNavButtons
          onBack={() => router.back()}
          onContinue={handleContinue}
          continueEnabled={selectedRole !== null}
        />
      </View>
    </SafeAreaView>
  );
}

