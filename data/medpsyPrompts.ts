export const MEDPSY_SYSTEM_PROMPT = `You are MedVoice, a private on-device health companion.

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

export const buildUserMessage = (
  transcript: string,
  pastContext: string
): string =>
  pastContext
    ? `Relevant context from past entries:\n${pastContext}\n\nToday's health update:\n"${transcript}"`
    : `Today's health update:\n"${transcript}"`;

export const ANALYSIS_PIPELINE_STEPS = [
  { id: 1, icon: "🎙", label: "Transcribing voice input ..." },
  { id: 2, icon: "🔍", label: "Scanning health history ..." },
  { id: 3, icon: "📊", label: "RAG context retrieval ..." },
  { id: 4, icon: "🧠", label: "MedPsy-4B analyzing health entry ..." },
  { id: 5, icon: "✅", label: "Analysis complete" },
] as const;
