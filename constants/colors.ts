export type ColorTokens = {
  bgPrimary: string;
  bgCard: string;
  bgDeep: string;
  accentBlue: string;
  accentBlueLight: string;
  successGreen: string;
  warningRed: string;
  warningAmber: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  tabActive: string;
  tabInactive: string;
  tabDot: string;
};

export const darkColors: ColorTokens = {
  bgPrimary:       "#111827",
  bgCard:          "#151d2e",
  bgDeep:          "#0c0f1a",
  accentBlue:      "#3b82f6",
  accentBlueLight: "#7dd3fc",
  successGreen:    "#34d399",
  warningRed:      "#f87171",
  warningAmber:    "#fbbf24",
  border:          "#1e293b",
  textPrimary:     "#ffffff",
  textSecondary:   "#8b9bb4",
  textMuted:       "#4a5568",
  tabActive:       "#ffffff",
  tabInactive:     "#4a5568",
  tabDot:          "#3b82f6",
};

export const lightColors: ColorTokens = {
  bgPrimary:       "#ffffff",
  bgCard:          "#e8ecf0",
  bgDeep:          "#d1d5db",
  accentBlue:      "#3b82f6",
  accentBlueLight: "#60a5fa",
  successGreen:    "#059669",
  warningRed:      "#dc2626",
  warningAmber:    "#d97706",
  border:          "#d1d5db",
  textPrimary:     "#0d1117",
  textSecondary:   "#475569",
  textMuted:       "#94a3b8",
  tabActive:       "#0d1117",
  tabInactive:     "#94a3b8",
  tabDot:          "#3b82f6",
};

/** Dark alias kept for any static fallback usage */
export const colors: ColorTokens = darkColors;

export type ColorKey = keyof ColorTokens;
export type ColorValue = ColorTokens[ColorKey];
