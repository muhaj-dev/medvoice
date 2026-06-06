# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Project

**MedVoice** — private, on-device AI health companion mobile app.
Built with Expo SDK 54, React Native 0.81.5, TypeScript, Expo Router, NativeWind v5, and the QVAC SDK.

---

## Current Phase

- Phase 0 + App Shell complete. Ready to begin Phase 1 (Text-based MedPsy health analysis).

## Current Goal

- Feature 03: Log Screen — voice recording with animated waveform and live transcription.

---

## Completed

- **Setup: Expo Project** — Expo SDK 54 project initialized with Expo Router (`main: "expo-router/entry"`), TypeScript strict mode, React 19.1.0, React Native 0.81.5. Path alias `@/*` configured in tsconfig. Basic `app/_layout.tsx` (Stack) and `app/index.tsx` stub in place.

- **Setup: NativeWind v5** — `nativewind@5.0.0-preview.4`, `tailwindcss@4.3.0`, `@tailwindcss/postcss@4.3.0`, and `react-native-css` installed. `postcss.config.mjs` created with `@tailwindcss/postcss` plugin. `global.css` created with Tailwind v4 + NativeWind theme directives. `metro.config.js` wraps Expo default config with `withNativewind` (now explicit `{ input: "./global.css" }`). `global.css` imported at top of `app/_layout.tsx`. `lightningcss` pinned to `1.30.1` via `overrides`. `nativewind-env.d.ts` with `/// <reference types="nativewind/types" />` included in `tsconfig.json`.

- **Design System: Tokens & Global CSS** — Full MedVoice design system implemented from the `01-design-system.jpg` spec sheet:
  - `constants/colors.ts` — all 11 color tokens (bgPrimary, bgCard, bgDeep, accentBlue, accentBlueLight, successGreen, warningRed, warningAmber, border, textPrimary, textSecondary, textMuted)
  - `constants/typography.ts` — `fonts` object (Georgia/monospace), `typeScale` (H1–Caption per design spec), `typography` StyleSheet (heading, greetingName, sectionTitle, cardTitle, body, secondary, label, pipelineStep, statNumber, tabLabel)
  - `constants/spacing.ts` — `spacing`, `radius`, `touchTarget` objects matching design spec
  - `constants/theme.ts` — single aggregated re-export for all tokens
  - `lib/cn.ts` — lightweight NativeWind className merge utility
  - `global.css` — `@theme` block defines custom Tailwind color/font utilities (`bg-surface`, `bg-card`, `text-teal`, `text-danger`, `text-warn`, `text-dim`, `border-edge`, `font-georgia`, `font-code`, etc.); `@utility` BEM component classes (`medv-card`, `medv-card--inner`, `medv-badge`, `medv-badge--privacy`, `medv-badge--moderate`, `medv-badge--mild`, `medv-badge--good`, `medv-badge--online`, `medv-badge--offline`, `medv-banner`, `medv-banner--success`, `medv-screen`, `medv-touch`, `medv-row`, `medv-row--between`, `medv-gap`, `medv-btn`, `medv-avatar`, `medv-tag`, `medv-toggle`, `medv-toggle-item`, `medv-toggle-item--active`, `medv-divider`)
  - `app/_layout.tsx` — StatusBar light style, SplashScreen handling, Stack with dark background and slide animation
  - `metro.config.js` — explicit `{ input: "./global.css" }` for NativeWind v5

---

## In Progress

- None.

## Completed (Home Screen)

