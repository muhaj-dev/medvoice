export type ConnectionStatus = 'online' | 'offline' | 'pending';

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
