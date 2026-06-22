/**
 * onboarding screen strings (English source). Filled per-feature; merged into
 * EN_STRINGS by constants/strings.ts. Keys are namespaced "onboarding.*".
 */
export const onboardingStrings = {
  // welcome.tsx
  "onboarding.feature.speak": "Speak naturally about how you feel",
  "onboarding.feature.analyze": "MedPsy AI analyzes your health locally",
  "onboarding.feature.share": "Share with family via private P2P",
  "onboarding.welcome.tagline": "Your Private Health Companion",
  "onboarding.welcome.subtitle":
    "AI-powered health insights that live entirely on your phone. Your data never leaves your device. Ever.",
  "onboarding.welcome.getStarted": "GET STARTED →",

  // role.tsx
  "onboarding.role.patient.title": "I am tracking my own health",
  "onboarding.role.patient.description":
    "Log daily symptoms, get AI insights, stay on top of your wellbeing",
  "onboarding.role.caregiver.title": "I am caring for a family member",
  "onboarding.role.caregiver.description":
    "Monitor a loved one's health, receive updates, stay connected privately",
  "onboarding.role.headingLine1": "How will you use",
  "onboarding.role.headingLine2": "MedVoice?",
  "onboarding.role.subtitle": "We'll personalise the app for you.",

  // profile.tsx
  "onboarding.profile.headingLine1": "Tell us about",
  "onboarding.profile.headingLine2": "yourself",
  "onboarding.profile.subtitle": "Stored only on your device. Never shared.",
  "onboarding.profile.nameLabel": "YOUR NAME *",
  "onboarding.profile.ageLabel": "AGE *",
  "onboarding.profile.conditionsLabel": "KNOWN CONDITIONS (OPTIONAL)",
  "onboarding.profile.conditionsPlaceholder": "e.g. Type 2 diabetes, arthritis",
  "onboarding.profile.medicationsLabel": "CURRENT MEDICATIONS (OPTIONAL)",
  "onboarding.profile.medicationsPlaceholder": "e.g. Metformin 500mg",
  "onboarding.profile.submit": "LET'S GO 🎉",

  // OnboardingNavButtons.tsx
  "onboarding.nav.continue": "CONTINUE →",
  "onboarding.nav.back": "← BACK",
} as const;
