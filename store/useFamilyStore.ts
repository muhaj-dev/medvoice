import { create } from 'zustand';
import {
  insertFamilyMember,
  loadAllFamilyMembers,
  deleteFamilyMember,
  insertSyncedEntry,
  loadAllSyncedEntries,
} from '@/lib/db';
import {
  syncHealthSummary,
  onIncomingSummary,
  onPeerConnected,
  onPeerDisconnected,
  connectFamilyMember,
} from '@/lib/p2p';
import { useHealthStore } from '@/store/useHealthStore';
import type { FamilyMember, ConnectionStatus, SyncedEntry } from '@/types/family';
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

// A peer backfills its history the moment the handshake completes — often
// before the local user has finished naming them in the confirm modal. Hold
// those entries here and flush them once addMember recognizes the peer.
// Never persisted or displayed until the user confirms the member.
const pendingUnknown = new Map<string, HealthEntry[]>();
const MAX_PENDING_PER_PEER = 500;

// A peer can send arbitrary bytes — runtime-validate the shape of an incoming
// summary before trusting it as a HealthEntry.
function isValidSummary(value: unknown): value is HealthEntry {
  if (!value || typeof value !== 'object') return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.timestamp === 'string' &&
    typeof e.transcript === 'string' &&
    typeof e.analysis === 'string' &&
    Array.isArray(e.tags)
  );
}

const byNewest = (a: HealthEntry, b: HealthEntry) =>
  b.timestamp.localeCompare(a.timestamp);

// Public keys can drift in case/whitespace between a scanned or typed code and
// the key on the wire. Match on a normalized form everywhere so an incoming
// summary is never dropped just because its key isn't byte-identical.
const normKey = (k: string | undefined) => (k ?? '').trim().toLowerCase();

// Outcome of pushing local history to a peer — surfaced to the UI so a failed
// or empty sync is visible instead of silent.
export type SyncResult = { sent: number; total: number; ok: boolean };

type FamilyStore = {
  members: FamilyMember[];
  // Health entries synced from connected family members via P2P. Each carries
  // `fromKey` so Care View can show one member's entries at a time.
  syncedEntries: SyncedEntry[];
  addMember: (member: FamilyMember) => Promise<void>;
  // Edit a connected member's details (name, relationship, sharing) — persisted.
  updateMember: (
    id: string,
    updates: Partial<Pick<FamilyMember, 'name' | 'relationship' | 'shareEnabled'>>
  ) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  updateMemberStatus: (id: string, status: ConnectionStatus) => void;
  setSyncedEntries: (entries: SyncedEntry[]) => void;
  loadFromDb: () => Promise<void>;
  // Push a saved entry's summary to every connected member (patient side).
  broadcastEntry: (entry: HealthEntry) => Promise<void>;
  // Push the full local history to one peer (after connect/reconnect) so
  // entries recorded before the connection are also shared. Reports how many
  // of the local entries were delivered and whether the peer was reachable.
  syncHistoryTo: (peerPublicKey: string) => Promise<SyncResult>;
  // Dial every known member to learn who is actually reachable right now.
  refreshConnections: () => Promise<void>;
  // Start listening for summaries pushed by family members (caregiver side).
  startReceiving: () => void;
};

