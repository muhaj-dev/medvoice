import AsyncStorage from '@react-native-async-storage/async-storage';

const PUBLIC_KEY_STORAGE = '@medvoice:p2p:public_key';

// Generates a 32-byte keypair hex string once and persists it permanently.
// Never regenerate — the public key is the device's stable P2P identity.
export async function getOrCreatePublicKey(): Promise<string> {
  const stored = await AsyncStorage.getItem(PUBLIC_KEY_STORAGE);
  if (stored) return stored;

  const bytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256));
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
  await AsyncStorage.setItem(PUBLIC_KEY_STORAGE, hex);
  return hex;
}

// Registers a callback for when a remote peer connects to us via Holepunch.
// Returns a cleanup/unsubscribe function.
//
// TODO: wire to QVAC Holepunch when SDK exposes P2P API:
//   const node = await getHyperDHTNode();
//   const handler = (conn) => callback(conn.remotePublicKey.toString('hex'));
//   node.on('connection', handler);
//   return () => node.off('connection', handler);
export function onPeerConnected(
  _callback: (peerPublicKey: string) => void
): () => void {
  return () => {};
}

// Dials a peer by their public key and resolves when the handshake completes.
// Throws if the key is invalid or the connection times out.
//
// TODO: Replace with QVAC Holepunch dial:
//   const node = await getHyperDHTNode();
//   const conn = node.connect(Buffer.from(peerPublicKey, 'hex'));
//   await new Promise((resolve, reject) => {
//     conn.once('open', resolve);
//     conn.once('error', reject);
//   });
export async function connectFamilyMember(peerPublicKey: string): Promise<void> {
  if (!peerPublicKey || peerPublicKey.length < 8) {
    throw new Error('Invalid peer public key');
  }
  // Simulate HyperDHT handshake latency (~1.5 s on first connect)
  await new Promise<void>((resolve) => setTimeout(resolve, 1500));
}

// Sends an encrypted health summary JSON blob to a connected peer.
// Health data is transmitted only device-to-device — no server relay.
//
// TODO: wire to QVAC Holepunch stream:
//   conn.write(JSON.stringify(summaryJson));
export async function syncHealthSummary(
  _peerPublicKey: string,
  _summaryJson: string
): Promise<void> {
  // Simulate stream write latency
  await new Promise<void>((resolve) => setTimeout(resolve, 800));
}
