/**
 * "Ask MedVoice" orchestrator — RAG over the user's own health history.
 *
 * Given a question (spoken or typed), it:
 *   1. retrieves the most relevant past entries (semantic search, with a
 *      keyword fallback when the embedding model can't run),
 *   2. builds a small context string from them, and
 *   3. streams a grounded answer from the analysis model token by token.
 *
 * Everything runs on-device. When the analysis model can't load (e.g. Android
 * < 12), it degrades to surfacing the matched entries with an honest message
 * instead of crashing — mirroring the rest of the app's graceful fallbacks.
 */

import { useCallback, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useHealthStore } from "@/store/useHealthStore";
import { semanticSearch, buildRagContext } from "@/lib/embeddings";
import { answerHealthQuestion } from "@/lib/medpsy";
import type { HealthEntry } from "@/types/health";

export type AskStatus = "idle" | "thinking" | "answering" | "done" | "error";

// How many past entries to retrieve and feed to the model as context. Small,
// since the analysis model's prompt budget is tight on slow devices.
const TOP_K = 4;

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
  const [status, setStatus] = useState<AskStatus>("idle");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<HealthEntry[]>([]);
  // Monotonic run id — a newer ask() cancels an older one's late updates.
  const runIdRef = useRef(0);

  const reset = useCallback(() => {
    runIdRef.current++;
    setStatus("idle");
    setQuestion("");
    setAnswer("");
    setSources([]);
  }, []);

  const ask = useCallback(
    async (raw: string): Promise<string | undefined> => {
      const text = raw.trim();
      if (!text) return;
      const myRun = ++runIdRef.current;
      setQuestion(text);
      setAnswer("");
      setSources([]);
      setStatus("thinking");

      // 1. Retrieve relevant past entries. Semantic first; keyword if the
      //    embedding model isn't available on this device.
      let top: HealthEntry[] = [];
      try {
        top = await semanticSearch(text, entries, TOP_K);
      } catch {
        top = keywordSearch(text, entries, TOP_K);
      }
      if (myRun !== runIdRef.current) return;
      setSources(top);

      const context = buildRagContext(top, TOP_K);

      // 2. Stream a grounded answer from the analysis model.
      try {
        setStatus("answering");
        const full = await answerHealthQuestion(text, context, (tok) => {
          if (myRun === runIdRef.current) setAnswer((a) => a + tok);
        });
        if (myRun !== runIdRef.current) return;
        if (full) setAnswer(full);
        setStatus("done");
        return full;
      } catch {
        if (myRun !== runIdRef.current) return;
        // Degraded: the analysis model can't run here. Be honest, and lean on
        // the entries we did find so the question isn't a dead end.
        setAnswer(
          top.length > 0
            ? t("ask.modelFailedWithEntries")
            : t("ask.modelFailedNoEntries")
        );
        setStatus("error");
      }
    },
    [entries, t]
  );

  return { status, question, answer, sources, ask, reset };
}
