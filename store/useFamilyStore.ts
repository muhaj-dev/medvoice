import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FamilyMember, ConnectionStatus } from '@/types/family';

const FAMILY_KEY = '@medvoice:v2:family';

type FamilyStore = {
  members: FamilyMember[];
  addMember: (member: FamilyMember) => Promise<void>;
  updateMemberStatus: (id: string, status: ConnectionStatus) => void;
  loadFromStorage: () => Promise<void>;
};

export const useFamilyStore = create<FamilyStore>((set, get) => ({
  members: [],

  addMember: async (member) => {
    const next = [...get().members, member];
    set({ members: next });
    await AsyncStorage.setItem(FAMILY_KEY, JSON.stringify(next));
  },

  updateMemberStatus: (id, status) => {
    set((state) => ({
      members: state.members.map((m) =>
        m.id === id ? { ...m, connectionStatus: status } : m
      ),
    }));
  },

  loadFromStorage: async () => {
    const raw = await AsyncStorage.getItem(FAMILY_KEY);
    if (raw) set({ members: JSON.parse(raw) as FamilyMember[] });
  },
}));
