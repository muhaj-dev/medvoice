import { create } from 'zustand';
import {
  insertFamilyMember,
  loadAllFamilyMembers,
  deleteFamilyMember,
} from '@/lib/db';
import type { FamilyMember, ConnectionStatus } from '@/types/family';
import type { HealthEntry } from '@/types/health';

type FamilyStore = {
  members: FamilyMember[];
  // Health entries synced from a connected family member via P2P
  syncedEntries: HealthEntry[];
  addMember: (member: FamilyMember) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  updateMemberStatus: (id: string, status: ConnectionStatus) => void;
  setSyncedEntries: (entries: HealthEntry[]) => void;
  loadFromDb: () => Promise<void>;
};

export const useFamilyStore = create<FamilyStore>((set, get) => ({
  members: [],
  syncedEntries: [],

  setSyncedEntries: (entries) => set({ syncedEntries: entries }),

  addMember: async (member) => {
    await insertFamilyMember(member);
    set((state) => ({ members: [...state.members, member] }));
  },

  removeMember: async (id) => {
    await deleteFamilyMember(id);
    set((state) => ({ members: state.members.filter((m) => m.id !== id) }));
  },

  updateMemberStatus: (id, status) => {
    set((state) => ({
      members: state.members.map((m) =>
        m.id === id ? { ...m, connectionStatus: status } : m
      ),
    }));
  },

  loadFromDb: async () => {
    const members = await loadAllFamilyMembers();
    set({ members });
  },
}));
