/**
 * QVAC Holepunch P2P bridge.
 *
 * hyperdht needs UDP sockets + Bare globals, so the real Holepunch node runs in
 * a Bare worklet (p2p/worklet.mjs, bundled to p2p/p2p.bundle.mjs). This module
 * talks to that worklet over IPC and exposes a small async API to the app.
 *
 * Privacy: only health *summary* JSON is ever sent — never raw audio or
 * embeddings — and it travels device-to-device. The DHT is used purely for
 * peer discovery; no server sees health data.
 *
 * Graceful degradation: in Expo Go or any build without the native bare-kit
 * runtime / generated bundle, the bridge reports unavailable. The QR screen
 * still renders a stable local key; connect/sync throw a clear error.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const SEED_STORAGE = "@medvoice:p2p:seed";
const FALLBACK_KEY = "@medvoice:p2p:fallback_key";

type PeerListener = (peerPublicKey: string) => void;
type SummaryListener = (fromPublicKey: string, summaryJson: string) => void;

type IPCStream = {
  on: (event: "data", cb: (data: Uint8Array) => void) => void;
  write: (data: Uint8Array) => void;
};
type WorkletInstance = {
  start: (filename: string, source: string) => void;
  IPC: IPCStream;
};

type Bridge = { ipc: IPCStream; publicKey: string };

const peerListeners = new Set<PeerListener>();
const summaryListeners = new Set<SummaryListener>();
const pending = new Map<string, { resolve: () => void; reject: (e: Error) => void }>();

let readyResolve: ((publicKey: string) => void) | null = null;
let bridgePromise: Promise<Bridge | null> | null = null;
let available = false;
let reqCounter = 0;

const encoder = new TextEncoder();
const encode = (s: string) => encoder.encode(s);

/** Frame newline-delimited JSON off a raw byte stream. */
function makeLineReader(onLine: (line: string) => void) {
  // Dedicated streaming decoder so multibyte UTF-8 split across chunks is
  // preserved (decode keeps partial sequences buffered until the next chunk).
  const decoder = new TextDecoder();
  let buf = "";
  return (data: Uint8Array) => {
    buf += decoder.decode(data, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line) onLine(line);
    }
  };
}

function handleLine(line: string) {
  let msg: { type?: string; [k: string]: unknown };
  try {
    msg = JSON.parse(line);
  } catch {
    return;
  }
  switch (msg.type) {
    case "ready": {
      const publicKey = String(msg.publicKey ?? "");
      const seed = msg.seed ? String(msg.seed) : null;
      if (seed) AsyncStorage.setItem(SEED_STORAGE, seed).catch(() => {});
      readyResolve?.(publicKey);
      readyResolve = null;
      break;
    }
    case "result": {
      const id = String(msg.id ?? "");
      const p = pending.get(id);
      if (p) {
        pending.delete(id);
        if (msg.ok) p.resolve();
        else p.reject(new Error(String(msg.error ?? "P2P request failed")));
      }
      break;
    }
    case "peer":
      peerListeners.forEach((l) => l(String(msg.from ?? "")));
      break;
    case "incoming":
      summaryListeners.forEach((l) =>
        l(String(msg.from ?? ""), String(msg.summary ?? ""))
      );
      break;
  }
}

async function startBridge(): Promise<Bridge | null> {
  let WorkletCtor: new () => WorkletInstance;
  let bundle: string;
  try {
    // Dynamic require so a missing native module / bundle degrades gracefully.
    WorkletCtor = require("react-native-bare-kit").Worklet;
    const mod = require("../p2p/p2p.bundle.mjs");
    bundle = (mod?.default ?? mod) as string;
  } catch {
    return null; // bare-kit or bundle not present (e.g. Expo Go)
  }

  try {
    const worklet = new WorkletCtor();
    worklet.start("/p2p.bundle", bundle);
    const ipc = worklet.IPC;
    ipc.on("data", makeLineReader(handleLine));

    const seed = await AsyncStorage.getItem(SEED_STORAGE);
    const publicKey = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        readyResolve = null;
        reject(new Error("P2P init timed out"));
      }, 15000);
      readyResolve = (key) => {
        clearTimeout(timer);
        resolve(key);
      };
      ipc.write(encode(JSON.stringify({ type: "init", seed: seed ?? undefined }) + "\n"));
    });

    available = true;
    return { ipc, publicKey };
  } catch {
    return null;
  }
}

function getBridge(): Promise<Bridge | null> {
  if (!bridgePromise) bridgePromise = startBridge();
  return bridgePromise;
}

function request(ipc: IPCStream, type: string, payload: Record<string, string>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const id = String(++reqCounter);
    pending.set(id, { resolve, reject });
    setTimeout(() => {
      if (pending.delete(id)) reject(new Error(`P2P ${type} timed out`));
    }, 20000);
    ipc.write(encode(JSON.stringify({ type, id, ...payload }) + "\n"));
  });
}

// ── Public API ───────────────────────────────────────────────────────────────

/** True once the Holepunch node is live (i.e. a real dev build with bare-kit). */
export function isP2PAvailable(): boolean {
  return available;
}

/**
 * The device's stable public key (derived from a seed persisted on first launch
 * and never regenerated). Falls back to a local placeholder when P2P is
 * unavailable so the Show Code screen still renders.
 */
export async function getOrCreatePublicKey(): Promise<string> {
  const bridge = await getBridge();
  if (bridge) return bridge.publicKey;
  return getFallbackKey();
}

/** Register a callback fired when a remote peer dials us. Returns an unsubscribe. */
export function onPeerConnected(callback: PeerListener): () => void {
  peerListeners.add(callback);
  void getBridge(); // ensure the node is listening
  return () => peerListeners.delete(callback);
}

/** Register a callback fired when a peer pushes a health summary to us. */
export function onIncomingSummary(callback: SummaryListener): () => void {
  summaryListeners.add(callback);
  void getBridge();
  return () => summaryListeners.delete(callback);
}

/** Dial a peer by public key; resolves when the encrypted handshake completes. */
export async function connectFamilyMember(peerPublicKey: string): Promise<void> {
  if (!peerPublicKey || peerPublicKey.length < 8) {
    throw new Error("Invalid peer public key");
  }
  const bridge = await getBridge();
  if (!bridge) {
    throw new Error("P2P requires a development build (Holepunch runtime unavailable).");
  }
  await request(bridge.ipc, "connect", { peerKey: peerPublicKey });
}

/** Send an encrypted health summary (JSON only) to a connected peer. */
export async function syncHealthSummary(
  peerPublicKey: string,
  summaryJson: string
): Promise<void> {
  const bridge = await getBridge();
  if (!bridge) {
    throw new Error("P2P unavailable — cannot sync health summary.");
  }
  await request(bridge.ipc, "sync", { peerKey: peerPublicKey, summary: summaryJson });
}

// ── Fallback (no native runtime) ─────────────────────────────────────────────

async function getFallbackKey(): Promise<string> {
  const stored = await AsyncStorage.getItem(FALLBACK_KEY);
  if (stored) return stored;
  const bytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256));
  const hex = bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
  await AsyncStorage.setItem(FALLBACK_KEY, hex);
  return hex;
}
