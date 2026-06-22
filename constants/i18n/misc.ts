/**
 * misc screen strings (English source). Filled per-feature; merged into
 * EN_STRINGS by constants/strings.ts. Keys are namespaced "misc.*".
 */
export const miscStrings = {
  // PrivacyBadge
  "misc.allDataOnDevice": "ALL DATA ON-DEVICE",

  // Model model labels (shared)
  "misc.modelVoiceRecognition": "Voice Recognition",
  "misc.modelHealthAnalysis": "Health Analysis",
  "misc.modelSemanticSearch": "Semantic Search",
  "misc.modelTextToSpeech": "Text-to-Speech",

  // Model status text (shared)
  "misc.statusReady": "READY",
  "misc.statusError": "ERROR",
  "misc.statusIdle": "IDLE",
  "misc.statusWaiting": "WAITING",
  "misc.statusBackground": "BACKGROUND",

  // ModelLoadingModal
  "misc.aiModels": "AI MODELS",
  "misc.allModelsReady": "ALL MODELS READY",
  "misc.downloading": "DOWNLOADING",
  "misc.downloadsNote": "Downloads once · Always on-device · No cloud",

  // ModelDownloadGate
  "misc.gateReadyTitle": "You're all set",
  "misc.gatePreparingTitle": "Preparing MedVoice",
  "misc.gateReadySubtitle":
    "Voice and analysis are ready. Search and read-aloud finish downloading in the background.",
  "misc.gatePreparingSubtitle":
    "Downloading your private on-device AI. This happens once — Wi-Fi recommended.",
  "misc.gateLowStoragePrefix": "LOW STORAGE:",
  "misc.gateLowStorageFree": "GB FREE,",
  "misc.gateLowStorageNeeded": "GB NEEDED.",
  "misc.gateLowStorageAction": "FREE UP SPACE IF A DOWNLOAD FAILS.",
  "misc.gateCoreModelsReady": "CORE MODELS READY",
  "misc.gateContinue": "CONTINUE →",
  "misc.gateRetrying": "RETRYING…",
  "misc.gateRetryDownload": "RETRY DOWNLOAD",
  "misc.gateContinueWithoutAi": "CONTINUE WITHOUT AI →",
  "misc.gateDegradedNote":
    "Voice journaling will work · AI analysis stays off until downloaded",

  // ThemeSelector
  "misc.theme": "Theme",
  "misc.themeLight": "Light",
  "misc.themeDark": "Dark",
  "misc.themeSystem": "System",
} as const;
