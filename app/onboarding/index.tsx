import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { images } from "@/constants/images";

// ── Types ────────────────────────────────────────────────────────────────────

type IllustrationType = "welcome" | "voice" | "analysis" | "privacy";
type LabelColor = "teal" | "brand";

type Slide = {
  id: string;
  label: string;
  title: string;
  titleAccent: string;
  description: string;
  illustration: IllustrationType;
  labelColor: LabelColor;
};

// ── Slide data ────────────────────────────────────────────────────────────────

const SLIDES: Slide[] = [
  {
    id: "welcome",
    label: "YOUR HEALTH COMPANION",
    title: "Welcome to",
    titleAccent: "MedVoice",
    description:
      "A private, on-device AI health companion. Track your wellbeing through voice — no cloud, no compromise.",
    illustration: "welcome",
    labelColor: "brand",
  },
  {
    id: "voice",
    label: "VOICE-POWERED LOGGING",
    title: "Speak About",
    titleAccent: "Your Health",
    description:
      "Simply talk about how you're feeling. MedVoice transcribes and analyzes your health entirely on your device.",
    illustration: "voice",
    labelColor: "brand",
  },
  {
    id: "analysis",
    label: "ON-DEVICE AI",
    title: "MedPsy AI",
    titleAccent: "Finds Patterns",
    description:
      "Powered by MedPsy-4B running locally on your phone. Get real health insights without sending data anywhere.",
    illustration: "analysis",
    labelColor: "teal",
  },
  {
    id: "privacy",
    label: "COMPLETE PRIVACY",
    title: "Your Data",
    titleAccent: "Never Leaves",
    description:
      "No servers. No accounts. Connect with family via direct device-to-device P2P — your health is yours alone.",
    illustration: "privacy",
    labelColor: "teal",
  },
];

// ── Illustrations ─────────────────────────────────────────────────────────────

function WelcomeIllustration() {
  return (
    <View className="items-center gap-4">
      {/* Outer glow ring — rgba border/bg not expressible as theme token */}
      <View
        className="w-47 h-47 rounded-full items-center justify-center"
        style={{
          borderWidth: 1,
          borderColor: "rgba(59,130,246,0.18)",
          backgroundColor: "rgba(59,130,246,0.04)",
        }}
      >
        <View
          className="w-36 h-36 rounded-full items-center justify-center"
          style={{
            borderWidth: 1,
            borderColor: "rgba(59,130,246,0.28)",
            backgroundColor: "rgba(59,130,246,0.07)",
          }}
        >
          <Image
            source={images.appIcon}
            className="w-21 h-21 rounded-4.5"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Privacy badge — rgba not in theme */}
      <View
        className="flex-row items-center gap-1.5 rounded-full px-3.5 py-1.75"
        style={{
          backgroundColor: "rgba(52,211,153,0.10)",
          borderWidth: 1,
          borderColor: "rgba(52,211,153,0.32)",
        }}
      >
        <View className="w-1.75 h-1.75 rounded-full bg-teal" />
        <Text className="font-code text-[11px] font-semibold tracking-[1.2px] text-white">
          ALL DATA ON-DEVICE
        </Text>
      </View>
    </View>
  );
}

function VoiceIllustration() {
  const bars = [16, 30, 46, 38, 22, 44, 32, 18, 40, 26, 14, 42];
  return (
    <View className="items-center gap-4 w-full">
      <View className="bg-card border border-edge rounded-5 p-5 w-full items-center gap-3.5">
        <Text className="font-code text-[11px] font-semibold tracking-[1.2px] text-brand">
          ● LISTENING · ON DEVICE
        </Text>

        {/* Waveform — bar heights are runtime values from the array */}
        <View className="flex-row items-center gap-1 h-13">
          {bars.map((h, i) => (
            <View
              key={i}
              className="w-1 rounded-sm bg-brand opacity-85"
              style={{ height: h }}
            />
          ))}
        </View>

        {/* Stop button — rgba bg not in theme */}
        <View
          className="w-16 h-16 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(248,113,113,0.14)" }}
        >
          <View className="w-13 h-13 rounded-full bg-danger items-center justify-center">
            <View className="w-4.5 h-4.5 rounded-sm bg-white" />
          </View>
        </View>

        <Text className="font-code text-[10px] tracking-[0.8px] text-ghost">
          Tap to stop &amp; analyze
        </Text>
      </View>
    </View>
  );
}

