/**
 * MedVoice — Spacing & Shape Tokens
 * Matches the Spacing & Radius section of the design system spec.
 */

export const spacing = {
  screenPadding: 20,   // Horizontal padding on all screens
  cardPadding: 16,     // Internal padding for cards
  innerCardPadding: 12, // Internal padding for nested / inner cards
  sectionGap: 12,      // Gap between stacked section elements
} as const;

export const radius = {
  phoneFrame: 44,  // Outermost phone frame corners
  cardLg: 20,      // Large cards
  card: 16,        // Standard cards
  innerCard: 12,   // Nested / inner cards
  button: 12,      // Buttons
  badge: 9999,     // Fully rounded pills & badges
} as const;

export const touchTarget = {
  min: 48, // Minimum 48×48 pt touch target (elderly-friendly accessibility)
} as const;
