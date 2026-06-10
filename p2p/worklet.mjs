/* global BareKit */
/**
 * MedVoice P2P worklet — runs inside the Bare runtime (react-native-bare-kit).
 *
 * hyperdht / hypercore-crypto need UDP sockets + Bare globals, so they cannot
 * run on React Native's JS thread. This worklet hosts the real Holepunch node
 * and bridges to RN over IPC using newline-delimited JSON messages.
 *
 * Privacy: only health *summary* JSON crosses the wire — never raw audio or
 * embeddings — and it travels device-to-device through HyperDHT. No server
 * ever sees health data (the DHT is used only for peer discovery).
 *
 * Protocol (RN -> worklet), one JSON object per line:
 *   { type:'init',    seed?:hex }                    -> reply 'ready'
 *   { type:'connect', peerKey:hex, id:string }       -> reply 'result'
 *   { type:'sync',    peerKey:hex, summary:string, id:string } -> reply 'result'
 *
 * Protocol (worklet -> RN), one JSON object per line:
 *   { type:'ready',    publicKey:hex, seed:hex }
 *   { type:'result',   id:string, ok:boolean, error?:string }
 *   { type:'peer',     from:hex }                     // a peer dialed us
 *   { type:'incoming', from:hex, summary:string }     // a peer sent a summary
 */
import DHT from "hyperdht";
import crypto from "hypercore-crypto";
import b4a from "b4a";

const { IPC } = BareKit;

let node = null;
let server = null;
let keyPair = null;
const connections = new Map(); // peerHex -> socket

function send(obj) {
  IPC.write(b4a.from(JSON.stringify(obj) + "\n"));
}

// Frame newline-delimited JSON off a raw byte stream. Buffers *bytes* (not
// decoded strings) so multibyte UTF-8 split across chunks is never corrupted —
// each complete line is decoded only once its full byte sequence has arrived.
function lineReader(onLine) {
  let buf = b4a.alloc(0);
  return (data) => {
    buf = b4a.concat([buf, data]);
    let idx;
    while ((idx = buf.indexOf(0x0a)) !== -1) {
      const line = b4a.toString(buf.slice(0, idx));
      buf = buf.slice(idx + 1);
      if (line) onLine(line);
    }
  };
}

function track(socket, peerHex) {
  connections.set(peerHex, socket);
  socket.on(
    "data",
    lineReader((line) => {
      try {
        const msg = JSON.parse(line);
        if (msg.type === "summary") {
          send({ type: "incoming", from: peerHex, summary: msg.summary });
        }
      } catch {
        /* ignore malformed frames */
      }
    })
  );
  socket.on("close", () => connections.delete(peerHex));
  socket.on("error", () => connections.delete(peerHex));
}

async function dial(peerHex) {
  let socket = connections.get(peerHex);
  if (socket) return socket;
  socket = node.connect(b4a.from(peerHex, "hex"));
  await new Promise((resolve, reject) => {
    socket.once("open", resolve);
    socket.once("error", reject);
  });
  track(socket, peerHex);
  return socket;
}

async function init(seedHex) {
  const seed = seedHex ? b4a.from(seedHex, "hex") : crypto.randomBytes(32);
  keyPair = DHT.keyPair(seed);
  node = new DHT();
  server = node.createServer((socket) => {
    const peerHex = b4a.toString(socket.remotePublicKey, "hex");
    send({ type: "peer", from: peerHex });
    track(socket, peerHex);
  });
  await server.listen(keyPair);
  send({
    type: "ready",
    publicKey: b4a.toString(keyPair.publicKey, "hex"),
    seed: b4a.toString(seed, "hex"),
  });
}

async function connect(peerHex, id) {
  try {
    if (!node) throw new Error("P2P not initialised");
    await dial(peerHex);
    send({ type: "result", id, ok: true });
  } catch (e) {
    send({ type: "result", id, ok: false, error: String((e && e.message) || e) });
  }
}

async function sync(peerHex, summary, id) {
  try {
    if (!node) throw new Error("P2P not initialised");
    const socket = await dial(peerHex);
    socket.write(b4a.from(JSON.stringify({ type: "summary", summary }) + "\n"));
    send({ type: "result", id, ok: true });
  } catch (e) {
    send({ type: "result", id, ok: false, error: String((e && e.message) || e) });
  }
}

IPC.on(
  "data",
  lineReader((line) => {
    let cmd;
    try {
      cmd = JSON.parse(line);
    } catch {
      return;
    }
    if (cmd.type === "init") init(cmd.seed);
    else if (cmd.type === "connect") connect(cmd.peerKey, cmd.id);
    else if (cmd.type === "sync") sync(cmd.peerKey, cmd.summary, cmd.id);
  })
);
