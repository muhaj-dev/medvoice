export type OnboardingFeature = {
  icon: string;
  title: string;
  description: string;
};

export type OnboardingRole = {
  id: "patient" | "caregiver";
  label: string;
  description: string;
  icon: string;
};

export const WELCOME_FEATURES: OnboardingFeature[] = [
  {
    icon: "🎙",
    title: "Voice Health Tracking",
    description: "Speak your health updates naturally — transcribed on device",
  },
  {
    icon: "🧠",
    title: "Private AI Analysis",
    description: "MedPsy analyzes patterns entirely on your phone, never in the cloud",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family Sharing",
    description: "Share summaries directly with family via encrypted P2P — no server",
  },
];

export const ONBOARDING_ROLES: OnboardingRole[] = [
  {
    id: "patient",
    label: "Patient",
    description: "Track my own health and share with family or caregivers",
    icon: "🏠",
  },
  {
    id: "caregiver",
    label: "Caregiver",
    description: "Monitor a loved one's health updates shared with me",
    icon: "🫂",
  },
];
