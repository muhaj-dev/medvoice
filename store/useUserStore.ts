import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserProfile } from "@/types/user";

const PROFILE_KEY = "@medvoice:v2:profile";
const ONBOARDING_KEY = "@medvoice:v2:onboarding";

type UserStore = {
  profile: UserProfile | null;
  onboardingComplete: boolean;
  setProfile: (profile: UserProfile) => void;
  completeOnboarding: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,
  onboardingComplete: false,

  setProfile: (profile) => set({ profile }),

  completeOnboarding: async () => {
    const { profile } = get();
    if (profile) {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    set({ onboardingComplete: true });
  },

  loadFromStorage: async () => {
    const [profileRaw, onboardingRaw] = await Promise.all([
      AsyncStorage.getItem(PROFILE_KEY),
      AsyncStorage.getItem(ONBOARDING_KEY),
    ]);
    set({
      profile: profileRaw ? (JSON.parse(profileRaw) as UserProfile) : null,
      onboardingComplete: onboardingRaw === "true",
    });
  },
}));
