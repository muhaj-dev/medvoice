/**
 * scan screen strings (English source). Filled per-feature; merged into
 * EN_STRINGS by constants/strings.ts. Keys are namespaced "scan.*".
 */
export const scanStrings = {
  // capture screen
  "scan.requestingCameraAccess": "Requesting camera access…",

  // ScanCaptureBody
  "scan.back": "← BACK",
  "scan.title": "Scan a Document",
  "scan.pointCamera": "Point your camera at the page",
  "scan.captureHint": "Hold steady and fill the frame with the text.\nTap the button to capture.",

  // DocumentCameraView
  "scan.cameraNotAvailable": "Camera not available",
  "scan.waitingForCamera": "Waiting for camera…",

  // ScanDocumentCard (home entry point)
  "scan.cardTitle": "Scan a Document",
  "scan.cardSubtitle": "Read a prescription or note aloud",

  // processing pipeline steps
  "scan.stepReadingText": "Reading document text ...",
  "scan.stepScanningHistory": "Scanning health history ...",
  "scan.stepRagRetrieval": "RAG context retrieval ...",
  "scan.stepAnalyzingDocument": "analyzing document ...",
  "scan.stepAnalysisComplete": "Analysis complete",

  // processing fallback summary (no readable OCR text)
  "scan.noTextSummary":
    "We couldn't read any text from that photo. Try again in brighter light, hold the camera steady, and fill the frame with the page.",

  // ScanProcessingHeader
  "scan.readingDocument": "READING DOCUMENT",
  "scan.understandingYour": "Understanding your",
  "scan.document": "document",

  // result screen
  "scan.documentAnalysis": "DOCUMENT ANALYSIS",
  "scan.defaultSummary": "Your scanned document has been read on this device.",

  // ScannedTextCard
  "scan.scannedTextLabel": "📄 SCANNED TEXT",
  "scan.noReadableText": "No readable text was found in the photo. Try again with better lighting.",

  // ScannedImageCard
  "scan.scannedDocumentLabel": "🖼 SCANNED DOCUMENT",
} as const;
