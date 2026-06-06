/**
 * MedVoice — Official Color Tokens (Do Not Change)
 * Source of truth for all colors in the app.
 * Use these in StyleSheet.create() calls; for className styling use the
 * matching Tailwind custom properties defined in global.css.
 */
export const colors = {
  // Backgrounds
  bgPrimary: "#111827",   // Main app background
  bgCard: "#151d2e",      // Card / elevated surface
  bgDeep: "#0c0f1a",      // Inner card / deepest surface

  // Accents
  accentBlue: "#3b82f6",      // Primary blue — buttons, active elements, waveform
  accentBlueLight: "#7dd3fc", // Light blue — waveform bars, subtle highlights

  // Status
  successGreen: "#34d399", // Online · privacy badge · checkmarks · teal name

  // Warning & Severity
  warningRed: "#f87171",    // MODERATE concern · stop button · red trend arrows
  warningAmber: "#fbbf24",  // MILD concern · yellow trend symbols · RAG highlights

  // Border / Divider
  border: "#1e293b",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#8B9BB4", // Muted blue-gray — subtitles, secondary info
  textMuted: "#4A5568",     // Dimmed — inactive tabs, placeholders
} as const;

export type ColorKey = keyof typeof colors;
export type ColorValue = (typeof colors)[ColorKey];
