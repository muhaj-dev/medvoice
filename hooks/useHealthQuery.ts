/**
 * "Ask MedVoice" orchestrator — a multi-turn RAG chat over the user's own
 * health history.
 *
 * It keeps a running conversation of `messages` (alternating user questions and
 * MedVoice answers), so the screen can render a ChatGPT/Claude-style thread.
 * Each question independently:
 *   1. retrieves the most relevant past entries (semantic search, with a
 *      keyword fallback when the embedding model can't run),
 *   2. builds a small context string from them, and
 *   3. streams a grounded answer from the analysis model token by token.
 *
 * Everything runs on-device. When the analysis model can't load (e.g. Android
 * < 12), it degrades to surfacing the matched entries with an honest message
 * instead of crashing — mirroring the rest of the app's graceful fallbacks.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useHealthStore } from "@/store/useHealthStore";
import { semanticSearch, buildRagContext } from "@/lib/embeddings";
import { answerHealthQuestion, type QATurn } from "@/lib/medpsy";
import { canHoldTwoModels } from "@/lib/device";
import type { HealthEntry } from "@/types/health";

export type AskStatus = "idle" | "thinking" | "answering" | "done" | "error";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  // assistant-only — drives the inline status + grounding chips.
  status?: AskStatus;
  sources?: HealthEntry[];
};

// How many past entries to retrieve and feed to the model as context. Small,
// since the analysis model's prompt budget is tight on slow devices.
const TOP_K = 4;

// Monotonic id source for messages — stable keys without leaking into render.
let idSeq = 0;
const makeId = (prefix: string): string => `${prefix}-${Date.now()}-${++idSeq}`;

function keywordSearch(
  query: string,
  entries: HealthEntry[],
  topK: number
): HealthEntry[] {
  const q = query.toLowerCase();
  return entries
    .filter(
      (e) =>
        e.transcript.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
    )
    .slice(0, topK);
}

export function useHealthQuery() {
  const { t } = useTranslation();
  const entries = useHealthStore((s) => s.entries);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  // Monotonic run id — a newer ask() cancels an older one's late updates.
  const runIdRef = useRef(0);
  // Blocks overlapping submits so only the first in-flight ask() can append a
  // placeholder pair (otherwise a superseded turn strands in "thinking").
  const inFlightRef = useRef(false);
  // Mirror of messages so ask() can read the current thread without being
  // recreated on every turn. Synced via effect to avoid writing a ref in render.
  const messagesRef = useRef<ChatMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Immutably patch a single message by id (used as tokens stream in).
  const patch = useCallback((id: string, partial: Partial<ChatMessage>) => {
    setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, ...partial } : m)));
  }, []);

  const reset = useCallback(() => {
    runIdRef.current++;
    inFlightRef.current = false;
    setMessages([]);
    setBusy(false);
  }, []);

  const ask = useCallback(
    async (raw: string): Promise<{ id: string; text: string } | undefined> => {
      const text = raw.trim();
      if (!text) return;
      // Re-entrancy guard: ignore overlapping submits so we never append a
      // second placeholder pair that would strand the first turn in "thinking".
      if (inFlightRef.current) return;
      inFlightRef.current = true;
      const myRun = ++runIdRef.current;

      try {
        // Earlier turns become the model's conversation memory, so a follow-up
        // ("what about last week?") connects to what was already asked/answered.
        const history: QATurn[] = messagesRef.current
          .filter((m) => m.text.trim().length > 0 && m.status !== "error")
          .map((m) => ({ role: m.role, content: m.text }));

        const aId = makeId("a");
        // Append the question and an empty, "thinking" answer in one update.
        setMessages((msgs) => [
          ...msgs,
          { id: makeId("u"), role: "user", text },
          { id: aId, role: "assistant", text: "", status: "thinking", sources: [] },
        ]);
        setBusy(true);

        // 1. Retrieve relevant past entries. Semantic search loads the embedding
        //    model, which would evict the pinned analysis model on low-RAM
        //    phones — forcing a full reload before every answer. So only use it
        //    when the device can hold both models; otherwise keyword search
        //    keeps the analysis model resident for fast, swap-free follow-ups.
        let top: HealthEntry[] = [];
        if (canHoldTwoModels()) {
          try {
            top = await semanticSearch(text, entries, TOP_K);
          } catch {
            top = keywordSearch(text, entries, TOP_K);
          }
        } else {
          top = keywordSearch(text, entries, TOP_K);
        }
        if (myRun !== runIdRef.current) return;
        patch(aId, { sources: top, status: "answering" });

        const context = buildRagContext(top, TOP_K);

        // 2. Stream a grounded answer from the analysis model.
        try {
          const full = await answerHealthQuestion(text, context, history, (tok) => {
            if (myRun !== runIdRef.current) return;
            setMessages((msgs) =>
              msgs.map((m) => (m.id === aId ? { ...m, text: m.text + tok } : m))
            );
          });
          if (myRun !== runIdRef.current) return;
          // Prefer the model's final text; keep the streamed text if it's empty.
          patch(aId, { status: "done", ...(full ? { text: full } : {}) });
          setBusy(false);
          return { id: aId, text: full };
        } catch {
          if (myRun !== runIdRef.current) return;
          // Degraded: the analysis model can't run here. Be honest, and lean on
          // the entries we did find so the question isn't a dead end.
          patch(aId, {
            status: "error",
            text:
              top.length > 0
                ? t("ask.modelFailedWithEntries")
                : t("ask.modelFailedNoEntries"),
          });
          setBusy(false);
        }
      } finally {
        inFlightRef.current = false;
      }
    },
    [entries, t, patch]
  );

  return { messages, busy, ask, reset };
}
