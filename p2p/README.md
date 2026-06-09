# MedVoice P2P (QVAC Holepunch)

Real device-to-device family health sharing over **HyperDHT** (Holepunch).

## How it works

`hyperdht` needs UDP sockets and Bare runtime globals, so it cannot run on React
Native's JS thread. Instead:

- **`worklet.mjs`** — the Bare worklet. Runs the real HyperDHT node: derives a
  keypair from a persisted seed, listens for incoming peers, dials peers by
  public key, and exchanges health-summary JSON. Bridged to RN over IPC
  (newline-delimited JSON).
- **`p2p.bundle.mjs`** — `worklet.mjs` packed (with its native-addon graph) by
  `bare-pack`. This is what `react-native-bare-kit` loads on device.
- **`lib/p2p.ts`** — the RN-side bridge. Starts the worklet, persists the seed,
  and exposes `getOrCreatePublicKey` / `connectFamilyMember` /
  `syncHealthSummary` / `onPeerConnected` / `onIncomingSummary`.

Privacy: only summary JSON (transcript, analysis, tags, severity) ever crosses
the wire — **never raw audio or embeddings**. The DHT is used only for peer
discovery; no server sees health data.

## Regenerating the bundle

Whenever `worklet.mjs` changes, regenerate the bundle:

```bash
npm run bundle:p2p
```

This produces a **single bundle targeting both Android and iOS** (all Android
ABIs + iOS device/simulator). The Bare runtime picks the matching host at load
time, so no per-platform swapping is needed.

> **How it works:** `--linked` records native addon references (sodium-native,
> udx-native) per host. These addons are already linked into the app by the QVAC
> Expo plugin — they're allowlisted in `qvac/addons.manifest.json` — so no extra
> native config is required. bare-pack only records references (no compilation),
> so it runs fine from any OS, including Windows.

## Requirements to run P2P for real

P2P needs the native `react-native-bare-kit` module, so it only works in a
**development/production build** — not Expo Go:

```bash
npx expo prebuild
npx expo run:ios      # or run:android, or an EAS dev build
```

In Expo Go (or any build without bare-kit), `lib/p2p.ts` degrades gracefully:
the Show Code screen still renders a local placeholder key, and connect/sync
throw a clear "P2P requires a development build" error instead of crashing.

## Testing

Requires **two physical devices** (the DHT needs real networking):

1. Device A → Family → Show My Code (displays its public key as a QR).
2. Device B → Family → Scan Code (scans A's QR, dials A).
3. A receives the incoming peer, names B; both store each other.
4. On A, record + save a health entry → its summary pushes to B.
5. On B, open Care View → the synced summary appears.