- **Home Screen — Entries Tab** — `app/(tabs)/index.tsx` + `components/EntryCard.tsx`
  - `EntryCard` component: status dot (red/yellow/green by severity), formatted timestamp ("Today · 8:14 AM" / "Yesterday" / weekday / "Jan 5"), "VIEW →" link navigates to `/analysis/summary?id=`, transcript snippet in Georgia italic truncated 2 lines, category tag pills (#1e293b bg, #8b9bb4 text, monospace 10px, radius 99)
  - Empty state: mic-outline icon + "No entries yet" Georgia + subtext
  - ENTRIES tab in home screen now renders `EntryCard` list (sorted newest-first from store) or empty state

- **Home Screen** — `app/(tabs)/index.tsx` (Feature 02)
  - Header row: date "THURSDAY, JUNE 5" (monospace) left-aligned; blue circular family-icon button right, navigates to `/family`
  - Greeting block: "Good morning," in white Georgia 28px + user name in teal italic Georgia 28px (from `useUserStore`)
  - ALL DATA ON-DEVICE privacy badge — green dot, semi-transparent teal background, rgba border
  - "How are you feeling?" microphone card — blue mic icon circle, Georgia heading, muted subtext; taps navigate to `/log`
  - ENTRIES / INSIGHTS segmented toggle — active=bgCard+white, inactive=transparent+dim; defaults to INSIGHTS
  - Three insight stat cards (INSIGHTS tab): label (monospace), large value (Georgia 36px colored by severity), unit, trend symbol aligned right
  - Empty state for ENTRIES tab when no entries exist
  - Stats computed from `useHealthStore` entries via `computeInsightStats()` selector — shows "—" / 0 when no data

- **Custom Tab Bar** — `app/(tabs)/_layout.tsx`
  - Replaced standard Expo tab bar with custom `CustomTabBar` component
  - Each tab: icon + label + 4px blue dot below (transparent dot for inactive tabs, `accentBlue` for active)
  - Consistent 72px height, dark navy background, border-top

- **Health Types** — `types/health.ts`
  - `HealthEntry`, `HealthPattern`, `RagInsight`, `PipelineStep`, `InsightStat`, `Severity` types

- **Health Store** — `store/useHealthStore.ts`
  - Zustand store: `entries[]`, `addEntry`, `removeEntry`
  - `computeInsightStats(entries)` exported selector — computes knee pain count, sleep/fatigue correlation %, entries logged from real entry data; falls back to "—" when no data

## Completed (Onboarding Setup + App Shell)

- **Onboarding Setup Screen** — `app/(onboarding)/index.tsx` (route `/(onboarding)`)
  - 3-step wizard with step indicator (STEP X OF 3 · dot pills)
  - Step 1: Role selection — patient vs caregiver, two large selectable cards with Ionicons, blue selected state
  - Step 2: Personal profile — Name (required), Age (optional), expandable Conditions + Medications tag inputs with add/remove chip UX
  - Step 3: Privacy promise — shield-checkmark icon, "Your data stays on your device" heading, 3 green-checkmark rows, "Get Started" button
  - Continue button disabled until requirements met; saving state during async persist
  - `app/index.tsx` replaced with a gate: loads AsyncStorage → routes to `/(onboarding)` or `/(tabs)`
  - Onboarding state persisted to AsyncStorage via `useUserStore` (Zustand)
  - `SplashScreen.hideAsync()` moved from root layout to gate, so splash covers the storage check

- **App Shell & Navigation** — Feature 01
  - `app/(tabs)/_layout.tsx` — Expo Router `<Tabs>` with 4 tabs: HOME / LOG / ANALYSIS / FAMILY
  - Dark navy tab bar (#111827), Ionicons, white active / muted gray inactive, monospace labels
  - Screen stubs: `(tabs)/index`, `(tabs)/log`, `(tabs)/analysis`, `(tabs)/family`
  - `types/user.ts` — UserRole, UserProfile types
  - `store/useUserStore.ts` — Zustand store with AsyncStorage persistence

## Completed (Onboarding)

- **Onboarding Screen** — `app/onboarding/index.tsx` (route `/onboarding`)
  - 4-slide horizontal pager with `ScrollView pagingEnabled`
  - Slides: Welcome · Voice · AI Analysis · Privacy/Family
  - Each slide has: monospace label, Georgia title (accent in teal italic), body description
  - Slide illustrations: concentric-ring logo (Welcome), waveform + stop button (Voice), pipeline checklist (Analysis), shield + family avatars (Privacy)
  - Pagination dot indicator — active dot wide blue, inactive dots small gray
  - CTA button: "Next →" on slides 1–3, "Get Started" (teal) on slide 4
  - "SKIP" link top-right (hides on last slide)
  - `SafeAreaView` with inline `edges={["top","bottom"]}` (style exception rule)

- **Home Screen Update** — `app/index.tsx`
  - Logo in glowing ring + "MedVoice" italic teal heading
  - "ALL DATA ON-DEVICE" privacy badge
  - Feature list card (4 rows: voice, AI, privacy, family)
  - "Get Started →" button linking to `/onboarding`

- **Centralized Image Exports** — `constants/images.ts`
  - `images.appIcon` → `assets/images/icon.png`
  - `images.splashIcon` → `assets/images/splash-icon.png`

---

## Next Up

- Feature 03: Log Screen — voice recording with animated waveform, live transcription card, stop button

---

## Build Order (Phases)

| Phase | Feature                           | Key QVAC Capability      | Status     |
|-------|-----------------------------------|--------------------------|------------|
| 0     | Project setup + NativeWind        | —                        | ✅ Done    |
| 0.5   | Design system tokens & global CSS | —                        | ✅ Done    |
| 0.6   | Onboarding setup + App shell      | —                        | ✅ Done    |
| 1     | Text-based MedPsy health analysis | Text Generation (MedPsy) | ⏳ Next    |
| 2     | Voice recording + TTS response    | Transcription + TTS      | —          |
| 3     | Health timeline + smart search    | Embeddings + RAG         | —          |
| 4     | Family connection via P2P         | Holepunch P2P            | —          |
| 5     | UI polish + demo preparation      | All                      | —          |

---

## Architecture Decisions

- NativeWind v5 (preview) with Tailwind CSS v4 — CSS-based config via `global.css`, no `tailwind.config.js`.
- Dark-only theme: all colors defined in `constants/colors.ts` design tokens. No light mode, ever.
- **Tailwind custom utilities** generated from `@theme` in `global.css`:
  - `bg-surface` / `bg-card` / `bg-deep` — background levels
  - `text-teal` / `border-teal` — success green (#34d399)
  - `text-danger` / `border-danger` — warning red (#f87171)
  - `text-warn` / `border-warn` — warning amber (#fbbf24)
  - `text-brand` / `bg-brand` / `border-brand` — accent blue (#3b82f6)
  - `border-edge` / `bg-edge` — border color (#1e293b)
  - `text-dim` — secondary text (#8b9bb4)
  - `text-ghost` — muted text (#4a5568)
  - `font-georgia` — Georgia serif
  - `font-code` — Courier New / monospace
- **BEM `@utility` classes** in `global.css` for reusable components (medv-card, medv-badge, medv-screen, etc.)
- Use NativeWind `className` for all styling except the explicit exception list in AGENTS.md (`SafeAreaView`, `Animated.View`, dynamic/platform-specific styles, etc.)
- `SafeAreaView` from `react-native-safe-area-context` always uses inline `style` prop, not `className`
- Expo Router file-based routing for all screens
- QVAC SDK for all AI — no cloud AI, no API keys. All inference on-device
- SQLite (`expo-sqlite`) for health entries; AsyncStorage for lightweight profile/settings; Zustand for app state

---

## Session Notes

- Expo SDK 54, React Native 0.81.5, React 19.1.0.
- NativeWind `5.0.0-preview.4` — the only v5 version on npm at time of setup.
- `lightningcss` pinned to `1.30.1` to prevent deserialization errors with `global.css`.
- `react-native-worklets@0.5.1` and `react-native-reanimated@~4.1.1` in dependencies (for animations).
- `metro.config.js` uses `withNativewind` with `{ input: "./global.css" }`.
- Georgia font: system font on iOS (exact match). Android falls back to `serif` (Noto Serif). For production, bundle `Georgia.ttf` for Android.
- `lib/cn.ts` is a lightweight class merge utility — no clsx/tailwind-merge dependency needed.

---

## Open Questions

- None.