function AnalysisIllustration() {
  const steps = [
    { label: "Transcribing voice input", done: true },
    { label: "MedPsy-4B analyzing patterns", done: true },
    { label: "Scanning health history", done: true },
    { label: "RAG context retrieval", done: false },
  ];
  return (
    <View className="items-center w-full">
      <View className="bg-card border border-edge rounded-5 p-5 w-full gap-2.5">
        <Text className="font-code text-[10px] font-semibold tracking-[1.5px] text-brand">
          MEDPSY PROCESSING
        </Text>

        <Text className="font-georgia text-base font-semibold text-white mb-0.5">
          {"Analyzing your "}
          <Text className="font-georgia text-base font-semibold italic text-teal">
            health entry
          </Text>
        </Text>

        <View className="gap-2">
          {steps.map((step, i) => (
            <View key={i} className="flex-row items-center gap-2.5">
              {/* borderWidth 1.5 has no standard Tailwind step — inline style only for width */}
              <View
                className={`w-5 h-5 rounded-full items-center justify-center ${
                  step.done ? "border-teal" : "border-dim"
                }`}
                style={{
                  borderWidth: 1.5,
                  ...(step.done
                    ? { backgroundColor: "rgba(52,211,153,0.14)" }
                    : {}),
                }}
              >
                {step.done ? (
                  <Text className="font-code text-[11px] font-bold text-teal">
                    ✓
                  </Text>
                ) : (
                  <View className="w-1.5 h-1.5 rounded-full bg-dim" />
                )}
              </View>
              <Text className="font-code text-[12px] text-white flex-1">
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function PrivacyIllustration() {
  const members = [
    { initial: "Y", bg: colors.accentBlue },
    { initial: "M", bg: colors.successGreen },
    { initial: "S", bg: colors.warningAmber },
  ];
  return (
    <View className="items-center w-full">
      {/* Shield card — teal rgba border not in theme */}
      <View
        className="bg-card rounded-5 p-5 w-full items-center gap-2.5"
        style={{ borderWidth: 1, borderColor: "rgba(52,211,153,0.22)" }}
      >
        {/* Lock icon ring — rgba bg not in theme */}
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-0.5"
          style={{
            backgroundColor: "rgba(52,211,153,0.12)",
            borderWidth: 1,
            borderColor: "rgba(52,211,153,0.28)",
          }}
        >
          <Text className="text-[30px]">🔒</Text>
        </View>

        <Text className="font-code text-[11px] font-semibold tracking-[1.3px] text-teal text-center">
          NO CLOUD · NO SERVERS
        </Text>
        <Text className="font-georgia text-[13px] text-dim text-center">
          Direct device-to-device connection
        </Text>

        {/* Family avatars — bg color, marginLeft, and zIndex are all runtime values */}
        <View className="flex-row items-center gap-2.5 mt-1">
          <View className="flex-row">
            {members.map((m, i) => (
              <View
                key={i}
                className="w-8.5 h-8.5 rounded-full items-center justify-center"
                style={{
                  backgroundColor: m.bg,
                  marginLeft: i > 0 ? -10 : 0,
                  zIndex: members.length - i,
                  borderWidth: 2,
                  borderColor: colors.bgCard,
                }}
              >
                <Text className="font-georgia text-[13px] font-bold text-surface">
                  {m.initial}
                </Text>
              </View>
            ))}
          </View>
          <Text className="font-code text-[11px] tracking-[0.4px] text-dim flex-1">
            Family Circle · P2P Mesh
          </Text>
        </View>
      </View>
    </View>
  );
}

const ILLUSTRATIONS: Record<IllustrationType, React.FC> = {
  welcome: WelcomeIllustration,
  voice: VoiceIllustration,
  analysis: AnalysisIllustration,
  privacy: PrivacyIllustration,
};

// ── Slide item ────────────────────────────────────────────────────────────────

function SlideItem({ slide, width }: { slide: Slide; width: number }) {
  const Illustration = ILLUSTRATIONS[slide.illustration];
  return (
    // width is a runtime value from useWindowDimensions — must be inline
    <View className="flex-1 px-6" style={{ width }}>
      <View className="flex-1 justify-center items-center min-h-60">
        <Illustration />
      </View>
      <View className="pt-2 pb-4 gap-2.5">
        <Text
          className={`font-code text-[11px] font-semibold tracking-[1.6px] ${
            slide.labelColor === "teal" ? "text-teal" : "text-brand"
          }`}
        >
          {slide.label}
        </Text>
        <Text className="font-georgia text-[32px] font-bold text-white leading-10">
          {slide.title}
          {"\n"}
          <Text className="font-georgia text-[32px] font-bold italic text-teal">
            {slide.titleAccent}
          </Text>
        </Text>
        <Text className="font-georgia text-[15px] text-dim leading-6">
          {slide.description}
        </Text>
      </View>
    </View>
  );
}

// ── Pagination dots ───────────────────────────────────────────────────────────

function PaginationDots({ total, active }: { total: number; active: number }) {
  return (
    <View className="flex-row gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-1.5 rounded-full ${
            i === active ? "w-6 bg-brand" : "w-1.5 bg-ghost"
          }`}
        />
      ))}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
      setActiveIndex(newIndex);
    },
    [width]
  );

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const nextIndex = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    } else {
      router.back();
    }
  };

  const handleSkip = () => router.back();

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    // SafeAreaView — className not supported, inline style required
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bgPrimary }}
      edges={["top", "bottom"]}
    >
      {/* ── Header ── */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <View className="flex-row items-center gap-2.5">
          <Image
            source={images.appIcon}
            className="w-7.5 h-7.5 rounded-lg"
            resizeMode="contain"
          />
          <Text className="font-georgia text-xl font-bold italic text-teal">
            MedVoice
          </Text>
        </View>
        {!isLast && (
          <TouchableOpacity
            onPress={handleSkip}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text className="font-code text-[11px] font-semibold tracking-[1.4px] text-ghost">
              SKIP
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Slides ── */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {SLIDES.map((slide) => (
          <SlideItem key={slide.id} slide={slide} width={width} />
        ))}
      </ScrollView>

      {/* ── Footer ── */}
      <View className="px-6 pb-2 pt-3 items-center gap-4">
        <PaginationDots total={SLIDES.length} active={activeIndex} />
        <TouchableOpacity
          onPress={handleNext}
          className={`w-full rounded-3.5 py-4 items-center justify-center min-h-13 ${
            isLast ? "bg-teal" : "bg-brand"
          }`}
          activeOpacity={0.85}
        >
          <Text className="font-georgia text-base font-bold text-surface">
            {isLast ? "Get Started" : "Next  →"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
