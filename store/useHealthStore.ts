import { create } from "zustand";
import { insertEntry, loadAllEntries, deleteEntry, updateEntryEmbedding } from "@/lib/db";
import { embedText } from "@/lib/embeddings";
import type { HealthEntry, InsightStat } from "@/types/health";

const hasEmbedding = (e: HealthEntry) =>
  Array.isArray(e.embedding) && e.embedding.length > 0;

// One backfill pass at a time — guards against the timeline effect and any
// other caller racing into duplicate embedding work.
let backfillInFlight = false;

type HealthStore = {
  entries: HealthEntry[];
  addEntry: (entry: HealthEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  loadFromDb: () => Promise<void>;
  // Embed any saved entries that have no vector yet (recorded before the
  // embedding model finished downloading). Makes them semantically searchable
  // instead of permanently keyword-only. Safe to call repeatedly — it no-ops
  // when nothing is missing and aborts cleanly when the model can't run.
  backfillEmbeddings: () => Promise<void>;
};

export const useHealthStore = create<HealthStore>((set, get) => ({
  entries: [],

  addEntry: async (entry) => {
    await insertEntry(entry);
    set((state) => ({ entries: [entry, ...state.entries] }));
  },

  removeEntry: async (id) => {
    await deleteEntry(id);
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
  },

  loadFromDb: async () => {
    const entries = await loadAllEntries();
    set({ entries });
  },

  backfillEmbeddings: async () => {
    if (backfillInFlight) return;
    const missing = get().entries.filter((e) => !hasEmbedding(e));
    if (missing.length === 0) return;

    backfillInFlight = true;
    try {
      // Sequential — one embedding model run at a time keeps RAM flat and
      // avoids fighting the eviction strategy in lib/qvac.
      for (const entry of missing) {
        let vec: number[];
        try {
          vec = await embedText(entry.transcript || entry.analysis);
        } catch {
          // Model can't run on this device (Android < 12) or isn't downloaded
          // yet — stop the whole pass rather than reject once per entry.
          break;
        }
        if (vec.length === 0) continue;
        await updateEntryEmbedding(entry.id, vec);
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === entry.id ? { ...e, embedding: vec } : e
          ),
        }));
      }
    } finally {
      backfillInFlight = false;
    }
  },
}));

// Derived selector — compute insight stats from entries
export function computeInsightStats(entries: HealthEntry[]): InsightStat[] {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentEntries = entries.filter(
    (e) => new Date(e.timestamp) >= thirtyDaysAgo
  );

  if (recentEntries.length === 0) {
    return [
      {
        label: "KNEE PAIN FREQUENCY",
        value: "—",
        unit: "this month",
        trend: "neutral",
        trendColor: "yellow",
      },
      {
        label: "SLEEP CORRELATION",
        value: "—",
        unit: "linked to fatigue",
        trend: "neutral",
        trendColor: "yellow",
      },
      {
        label: "ENTRIES LOGGED",
        value: "0",
        unit: "last 30 days",
        trend: "up",
        trendColor: "green",
      },
    ];
  }

  const kneePainCount = recentEntries.filter((e) =>
    e.tags.some((t) => /knee|joint/i.test(t))
  ).length;

  const sleepFatigueCount = recentEntries.filter((e) =>
    e.tags.some((t) => /sleep|fatigue/i.test(t))
  ).length;
  const sleepCorrelation =
    recentEntries.length > 0
      ? Math.round((sleepFatigueCount / recentEntries.length) * 100)
      : 0;

  return [
    {
      label: "KNEE PAIN FREQUENCY",
      value: kneePainCount > 0 ? `${kneePainCount}×` : "—",
      unit: "this month",
      trend: kneePainCount > 0 ? "up" : "neutral",
      trendColor: kneePainCount > 0 ? "red" : "yellow",
    },
    {
      label: "SLEEP CORRELATION",
      value: sleepCorrelation > 0 ? `${sleepCorrelation}%` : "—",
      unit: "linked to fatigue",
      trend: "neutral",
      trendColor: "yellow",
    },
    {
      label: "ENTRIES LOGGED",
      value: String(recentEntries.length),
      unit: "last 30 days",
      trend: "up",
      trendColor: "green",
    },
  ];
}
