import { create } from "zustand";
import { insertEntry, loadAllEntries, deleteEntry } from "@/lib/db";
import type { HealthEntry, InsightStat } from "@/types/health";

type HealthStore = {
  entries: HealthEntry[];
  addEntry: (entry: HealthEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  loadFromDb: () => Promise<void>;
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
