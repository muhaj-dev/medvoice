import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { OnboardingProgressDots } from "@/components/OnboardingProgressDots";
import { OnboardingNavButtons } from "@/components/OnboardingNavButtons";
import { useUserStore } from "@/store/useUserStore";

export default function ProfileScreen() {
  const colors = useTheme();
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const setProfile = useUserStore((s) => s.setProfile);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const onboardingComplete = useUserStore((s) => s.onboardingComplete);

  useEffect(() => {
    if (onboardingComplete) router.replace("/(tabs)" as any);
  }, [onboardingComplete, router]);

  const [name, setName] = useState(profile?.name ?? "");
  const [age, setAge] = useState(profile?.age?.toString() ?? "");
  const [conditions, setConditions] = useState(profile?.conditions.join(", ") ?? "");
  const [medications, setMedications] = useState(profile?.medications.join(", ") ?? "");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setProfile({
      name: name.trim(),
      age: age ? parseInt(age, 10) : undefined,
      role: profile?.role ?? "patient",
      conditions: conditions.split(",").map((s) => s.trim()).filter(Boolean),
      medications: medications.split(",").map((s) => s.trim()).filter(Boolean),
    });
    await completeOnboarding();
    // Dismiss all onboarding screens from the stack, then replace with tabs
    if (router.canDismiss()) router.dismissAll();
    router.replace("/(tabs)" as any);
  };

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bgPrimary },
    kav: { flex: 1 },
    scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
    fields: { gap: 16 },
    label: {
      fontFamily: "monospace",
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: 1.2,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.bgCard,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      height: 56,
      paddingHorizontal: 16,
      fontFamily: "Georgia",
      fontSize: 16,
      color: colors.textPrimary,
    },
    footer: { paddingHorizontal: 20, paddingBottom: 8 },
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-9">
            <OnboardingProgressDots current={3} />
          </View>

          <View className="mb-7">
            <Text style={{ fontFamily: 'Georgia', fontSize: 28, fontWeight: '700', color: colors.textPrimary, lineHeight: 36 }}>
              Tell us about
            </Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 28, fontWeight: '700', fontStyle: 'italic', color: colors.accentBlue, lineHeight: 36, marginBottom: 8 }}>
              yourself
            </Text>
            <Text style={{ fontFamily: 'Georgia', fontSize: 13, color: colors.textSecondary }}>
              Stored only on your device. Never shared.
            </Text>
          </View>

          <View style={styles.fields}>
            <View>
              <Text style={styles.label}>YOUR NAME *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            <View>
              <Text style={styles.label}>AGE *</Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                style={styles.input}
                keyboardType="numeric"
                maxLength={3}
                returnKeyType="next"
              />
            </View>
            <View>
              <Text style={styles.label}>KNOWN CONDITIONS (OPTIONAL)</Text>
              <TextInput
                value={conditions}
                onChangeText={setConditions}
                style={styles.input}
                placeholder="e.g. Type 2 diabetes, arthritis"
                placeholderTextColor={colors.textMuted}
                returnKeyType="next"
              />
            </View>
            <View>
              <Text style={styles.label}>CURRENT MEDICATIONS (OPTIONAL)</Text>
              <TextInput
                value={medications}
                onChangeText={setMedications}
                style={styles.input}
                placeholder="e.g. Metformin 500mg"
                placeholderTextColor={colors.textMuted}
                returnKeyType="done"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <OnboardingNavButtons
            onBack={() => router.back()}
            onContinue={handleSubmit}
            continueLabel="LET'S GO 🎉"
            continueEnabled={name.trim().length > 0}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

