/**
 * analysis screen strings (English source). Filled per-feature; merged into
 * EN_STRINGS by constants/strings.ts. Keys are namespaced "analysis.*".
 */
export const analysisStrings = {
  // Common
  "analysis.back": "← BACK",

  // Processing screen
  "analysis.processingLabel": "MEDPSY PROCESSING",
  "analysis.processingTitle": "Analyzing your",
  "analysis.processingTitleAccent": "health entry",
  "analysis.stepTranscribing": "Transcribing voice input ...",
  "analysis.stepScanningHistory": "Scanning health history ...",
  "analysis.stepRagRetrieval": "RAG context retrieval ...",
  "analysis.stepAnalyzing": "analyzing health entry ...",
  "analysis.stepComplete": "Analysis complete",

  // Progress bar
  "analysis.progressComplete": "ANALYSIS COMPLETE",
  "analysis.progressAnalyzing": "ANALYZING ON DEVICE",

  // Result screen
  "analysis.resultLabel": "MEDPSY ANALYSIS",

  // YouSaidCard
  "analysis.youSaid": "YOU SAID",
  "analysis.noTranscript": "No transcript available.",

  // ConcernBanner
  "analysis.moderateConcern": "MODERATE CONCERN",
  "analysis.mildConcern": "MILD CONCERN",
  "analysis.lookingGood": "LOOKING GOOD",
  "analysis.patternFlagged": "pattern flagged",
  "analysis.patternsFlagged": "patterns flagged",
  "analysis.reviewFindings": "Review MedPsy's findings below",

  // ConcernFlaggedBanner
  "analysis.concernFlagged": "CONCERN FLAGGED",
  "analysis.medPsyFlagged": "MedPsy flagged",
  "analysis.item": "item",
  "analysis.items": "items",
  "analysis.inTodaysEntry": "in today's entry",

  // AnalysisSummaryCard
  "analysis.summaryLabel": "MEDPSY ANALYSIS",

  // MedPsySummaryCard
  "analysis.medPsySummary": "MEDPSY SUMMARY",

  // AnalysisActionButtons / ReadAloudButton
  "analysis.ttsOff": "🔇  TTS OFF",
  "analysis.loading": "LOADING…",
  "analysis.stop": "⏹  STOP",
  "analysis.readAloud": "🔊  READ ALOUD",
  "analysis.saved": "✓  SAVED",
  "analysis.saving": "SAVING...",
  "analysis.save": "💾  SAVE",
} as const;
