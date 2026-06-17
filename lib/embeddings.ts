/**
 * EmbeddingGemma 300M — semantic search and RAG context helpers.
 * All inference runs on-device via QVAC SDK. No data leaves the phone.
 */

import { embed } from "@qvac/sdk";
import { loadEmbeddingModel } from "./qvac";
import type { HealthEntry } from "@/types/health";

// ── Core embedding ─────────────────────────────────────────────────────────

export async function embedText(
  text: string,
  onProgress?: (pct: number) => void
): Promise<number[]> {
  const modelId = await loadEmbeddingModel(onProgress);
  // QVAC embed returns { embedding: number[] } for a single text input.
  const { embedding } = await embed({ modelId, text });
  return embedding ?? [];
}

// ── Query-vector cache ───────────────────────────────────────────────────────
// The slow part of a semantic search isn't the cosine scan (sub-millisecond even
// over hundreds of entries) — it's embedding the QUERY (model warm-up + inference,
// ~1–3s). Re-typing or re-running the same search shouldn't pay that twice, so we
// memoize query → vector. Small bounded LRU; queries are short and few.
const QUERY_CACHE_MAX = 50;
const queryVecCache = new Map<string, number[]>();

async function embedQuery(query: string): Promise<number[]> {
  const key = query.trim().toLowerCase();
  const hit = queryVecCache.get(key);
  if (hit) {
    // Refresh recency (Map preserves insertion order → re-set moves to newest).
    queryVecCache.delete(key);
    queryVecCache.set(key, hit);
    return hit;
  }
  const vec = await embedText(query);
  if (vec.length > 0) {
    queryVecCache.set(key, vec);
    if (queryVecCache.size > QUERY_CACHE_MAX) {
      queryVecCache.delete(queryVecCache.keys().next().value as string);
    }
  }
  return vec;
}

// ── Cosine similarity ──────────────────────────────────────────────────────

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// ── Semantic search ────────────────────────────────────────────────────────

/**
 * Find the top-k entries most semantically similar to the query.
 * Falls back to keyword matching when no embeddings exist yet.
 */
export async function semanticSearch(
  query: string,
  entries: HealthEntry[],
  topK = 5
): Promise<HealthEntry[]> {
  if (!query.trim() || entries.length === 0) return entries;

  const embeddable = entries.filter(
    (e) => Array.isArray(e.embedding) && e.embedding.length > 0
  );

  if (embeddable.length === 0) {
    return keywordFallback(query, entries, topK);
  }

  const queryVec = await embedQuery(query);

  const scored = embeddable.map((entry) => ({
    entry,
    score: cosineSimilarity(queryVec, entry.embedding!),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.entry);
}

function keywordFallback(
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

// ── RAG context builder ────────────────────────────────────────────────────

/**
 * Format top-k entries as a context string for MedPsy.
 */
export function buildRagContext(entries: HealthEntry[], maxEntries = 5): string {
  if (entries.length === 0) return "";
  return entries
    .slice(0, maxEntries)
    .map((e, i) => {
      const date = new Date(e.timestamp).toLocaleDateString();
      return `[${i + 1}] ${date}: ${e.transcript.slice(0, 200)}`;
    })
    .join("\n");
}
