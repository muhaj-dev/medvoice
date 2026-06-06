import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/useUserStore";
import type { UserRole } from "@/types/user";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

// ── Step indicator ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  return (
    <View className="items-center gap-2">
      <Text className="font-code text-[11px] font-semibold tracking-[1.6px] text-ghost">
        STEP {step} OF 3
      </Text>
      <View className="flex-row gap-2 items-center">
        {[1, 2, 3].map((n) => (
          <View
            key={n}
            className={`h-1.5 rounded-full ${
              n === step ? "w-6 bg-brand" : n < step ? "w-2 bg-teal" : "w-1.5 bg-ghost"
            }`}
          />
        ))}
      </View>
    </View>
  );
}

// ── Role card ─────────────────────────────────────────────────────────────────

function RoleCard({
  icon,
  title,
  selected,
  onPress,
}: {
  icon: IoniconsName;
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.roleCard, selected && styles.roleCardSelected]}
      className="flex-1 items-center justify-center gap-3 p-5"
    >
      <View
        style={[styles.roleIconWrap, selected && styles.roleIconWrapSelected]}
        className="w-14 h-14 rounded-full items-center justify-center"
      >
        <Ionicons
          name={icon}
          size={28}
          color={selected ? colors.accentBlue : colors.textSecondary}
        />
      </View>
      <Text
        className={`font-georgia text-[13px] font-semibold text-center leading-5 ${
          selected ? "text-white" : "text-dim"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// ── Tag chip ──────────────────────────────────────────────────────────────────

function TagChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <View style={styles.tagChip} className="flex-row items-center gap-1.5">
      <Text className="font-code text-[11px] text-white tracking-wide">
        {label}
      </Text>
      <TouchableOpacity
        onPress={onRemove}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={11} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

// ── Expandable tag section ────────────────────────────────────────────────────

function TagSection({
  label,
  tags,
  onAdd,
  onRemove,
  placeholder,
}: {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");

  const submit = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) onAdd(trimmed);
    setInput("");
  }, [input, tags, onAdd]);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        style={styles.expandRow}
        className="flex-row items-center justify-between"
        activeOpacity={0.7}
      >
        <Text className="font-georgia text-[15px] font-semibold text-white flex-1 pr-3">
          {label}
        </Text>
        <View
          style={styles.expandBtn}
          className="w-7 h-7 rounded-full items-center justify-center"
        >
          <Ionicons
            name={expanded ? "remove" : "add"}
            size={16}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="gap-2.5 mt-2">
          {tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {tags.map((t) => (
                <TagChip key={t} label={t} onRemove={() => onRemove(t)} />
              ))}
            </View>
          )}
          <View style={styles.tagInputRow} className="flex-row items-center">
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={submit}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              style={styles.tagInput}
            />
            <TouchableOpacity
              onPress={submit}
              style={styles.tagAddBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text className="font-georgia text-[22px] text-brand font-bold">
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// ── Step 1: Role Selection ────────────────────────────────────────────────────

function Step1({
  role,
  onSelect,
}: {
  role: UserRole | null;
  onSelect: (r: UserRole) => void;
}) {
  return (
    <View className="gap-8">
      <View className="items-center gap-2 pt-6">
        <Text className="font-georgia text-[34px] font-bold italic text-teal">
          MedVoice
        </Text>
        <Text className="font-code text-[10px] font-semibold tracking-[2px] text-ghost">
          YOUR HEALTH COMPANION
        </Text>
      </View>

      <View className="gap-3.5">
        <Text className="font-georgia text-[18px] font-semibold text-white text-center">
          How will you use MedVoice?
        </Text>
        <View className="flex-row gap-3">
          <RoleCard
            icon="mic-outline"
            title={"I am tracking my health"}
            selected={role === "patient"}
            onPress={() => onSelect("patient")}
          />
          <RoleCard
            icon="people-outline"
            title={"I am caring for a family member"}
            selected={role === "caregiver"}
            onPress={() => onSelect("caregiver")}
          />
        </View>
      </View>
    </View>
  );
}

// ── Step 2: Personal Profile ──────────────────────────────────────────────────

function Step2({
  name,
  age,
  conditions,
  medications,
  onName,
  onAge,
  onAddCondition,
  onRemoveCondition,
  onAddMedication,
  onRemoveMedication,
}: {
  name: string;
  age: string;
  conditions: string[];
  medications: string[];
  onName: (v: string) => void;
  onAge: (v: string) => void;
  onAddCondition: (v: string) => void;
  onRemoveCondition: (v: string) => void;
  onAddMedication: (v: string) => void;
  onRemoveMedication: (v: string) => void;
}) {
  return (
    <View className="gap-5 pt-2">
      <View className="gap-1">
        <Text className="font-georgia text-[24px] font-bold text-white">
          About you
        </Text>
        <Text className="font-georgia text-[14px] text-dim leading-5">
          All information stays on your device.
        </Text>
      </View>

      {/* Name (required) */}
      <View className="gap-1.5">
        <Text className="font-code text-[11px] font-semibold tracking-[1.4px] text-dim">
          YOUR NAME{" "}
          <Text style={{ color: colors.accentBlue }}>*</Text>
        </Text>
        <TextInput
          value={name}
          onChangeText={onName}
          placeholder="Enter your name"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          style={styles.textField}
        />
      </View>

      {/* Age (optional) */}
      <View className="gap-1.5">
        <Text className="font-code text-[11px] font-semibold tracking-[1.4px] text-dim">
          AGE{" "}
          <Text className="font-code text-[10px] text-ghost">(optional)</Text>
        </Text>
        <TextInput
          value={age}
          onChangeText={onAge}
          placeholder="e.g. 45"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          maxLength={3}
          style={styles.textField}
        />
      </View>

      <View className="h-px bg-edge" />

      <TagSection
        label="Any known health conditions?"
        tags={conditions}
        onAdd={onAddCondition}
        onRemove={onRemoveCondition}
        placeholder="e.g. Diabetes, Hypertension..."
      />

      <View className="h-px bg-edge" />

      <TagSection
        label="Current medications?"
        tags={medications}
        onAdd={onAddMedication}
        onRemove={onRemoveMedication}
        placeholder="e.g. Metformin, Lisinopril..."
      />
    </View>
  );
}

// ── Step 3: Privacy Promise ───────────────────────────────────────────────────

const PROMISES = [
  "No cloud server. No account. No password.",
  "Your voice never leaves this phone.",
  "Family sharing is device-to-device, encrypted.",
] as const;

function Step3() {
  return (
    <View className="flex-1 items-center gap-7 pt-4">
      {/* Shield icon */}
      <View
        style={styles.shieldOuter}
        className="w-32 h-32 rounded-full items-center justify-center"
      >
        <View
          style={styles.shieldInner}
          className="w-24 h-24 rounded-full items-center justify-center"
        >
          <Ionicons
            name="shield-checkmark"
            size={52}
            color={colors.accentBlue}
          />
        </View>
      </View>

      {/* Heading */}
      <View className="gap-2 items-center px-2">
        <Text className="font-georgia text-[26px] font-bold text-white text-center leading-9">
          Your data stays on{"\n"}
          <Text className="italic text-teal">your device.</Text>
        </Text>
        <Text className="font-georgia text-[14px] text-dim text-center leading-5 mt-1">
          No information ever leaves your phone.{"\n"}
          MedVoice is built on this promise.
        </Text>
      </View>

      {/* Promise card */}
      <View style={styles.promiseCard} className="w-full gap-4">
        {PROMISES.map((p, i) => (
          <View key={i} className="flex-row items-start gap-3.5">
            <View
              style={styles.checkCircle}
              className="w-6 h-6 rounded-full items-center justify-center mt-0.5 shrink-0"
            >
              <Ionicons
                name="checkmark"
                size={14}
                color={colors.successGreen}
              />
            </View>
            <Text className="font-georgia text-[14px] text-white leading-5 flex-1">
              {p}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── StyleSheet ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Role cards
  roleCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 152,
  },
  roleCardSelected: {
    borderColor: colors.accentBlue,
    backgroundColor: "rgba(59,130,246,0.10)",
  },
  roleIconWrap: {
    backgroundColor: "rgba(139,155,180,0.10)",
  },
  roleIconWrapSelected: {
    backgroundColor: "rgba(59,130,246,0.14)",
  },
  // Form fields
  textField: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: "Georgia",
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 52,
  },
  // Expandable section
  expandRow: {
    paddingVertical: 12,
  },
  expandBtn: {
    backgroundColor: colors.border,
  },
  // Tag input
  tagInputRow: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  tagInput: {
    flex: 1,
    fontFamily: "Georgia",
    fontSize: 14,
    color: colors.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 50,
  },
  tagAddBtn: {
    paddingRight: 14,
    paddingLeft: 8,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  tagChip: {
    backgroundColor: "rgba(59,130,246,0.12)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.28)",
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  // Shield (Step 3)
  shieldOuter: {
    backgroundColor: "rgba(59,130,246,0.07)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.18)",
  },
  shieldInner: {
    backgroundColor: "rgba(59,130,246,0.12)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.28)",
  },
  // Promise card
  promiseCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
  },
  checkCircle: {
    backgroundColor: "rgba(52,211,153,0.12)",
    borderWidth: 1.5,
    borderColor: colors.successGreen,
  },
  // Continue button
  continueBtn: {
    backgroundColor: colors.accentBlue,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    minHeight: 54,
  },
  continueBtnDisabled: {
    backgroundColor: "rgba(59,130,246,0.25)",
  },
  // ScrollView content
  scrollContent: {
    paddingBottom: 24,
  },
});

// ── Main screen ───────────────────────────────────────────────────────────────

export default function OnboardingSetupScreen() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const setProfile = useUserStore((s) => s.setProfile);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  const canContinue =
    step === 1 ? role !== null : step === 2 ? name.trim().length > 0 : true;

  const handleContinue = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    if (saving) return;
    setSaving(true);
    setProfile({
      name: name.trim(),
      age: parseInt(age, 10) || 0,
      role: role!,
      conditions,
      medications,
    });
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    // SafeAreaView — className not supported, inline style required
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="px-5 pt-3 pb-2 gap-2.5">
          {step > 1 && (
            <TouchableOpacity
              onPress={handleBack}
              className="self-start"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text className="font-code text-[12px] font-semibold tracking-[1.2px] text-dim">
                ← BACK
              </Text>
            </TouchableOpacity>
          )}
          <StepIndicator step={step} />
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && <Step1 role={role} onSelect={setRole} />}
          {step === 2 && (
            <Step2
              name={name}
              age={age}
              conditions={conditions}
              medications={medications}
              onName={setName}
              onAge={setAge}
              onAddCondition={(v) => setConditions((c) => [...c, v])}
              onRemoveCondition={(v) =>
                setConditions((c) => c.filter((x) => x !== v))
              }
              onAddMedication={(v) => setMedications((m) => [...m, v])}
              onRemoveMedication={(v) =>
                setMedications((m) => m.filter((x) => x !== v))
              }
            />
          )}
          {step === 3 && <Step3 />}
        </ScrollView>

        {/* Footer */}
        <View className="px-5 pb-3 pt-2">
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!canContinue || saving}
            activeOpacity={0.85}
            style={[
              styles.continueBtn,
              (!canContinue || saving) && styles.continueBtnDisabled,
            ]}
          >
            <Text
              className={`font-georgia text-[16px] font-bold ${
                canContinue && !saving ? "text-white" : "text-ghost"
              }`}
            >
              {saving ? "Saving..." : step === 3 ? "Get Started" : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
