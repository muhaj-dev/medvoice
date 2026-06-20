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

// Document-scan variant. The text comes from OCR of a scanned page (a
// prescription, doctor's note, lab result, or health form) rather than from
// speech. This is the primary way deaf or non-speaking users communicate with
// MedVoice, so the analysis must read the page back and answer it plainly.
const DOCUMENT_SYSTEM_PROMPT = `You are MedVoice, a private on-device health companion helping someone understand a document they scanned with their camera — a prescription, doctor's note, lab result, or health form.

The person may be deaf or unable to speak, so the scanned text below is how they communicate with you. Your job:
1. Explain in plain, simple language what the document says
2. If it lists medications, state each medicine clearly with its dose and when to take it
3. If the document asks a question, answer that question directly
4. Point out anything important — instructions, warnings, dates, or follow-ups
5. Flag anything that needs a doctor or pharmacist. Never diagnose.

Be caring, clear, and brief. The reader may be elderly or not medically trained. Do not use markdown headers.`;

// Doctor-visit-prep variant. From the user's recent entries, produce a short
// brief they can take to an appointment: what to mention, what to ask, and a
// quick timeline. Grounded in their own history — never invents symptoms.
const VISIT_PREP_SYSTEM_PROMPT = `You are MedVoice, a private on-device health companion helping the user prepare for a doctor's appointment using their own recent health updates.

From the entries provided, write a brief, practical summary the user can read to their doctor. Use exactly these three plain-text sections, each on its own line starting with the label and a colon:

Symptoms to mention: a short list of the main symptoms, changes, or concerns from the entries, with rough timing.
Questions to ask: 2–4 specific questions worth asking the doctor, based on what was logged.
Recent timeline: the most notable entries in date order, one per line, very brief.

Rules:
- Use ONLY what is in the entries. Do not invent symptoms, vitals, or diagnoses.
- Be concise and clear — the reader may be elderly or anxious.
- Never diagnose. Do not use markdown headers, asterisks, or bullet symbols — plain lines only.`;

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

// Cap how many tokens the model GENERATES (llama.cpp n_predict). CPU decode time
// is ~linear in output length, so an unbounded, rambling summary makes the
// analysis step drag on slow devices. ~320 tokens (≈240 words) is plenty for the
// "1–3 caring insights" the system prompt asks for, and it bounds the worst case.
const MAX_ANALYSIS_TOKENS = 320;

// Visit prep has three sections, so it needs more room than a single Q&A
// answer — but still bounded so it doesn't crawl on a slow CPU.
const MAX_VISIT_TOKENS = 448;

export async function analyzeHealthEntry(
  transcript: string,
  pastContext: string = "",
  onToken?: (token: string) => void,
  onProgress?: (pct: number) => void
): Promise<MedPsyAnalysis> {
  const promptTranscript = trimForPrompt(transcript);

  const userMessage = pastContext
    ? `Relevant context from past entries:\n${pastContext}\n\nToday's health update:\n"${promptTranscript}"`
    : `Today's health update:\n"${promptTranscript}"`;

  return runMedPsy(SYSTEM_PROMPT, userMessage, transcript, onToken, onProgress);
}

/**
 * Analyze the text extracted (by on-device OCR) from a scanned document.
 * Same model and structured output as analyzeHealthEntry, but with a
 * document-reading system prompt: it explains the page in plain language,
 * answers questions written on it, and flags anything important.
 *
 * @param documentText - OCR'd text from the scanned photo
 * @param pastContext  - Recent past entries as plain text (optional)
 */
export async function analyzeDocument(
  documentText: string,
  pastContext: string = "",
  onToken?: (token: string) => void,
  onProgress?: (pct: number) => void
): Promise<MedPsyAnalysis> {
  const promptText = trimForPrompt(documentText);

  const userMessage = pastContext
    ? `Relevant context from past entries:\n${pastContext}\n\nScanned document text:\n"${promptText}"`
    : `Scanned document text:\n"${promptText}"`;

  return runMedPsy(DOCUMENT_SYSTEM_PROMPT, userMessage, documentText, onToken, onProgress);
}

/**
 * Generate a doctor-visit-prep brief from the user's recent entries. Streams
 * three plain-text sections (symptoms to mention, questions to ask, recent
 * timeline) grounded only in the provided history. Returns the full text.
 *
 * @param context - Recent entries as plain text (built by the visit-prep hook)
 */
export async function generateVisitSummary(
  context: string,
  onToken?: (token: string) => void,
  onProgress?: (pct: number) => void
): Promise<string> {
  const modelId = await loadMedGemmaModel(onProgress);

  const run = completion({
    modelId,
    stream: true,
    generationParams: { predict: MAX_VISIT_TOKENS },
    history: [
      { role: "system", content: VISIT_PREP_SYSTEM_PROMPT },
      {
        role: "user",
        content: `My recent health entries:\n${context}\n\nPlease prepare my doctor-visit summary.`,
      },
    ],
  });

  // Drain the event stream or run.final never resolves (see runMedPsy).
  let streamed = "";
  for await (const event of run.events) {
    if (event.type === "contentDelta") {
      streamed += event.text;
      onToken?.(event.text);
    }
  }

  const result = await run.final;
  return (result.contentText || streamed).trim();
}

function trimForPrompt(text: string): string {
  return text.length > MAX_PROMPT_TRANSCRIPT_CHARS
    ? text.slice(0, MAX_PROMPT_TRANSCRIPT_CHARS) + "…"
    : text;
}

/**
 * Shared MedPsy completion: loads the analysis model, streams the summary, and
 * derives structured fields (tags/severity/patterns) locally from `deriveText`.
 * Both the voice and document flows go through here so they stay in lockstep.
 */
async function runMedPsy(
  systemPrompt: string,
  userMessage: string,
  deriveText: string,
  onToken?: (token: string) => void,
  onProgress?: (pct: number) => void
): Promise<MedPsyAnalysis> {
  const modelId = await loadMedGemmaModel(onProgress);

  const run = completion({
    modelId,
    stream: true,
    generationParams: { predict: MAX_ANALYSIS_TOKENS },
    history: [
      { role: "system", content: systemPrompt },
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
    tags: deriveTags(deriveText),
    severity: deriveSeverity(deriveText, fullText),
    patterns: derivePatterns(deriveText),
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

/**
 * Local-only fallback for a scanned document when the analysis model can't run.
 * The text was still read on-device by OCR, so we echo an honest message and
 * keep the locally-derived tags/severity/patterns useful.
 */
export function analyzeDocumentLocally(documentText: string): MedPsyAnalysis {
  return {
    summary:
      "The text in your document was read privately on this device. " +
      "The AI explanation model couldn't run on this phone, so the scanned text is shown above without an AI summary. " +
      "You can still read it, hear it aloud, and save it to your timeline. " +
      "If anything is unclear or feels serious, please show it to your doctor or pharmacist.",
    tags: deriveTags(documentText),
    severity: deriveSeverity(documentText, ""),
    patterns: derivePatterns(documentText),
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
