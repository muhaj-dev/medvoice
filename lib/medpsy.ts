/**
 * Health analysis helper ("MedPsy").
 * Runs the on-device analysis model selected in Settings → AI Model:
 *   "1.7B" (default, ~1.1 GB) → Qwen3 1.7B
 *   "4B"   (~2.5 GB)          → MedGemma 4B (Google's medical Gemma)
 * Model selection is handled by loadMedGemmaModel(); no health data ever
 * leaves the phone.
 */

import { completion } from "@qvac/sdk";
import { loadMedGemmaModel } from "./qvac";
import type { Pattern } from "@/store/useRecordingStore";

const SYSTEM_PROMPT = `You are MedVoice, a private on-device health companion.

Your role is to help users understand patterns in their own health updates. You are:
- Caring and reassuring, never clinical or cold
- Clear and concise — users may be elderly or not medically trained
- Honest about uncertainty — never diagnose, always recommend a doctor for serious concerns

When analyzing a health update:
1. Identify key health signals mentioned (pain, vitals, symptoms, mood, sleep, medication)
2. Note any patterns if past context is provided
3. Give 1–3 actionable, caring insights
4. Flag anything that warrants medical attention

Format your response as structured plain text. Do not use markdown headers.`;

export type MedPsyAnalysis = {
  summary: string;
  tags: string[];
  severity: "moderate" | "mild" | "good";
  patterns: Pattern[];
};

/**
 * Analyze a health entry transcript with MedGemma.
 *
 * @param transcript  - What the user said (from Parakeet transcription)
 * @param pastContext - Recent past entries as plain text (optional)
 * @param onToken     - Called with each streaming token for live display
 * @param onProgress  - Model download progress 0–100 (first run only)
 */
// Cap what we send to the LLM. On a low-end CPU, time-to-first-token grows
// roughly linearly with prompt length, so an unbounded transcript makes the
// analysis step crawl. Tags/severity/patterns still derive from the FULL
// transcript locally — only the LLM prompt is trimmed.
const MAX_PROMPT_TRANSCRIPT_CHARS = 1500;

export async function analyzeHealthEntry(
  transcript: string,
  pastContext: string = "",
  onToken?: (token: string) => void,
  onProgress?: (pct: number) => void
): Promise<MedPsyAnalysis> {
  const modelId = await loadMedGemmaModel(onProgress);

  const promptTranscript =
    transcript.length > MAX_PROMPT_TRANSCRIPT_CHARS
      ? transcript.slice(0, MAX_PROMPT_TRANSCRIPT_CHARS) + "…"
      : transcript;

  const userMessage = pastContext
    ? `Relevant context from past entries:\n${pastContext}\n\nToday's health update:\n"${promptTranscript}"`
    : `Today's health update:\n"${promptTranscript}"`;

  const run = completion({
    modelId,
    stream: true,
    history: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  // IMPORTANT: with stream:true, `run.final` only resolves once the event stream
  // is consumed. We MUST drain run.events here — even when no onToken is given —
  // or the completion hangs forever ("analyzing… no response"). We also keep the
  // streamed text as a fallback in case final.contentText comes back empty.
  let streamed = "";
  for await (const event of run.events) {
    if (event.type === "contentDelta") {
      streamed += event.text;
      onToken?.(event.text);
    }
  }

  const result = await run.final;
  const fullText = result.contentText || streamed;

  return {
    summary: fullText,
    tags: deriveTags(transcript),
    severity: deriveSeverity(transcript, fullText),
    patterns: derivePatterns(transcript),
  };
}

/**
 * Local-only fallback when the analysis model can't run (failed download, or
 * the llama.cpp engine doesn't work on this device). Tags, severity, and
 * patterns are all derived locally by regex — no model required — so the entry
 * still gets useful structure. The summary is honest about what happened.
 */
export function analyzeHealthEntryLocally(transcript: string): MedPsyAnalysis {
  return {
    summary:
      "Your health update was saved privately on this device. " +
      "The AI analysis model couldn't run on this phone, so this entry has a basic summary instead. " +
      "Voice notes, tags, and your timeline all still work normally. " +
      "If anything feels serious, please talk to your doctor.",
    tags: deriveTags(transcript),
    severity: deriveSeverity(transcript, ""),
    patterns: derivePatterns(transcript),
  };
}

// ── Metadata derivation ───────────────────────────────────────────────────

function deriveSeverity(
  transcript: string,
  analysis: string
): MedPsyAnalysis["severity"] {
  const combined = (transcript + " " + analysis).toLowerCase();
  if (/severe|worsening|emergency|urgent|chest pain|trouble breath/.test(combined))
    return "moderate";
  if (/pain|ache|tired|fatigue|glucose|sugar|blood pressure/.test(combined))
    return "mild";
  return "good";
}

const TAG_MAP: [RegExp, string][] = [
  [/knee|joint|hip|shoulder|ankle/, "Joint"],
  [/glucose|sugar|insulin|diabetes/, "Glucose"],
  [/sleep|insomnia|tired|fatigue|rest/, "Sleep"],
  [/blood pressure|bp|heart|cardiac/, "Heart"],
  [/pain|ache|sore/, "Pain"],
  [/mood|anxious|stress|depress|mental/, "Mental"],
  [/medication|pill|dose|prescription/, "Medication"],
  [/energy|weak|exhausted/, "Energy"],
];

function deriveTags(transcript: string): string[] {
  const lower = transcript.toLowerCase();
  return TAG_MAP.filter(([pattern]) => pattern.test(lower)).map(([, tag]) => tag);
}

// ── Pattern derivation ────────────────────────────────────────────────────

type PatternTemplate = {
  test: (t: string) => boolean;
  getName: (t: string) => string;
  emoji: string;
  severity: "moderate" | "mild";
  getDescription: (t: string) => string;
};

const PATTERN_TEMPLATES: PatternTemplate[] = [
  {
    test: (t) => /knee|joint|hip|shoulder|ankle/i.test(t),
    getName: () => "Knee Pain",
    emoji: "🦵",
    severity: "moderate",
    getDescription: () =>
      "Recurring joint discomfort detected. Consider anti-inflammatory protocol and consult your doctor if it persists.",
  },
  {
    test: (t) => /glucose|blood sugar|sugar was|sugar is/i.test(t),
    getName: (t) => {
      const match = t.match(/\b(1[3-9]\d|[2-9]\d\d)\b/);
      return match ? `Blood Glucose: ${match[0]} mg/dL` : "Blood Glucose";
    },
    emoji: "🩸",
    severity: "mild",
    getDescription: () =>
      "Fasting reading mildly elevated. Log tomorrow's reading. Consider reducing carbohydrates at dinner.",
  },
  {
    test: (t) => /sleep|insomnia|woke up|poor sleep/i.test(t),
    getName: () => "Sleep Quality",
    emoji: "💤",
    severity: "mild",
    getDescription: () =>
      "Poor sleep pattern detected. Consider a consistent bedtime and limit screens before sleep.",
  },
  {
    test: (t) => /tired|fatigue|exhausted|low energy/i.test(t),
    getName: () => "Fatigue",
    emoji: "⚡",
    severity: "mild",
    getDescription: () =>
      "Energy levels below normal. Ensure adequate rest and hydration throughout the day.",
  },
];

function derivePatterns(transcript: string): Pattern[] {
  return PATTERN_TEMPLATES
    .filter(({ test }) => test(transcript))
    .map(({ getName, emoji, severity, getDescription }) => ({
      name: getName(transcript),
      emoji,
      severity,
      description: getDescription(transcript),
    }));
}
