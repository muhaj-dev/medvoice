import AsyncStorage from '@react-native-async-storage/async-storage';

const PUBLIC_KEY_STORAGE = '@medvoice:p2p:public_key';

// Placeholder key generator — replaced by QVAC Holepunch in production.
// Key is generated once and stored permanently (never regenerated per P2P rules).
export async function getOrCreatePublicKey(): Promise<string> {
  const stored = await AsyncStorage.getItem(PUBLIC_KEY_STORAGE);
  if (stored) return stored;

  const bytes = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256)
  );
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  await AsyncStorage.setItem(PUBLIC_KEY_STORAGE, hex);
  return hex;
}

// Registers a callback for when a P2P peer connects via Holepunch.
// Returns a cleanup function. TODO: wire to QVAC Holepunch events.
export function onPeerConnected(
  _callback: (peerPublicKey: string) => void
): () => void {
  return () => {};
}

// Initiates a P2P connection to a peer by their public key.
// TODO: wire to QVAC Holepunch dial in production.
export async function connectFamilyMember(_peerPublicKey: string): Promise<void> {
  // Holepunch connection initiated here
}
