/**
 * Doctor Visit Prep orchestrator.
 *
 * Gathers the user's recent health entries, formats them as context, and
 * streams a visit-prep brief from the on-device analysis model. Everything
 * stays on the phone; the only thing that ever leaves is what the user chooses
 * to share via the OS share sheet on the results screen.
 *
 * Degrades gracefully: if the analysis model can't run on this device, it
 * still shows a plain chronological recap built locally from the entries.
 */

import { useCallback, useRef, useState } from "react";
import { useHealthStore } from "@/store/useHealthStore";
import { generateVisitSummary } from "@/lib/medpsy";
import type { HealthEntry } from "@/types/health";

export type VisitStatus = "idle" | "generating" | "done" | "error";

// Look back this far for "recent" entries. If nothing is that recent, fall back
// to the most recent few so the brief is never empty when history exists.
const RECENT_DAYS = 30;
const MAX_ENTRIES = 12;
const FALLBACK_COUNT = 8;

function recentEntries(entries: HealthEntry[]): HealthEntry[] {
  const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const within = entries.filter((e) => new Date(e.timestamp).getTime() >= cutoff);
  const pick = within.length > 0 ? within : entries.slice(0, FALLBACK_COUNT);
  return pick.slice(0, MAX_ENTRIES);
}

// Plain-text context for the model: date, severity, tags, and a trimmed
// transcript per entry — richer than buildRagContext, which drops severity.
function buildVisitContext(entries: HealthEntry[]): string {
  return entries
    .map((e) => {
      const date = new Date(e.timestamp).toLocaleDateString();
      const sev = e.severity ? ` (${e.severity})` : "";
      const tags = e.tags.length > 0 ? ` [${e.tags.join(", ")}]` : "";
      return `${date}${sev}${tags}: ${e.transcript.slice(0, 180)}`;
    })
    .join("\n");
}

// Local recap used when the model can't run — honest, still useful.
function localRecap(entries: HealthEntry[]): string {
  if (entries.length === 0) return "";
  const lines = entries
    .map((e) => {
      const date = new Date(e.timestamp).toLocaleDateString();
      return `${date}: ${e.transcript.slice(0, 120)}`;
    })
    .join("\n");
  return (
    "The AI summary model can't run on this phone, so here is a plain recap of " +
    "your recent entries to take to your doctor:\n\n" +
    `Recent timeline:\n${lines}`
  );
}

export function useVisitPrep() {
  const entries = useHealthStore((s) => s.entries);
  const [status, setStatus] = useState<VisitStatus>("idle");
  const [summary, setSummary] = useState("");
  const [used, setUsed] = useState<HealthEntry[]>([]);
  const runIdRef = useRef(0);

  const generate = useCallback(async (): Promise<void> => {
    const myRun = ++runIdRef.current;
    const picked = recentEntries(entries);
    setUsed(picked);
    setSummary("");

    if (picked.length === 0) {
      setStatus("error");
      setSummary(
        "There are no health entries yet. Record a few updates first, then come back to prepare for your visit."
      );
      return;
    }

    setStatus("generating");
    const context = buildVisitContext(picked);

    try {
      const full = await generateVisitSummary(context, (tok) => {
        if (myRun === runIdRef.current) setSummary((s) => s + tok);
      });
      if (myRun !== runIdRef.current) return;
      if (full) setSummary(full);
      setStatus("done");
    } catch {
      if (myRun !== runIdRef.current) return;
      setSummary(localRecap(picked));
      setStatus("error");
    }
  }, [entries]);

  return { status, summary, used, generate };
}
