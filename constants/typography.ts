import { StyleSheet } from "react-native";
import { colors } from "./colors";

/**
 * Font family names.
 * Georgia — available on iOS as a system font; falls back to serif on Android.
 * monospace — resolved by RN to Courier (iOS) / Droid Sans Mono (Android).
 */
export const fonts = {
  body: "Georgia",
  mono: "monospace",
} as const;

/**
 * Type scale — matches the design system spec sheet exactly.
 *
 * H1  Screen Title      32px  Bold     lh 1.2
 * H2  Section Title     24px  SemiBold lh 1.3
 * H3  Card/Pattern      20px  SemiBold lh 1.3
 * H4  Subheading        17px  Medium   lh 1.4
 * Lg  Important body    16px  Regular  lh 1.6
 * Md  Body text         14px  Regular  lh 1.6
 * Lb  Badges/tabs/labels 11px Medium   lh 1.4
 * Cp  Caption/timestamp  11px Regular  lh 1.4
 */
export const typeScale = {
  h1: { fontFamily: fonts.body, fontSize: 32, fontWeight: "700" as const, lineHeight: 38 },
  h2: { fontFamily: fonts.body, fontSize: 24, fontWeight: "600" as const, lineHeight: 31 },
  h3: { fontFamily: fonts.body, fontSize: 20, fontWeight: "600" as const, lineHeight: 26 },
  h4: { fontFamily: fonts.body, fontSize: 17, fontWeight: "500" as const, lineHeight: 24 },
  bodyLg: { fontFamily: fonts.body, fontSize: 16, fontWeight: "400" as const, lineHeight: 26 },
  bodyMd: { fontFamily: fonts.body, fontSize: 14, fontWeight: "400" as const, lineHeight: 22 },
  label: { fontFamily: fonts.mono, fontSize: 11, fontWeight: "500" as const, lineHeight: 15, letterSpacing: 1.2 },
  caption: { fontFamily: fonts.mono, fontSize: 11, fontWeight: "400" as const, lineHeight: 15 },
} as const;

/**
 * Named semantic styles — for use with StyleSheet / inline style props.
 * For NativeWind className usage, use the Tailwind utilities defined in global.css.
 */
export const typography = StyleSheet.create({
  heading: {
    fontFamily: fonts.body,
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  greetingName: {
    fontFamily: fonts.body,
    fontSize: 28,
    fontWeight: "700",
    fontStyle: "italic",
    color: colors.successGreen,
  },
  sectionTitle: {
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cardTitle: {
    fontFamily: fonts.body,
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
    lineHeight: 22,
  },
  secondary: {
    fontFamily: fonts.body,
    fontSize: 13,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: 1.2,
  },
  pipelineStep: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textPrimary,
  },
  statNumber: {
    fontFamily: fonts.body,
    fontSize: 36,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  tabLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