export const useFamilyStore = create<FamilyStore>((set, get) => {
  // Persist + merge received entries, newest first. Tagged with the sender's
  // key and deduped by (sender, id) — NOT id alone — so two different members
  // whose entries share an id don't overwrite each other (which would make Care
  // View show one person's history under both names).
  const acceptEntries = (fromKey: string, entries: HealthEntry[]) => {
    entries.forEach((entry) => void insertSyncedEntry(fromKey, entry));
    set((state) => {
      const byKey = new Map(state.syncedEntries.map((e) => [`${e.fromKey}|${e.id}`, e]));
      entries.forEach((e) => byKey.set(`${fromKey}|${e.id}`, { ...e, fromKey }));
      return { syncedEntries: [...byKey.values()].sort(byNewest) };
    });
  };

  return {
    members: [],
    syncedEntries: [],

    setSyncedEntries: (entries) => set({ syncedEntries: entries }),

    addMember: async (member) => {
      await insertFamilyMember(member);
      set((state) => ({ members: [...state.members, member] }));
      // Flush any summaries this peer pushed while the confirm modal was open.
      const nk = normKey(member.publicKey);
      const held = pendingUnknown.get(nk);
      if (held) {
        pendingUnknown.delete(nk);
        acceptEntries(member.publicKey, held);
      }
    },

    updateMember: async (id, updates) => {
      const member = get().members.find((m) => m.id === id);
      if (!member) return;
      const updated = { ...member, ...updates };
      await insertFamilyMember(updated); // INSERT OR REPLACE — persists the edit
      set((state) => ({
        members: state.members.map((m) => (m.id === id ? updated : m)),
      }));
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
      const [members, syncedEntries] = await Promise.all([
        loadAllFamilyMembers(),
        loadAllSyncedEntries(),
      ]);
      // Stored statuses are stale by definition — show offline until a live
      // connection proves otherwise (refreshConnections / onPeerConnected).
      set({
        members: members.map((m) => ({ ...m, connectionStatus: 'offline' as const })),
        syncedEntries,
      });
      void get().refreshConnections();
    },

    broadcastEntry: async (entry) => {
      const json = JSON.stringify(toSummary(entry));
      // Only members the user explicitly agreed to share with.
      const members = get().members.filter((m) => m.shareEnabled);
      // Non-blocking: a member who is offline simply doesn't receive it now.
      await Promise.allSettled(
        members.map((m) => syncHealthSummary(m.publicKey, json))
      );
    },

    refreshConnections: async () => {
      // All dials in parallel — an offline peer times out (~20s) without
      // blocking the others. Status updates land as each dial resolves.
      await Promise.allSettled(
        get().members.map(async (m) => {
          try {
            await connectFamilyMember(m.publicKey);
            get().updateMemberStatus(m.id, 'online');
            // Catch them up on anything recorded while we were apart.
            if (m.shareEnabled) void get().syncHistoryTo(m.publicKey);
          } catch {
            get().updateMemberStatus(m.id, 'offline');
          }
        })
      );
    },

    syncHistoryTo: async (peerPublicKey) => {
      // Oldest first, one at a time — keeps the stream orderly and avoids
      // flooding the connection with a large history.
      const entries = [...useHealthStore.getState().entries].sort(
        (a, b) => a.timestamp.localeCompare(b.timestamp)
      );
      let sent = 0;
      for (const entry of entries) {
        try {
          await syncHealthSummary(peerPublicKey, JSON.stringify(toSummary(entry)));
          sent += 1;
        } catch (e) {
          // Peer dropped mid-backfill — the next reconnect retries the rest.
          console.warn(`[p2p] syncHistoryTo: sent ${sent}/${entries.length} then failed:`, e);
          return { sent, total: entries.length, ok: false };
        }
      }
      console.log(`[p2p] syncHistoryTo: delivered ${sent}/${entries.length} to ${peerPublicKey.slice(0, 12)}…`);
      return { sent, total: entries.length, ok: true };
    },

    startReceiving: () => {
      if (receiverStarted) return;
      receiverStarted = true;

      onIncomingSummary((from, summaryJson) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(summaryJson);
        } catch {
          return; // malformed JSON
        }
        if (!isValidSummary(parsed)) {
          console.warn('Ignoring malformed summary payload');
          return;
        }
        const entry = parsed;
        const member = get().members.find((m) => normKey(m.publicKey) === normKey(from));
        if (!member) {
          // Unknown peer: hold until the user confirms them as a member.
          const nk = normKey(from);
          const held = pendingUnknown.get(nk) ?? [];
          if (held.length < MAX_PENDING_PER_PEER) {
            pendingUnknown.set(nk, [...held, entry]);
          }
          console.log(`[p2p] incoming from unknown peer ${from.slice(0, 12)}… — held (${held.length + 1})`);
          return;
        }
        // Tag with the member's stored key so Care View's filter matches.
        console.log(`[p2p] incoming accepted from ${member.name} (${from.slice(0, 12)}…)`);
        acceptEntries(member.publicKey, [entry]);
      });

      // A known member reconnected: mark them online and — if the user agreed
      // to share with them — backfill anything recorded while apart.
      onPeerConnected((from) => {
        const member = get().members.find((m) => normKey(m.publicKey) === normKey(from));
        if (!member) return; // first-time connect — Show Code screen handles it
        get().updateMemberStatus(member.id, 'online');
        if (member.shareEnabled) void get().syncHistoryTo(member.publicKey);
      });

      // Their socket dropped (app closed, network lost) — show offline.
      onPeerDisconnected((from) => {
        const member = get().members.find((m) => normKey(m.publicKey) === normKey(from));
        if (member) get().updateMemberStatus(member.id, 'offline');
      });
    },
  };
});
