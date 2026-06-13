import type { HealthEntry } from './health';

export type ConnectionStatus = 'online' | 'offline' | 'pending';

// A health summary received from a family member via P2P, tagged with the
// public key of the peer it came from so Care View can filter per person.
export type SyncedEntry = HealthEntry & { fromKey: string };

export type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  publicKey: string;
  connectionStatus: ConnectionStatus;
  lastSynced: string | null;
  // User consent: only when true do we send this member our health entries.
  shareEnabled: boolean;
};
