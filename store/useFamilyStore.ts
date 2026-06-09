import { create } from 'zustand';
import {
  insertFamilyMember,
  loadAllFamilyMembers,
  deleteFamilyMember,
} from '@/lib/db';
import { syncHealthSummary, onIncomingSummary } from '@/lib/p2p';
import type { FamilyMember, ConnectionStatus } from '@/types/family';
import type { HealthEntry } from '@/types/health';

// Strip everything except the summary fields — never send audio or embeddings.
function toSummary(entry: HealthEntry): HealthEntry {
  return {
    id: entry.id,
    timestamp: entry.timestamp,
    transcript: entry.transcript,
    analysis: entry.analysis,
    tags: entry.tags,
    severity: entry.severity,
  };
}

let receiverStarted = false;

type FamilyStore = {
  members: FamilyMember[];
  // Health entries synced from a connected family member via P2P
  syncedEntries: HealthEntry[];
  addMember: (member: FamilyMember) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  updateMemberStatus: (id: string, status: ConnectionStatus) => void;
  setSyncedEntries: (entries: HealthEntry[]) => void;
  loadFromDb: () => Promise<void>;
  // Push a saved entry's summary to every connected member (patient side).
  broadcastEntry: (entry: HealthEntry) => Promise<void>;
  // Start listening for summaries pushed by family members (caregiver side).
  startReceiving: () => void;
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

  broadcastEntry: async (entry) => {
    const json = JSON.stringify(toSummary(entry));
    const members = get().members;
    // Non-blocking: a member who is offline simply doesn't receive it now.
    await Promise.allSettled(
      members.map((m) => syncHealthSummary(m.publicKey, json))
    );
  },

  startReceiving: () => {
    if (receiverStarted) return;
    receiverStarted = true;
    onIncomingSummary((_from, summaryJson) => {
      try {
        const entry = JSON.parse(summaryJson) as HealthEntry;
        set((state) => {
          const exists = state.syncedEntries.some((e) => e.id === entry.id);
          const syncedEntries = exists
            ? state.syncedEntries.map((e) => (e.id === entry.id ? entry : e))
            : [entry, ...state.syncedEntries];
          return { syncedEntries };
        });
      } catch {
        /* ignore malformed summary */
      }
    });
  },
}));
