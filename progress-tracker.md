# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Project

**MedVoice** — private, on-device AI health companion mobile app.
Built with Expo SDK 54, React Native 0.81.5, TypeScript, Expo Router, NativeWind v5, and the QVAC SDK.

---

## Current Phase

- Phase 4 complete — Full recording + analysis flow done. Next: Phase 5 — Timeline screen.

## Current Goal

- Feature 07: Timeline screen — Health Timeline heading, RAG search bar, expandable entry cards with severity badges.

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

## Completed (Analysis Result Screen)

- **Analysis Result Screen** — `app/analysis/result.tsx` (route `/analysis/result`)
  - Full-screen Stack route — no tab bar visible
  - "← BACK" monospace 12px textSecondary top-left
  - "MEDPSY RESULT" monospace label, "Your health" + "summary" italic accentBlue Georgia 32px heading
  - `components/ConcernBanner.tsx` — severity-aware banner (moderate/red, mild/amber, good/green); colored dot + label + description; rgba bg + border per severity
  - `components/YouSaidCard.tsx` — "YOU SAID" label + Georgia italic 15px transcript
  - `components/AnalysisSummaryCard.tsx` — "MEDPSY ANALYSIS" label + summary text + tag pills (border, monospace 10px, radius 99)
  - Bottom action bar: "READ ALOUD" outlined blue button (QVAC TTS stub — Phase 5) + "SAVE TO TIMELINE" filled blue button
  - SAVE: creates `HealthEntry` with id/timestamp/transcript/analysis/tags/severity, calls `addEntry()`, flips to green "✓ SAVED", resets recording store, navigates home after 700ms
  - Falls back gracefully when `analysisResult` is null (e.g. navigated directly)

## In Progress

- Feature 07: Timeline screen.

## Completed (Recording Active Screen)

- **Recording Active Screen** — `app/recording/active.tsx` (route `/recording/active`)
  - Full-screen Stack route — no tab bar visible
  - "← BACK" monospace 12px textSecondary top-left, discards transcript and replaces to Home on tap
  - "LISTENING • ON DEVICE" monospace 11px letterSpacing 1.54 centered
  - `components/WaveformAnimation.tsx` — 18 bars (3px wide, 2px radius), alternating accentBlue/accentBlueLight, staggered Animated.loop (i * 80ms delay), height oscillates min→max via Animated.timing useNativeDriver:false; `isActive` prop stops/starts all animations
  - `components/LiveTranscriptCard.tsx` — rgba(21,29,46,0.9) bg, border #1e293b, Georgia italic 16px; shows "Listening..." in textMuted or transcript text in white; blinking cursor via Animated opacity 0↔1 at 500ms loop
  - `components/StopRecordingButton.tsx` — 72px red circle (#f87171), white 20×20 square stop icon, red glow shadow (shadowRadius 20, elevation 12), "Tap to stop & analyze" Georgia 13px textSecondary below
  - Uses `expo-audio` `useAudioRecorder(RecordingPresets.HIGH_QUALITY)` + `AudioModule.setAudioModeAsync`
  - Demo word-by-word simulation (420ms per word) while real audio records simultaneously
  - Stop: stops waveform, stops recorder, saves audioUri + finalTranscript to store → `router.replace("/analysis/processing")`
  - Back: stops recorder, resetRecording() → `router.replace("/(tabs)")`

## Completed (Analysis Processing Screen)

- **Analysis Processing Screen** — `app/analysis/processing.tsx` (route `/analysis/processing`)
  - Full-screen Stack route — no tab bar visible
  - "← BACK" top-left, `router.back()` on tap
  - "MEDPSY PROCESSING" monospace 11px letterSpacing 1.54
  - Two-line heading: "Analyzing your" Georgia 32px white bold + "health entry" Georgia 32px accentBlue italic bold
  - 5-step sequential pipeline rendered via `components/PipelineStepRow.tsx`:
    - Step 1 🎙 Transcribing voice input — calls `transcribeAudioFile(audioUri)`, falls back to finalTranscript
    - Step 2 🧠 MedPsy-4B analyzing — calls `analyzeHealthEntry()`, saves result to `useRecordingStore.setAnalysisResult()`
    - Step 3 🔍 Scanning health history — 600ms simulated SQLite query
    - Step 4 📊 RAG context retrieval — 800ms simulated embed search
    - Step 5 ✅ Analysis complete — green icon box always, 500ms then done
  - 200ms transition delay between steps; auto-navigates to `/analysis/result` 800ms after step 5
  - `components/PipelineStepRow.tsx` — 44×44 icon box (bgCard, border, radius 12); step 5 icon always green (#34d399) with white ✓; running: animated opacity-pulsing blue line (20×2px); done: green ✓ on right; last step skips right-side checkmark

- **Recording Store Update** — `store/useRecordingStore.ts`
  - Added `AnalysisResult` type (summary, tags, severity) and `analysisResult: AnalysisResult | null` field
  - Added `setAnalysisResult(result)` action
  - `resetRecording()` now also clears `analysisResult`

## Completed (Recording Ready Screen)

- **Recording Ready Screen** — `app/recording/ready.tsx` (route `/recording/ready`)
  - Full-screen Stack route — no tab bar visible
  - "← BACK" monospace 12px textSecondary top-left, pops to Home on tap
  - "READY TO LISTEN" monospace 11px letterSpacing 0.18em centered
  - `components/ReadyMicDisplay.tsx` — 160px dark circle (bgCard #151d2e, border 2px #1e293b, dark shadow), 52px mic icon in textSecondary; idle/decorative, no animation
  - "How are you feeling?" Georgia 28px bold white centered
  - Description text Georgia 14px textSecondary lineHeight 22 maxWidth 280 centered
  - `components/PulsingMicButton.tsx` — 80px blue circle (accentBlue) with 100px Animated.View glow ring (rgba(59,130,246,0.35), borderWidth 10, borderRadius 50); opacity pulses 0.3→0.8 via `Animated.loop` + `Animated.sequence` at 1500ms each; white mic icon 28px inside; "Tap to start" Georgia 13px textSecondary below
  - On tap: `Audio.requestPermissionsAsync()` from expo-av; granted → navigate `/recording/active`; denied → `Alert.alert` with explanation

## Completed (Home Screen — Redesign)

- **Home Screen** — `app/(tabs)/index.tsx` rebuilt to match `home-screen.png` spec exactly
  - Header row: date "THURSDAY, JUNE 5" monospace 11px textSecondary left; 38px circular settings button (bgCard + border) right → navigates to `/(tabs)/settings`
  - Greeting: "Good morning," white Georgia 28px bold + user name green italic Georgia 28px from `useUserStore`
  - `components/PrivacyBadge.tsx` — "ALL DATA ON-DEVICE" pill, rgba(52,211,153,0.12) bg, rgba border 99px radius, 6px green dot
  - `components/TapToTalkCard.tsx` — large card (bgCard, border, radius 20, padding 32×24); centered 72px blue circle with glow shadow (shadowColor accentBlue, radius 22, opacity 0.55); white mic icon 28px; "Tap to Talk" Georgia 22px bold; subtitle muted Georgia 14px; full Pressable → navigates to `/recording/ready`
  - RECENT ENTRIES header: monospace 11px left + "SEE ALL →" accentBlue right → navigates to `/(tabs)/timeline`
  - `components/RecentEntryCard.tsx` — colored severity dot + formatted timestamp ("Today · 8:14 AM" / "Yesterday · …" / "Mon · …") + "LATEST" monospace badge on first entry; Georgia italic 14px transcript truncated 2 lines; tag pills (border bg, monospace 10px, radius 99)
  - Empty state: 🎙️ emoji + "No entries yet" Georgia 15px + subtext Georgia 13px textMuted
  - Renders 3 most recent entries from `useHealthStore`

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

## Completed (Log Screen)

- **Log Screen** — `app/(tabs)/log.tsx` (Feature 03) — UPDATED with real recording + SDK

**SDK Integration (installed + wired):**
- `expo-audio ~1.1.1` installed for real microphone recording (replaces deprecated `expo-av` in SDK 54)
- `@qvac/sdk@0.12.2` installed — model constants, completion, transcribe, embed, TTS APIs
- `react-native-bare-kit` installed (required peer dependency for @qvac/sdk on React Native)
- `lib/qvac.ts` — model loading/lifecycle for all four models; suspendQvac/resumeQvac for background handling
- `lib/transcription.ts` — `transcribeAudioFile(uri)` using PARAKEET_TDT_0_6B_V3_Q8_0 (~750MB, downloads on first use)
- `lib/medpsy.ts` — `analyzeHealthEntry(transcript, pastContext, onToken)` using MEDGEMMA_4B_IT_Q4_1 (~2.5GB); streaming tokens for live display
- Model pipeline: expo-av records to file → Parakeet transcribes → MedGemma analyzes

**Log Screen changes:**
  - Auto-start recording on mount: navigating to Log immediately begins recording (no second tap needed)
  - `expo-audio` `useAudioRecorder(RecordingPresets.HIGH_QUALITY)` hook with `AudioModule.setAudioModeAsync` (replaces deprecated expo-av API)
  - Waveform animates while recording (isActive=true)
  - Transcript card shows "Listening..." while recording (real transcript comes from Parakeet in Analysis)
  - Stop: saves audio file URI to store → navigates to Analysis
  - Cancel: `audioRecorder.stop()` → resetRecording → home
  - Permission denied: shows error message with Settings instructions
  - `store/useRecordingStore.ts` updated: added `audioUri`, `setAudioUri`, `setTranscript`
  - Auto-requests microphone permission on mount (Android: `PermissionsAndroid`; iOS: Info.plist ready for Phase 2)
  - Resets recording store on mount so each session starts clean
  - "LISTENING · ON DEVICE" monospace label centered at top
  - `Waveform` component: 20 bars, 3px wide, 2px radius, alternating `#3b82f6` / `#7dd3fc`, staggered `Animated.loop` with 4-step height cycle, StyleSheet per AGENTS.md rule
  - `LiveTranscriptCard` component: `rgba(21,29,46,0.8)` background, `#1e293b` border, Georgia italic 15px; shows "Listening|" placeholder or `"transcript|` with blinking cursor (Animated opacity loop)
  - `StopButton` component: 80px red circle (#f87171), white 20px square stop icon, red glow shadow (shadowRadius 20, elevation 14)
  - "Tap to stop & analyze" + "← CANCEL" labels in monospace dim
  - Stop: saves `finalTranscript` to `useRecordingStore`, navigates to `/analysis`
  - Cancel: `resetRecording()`, navigates to `/`
  - Demo transcript simulates word-by-word build-up (QVAC Whisper replaces this in Phase 2)
  - `store/useRecordingStore.ts`: Zustand store — `isRecording`, `transcript`, `finalTranscript`, `setIsRecording`, `appendTranscript`, `setFinalTranscript`, `resetRecording`
  - `app/(tabs)/_layout.tsx`: LOG tab dot turns red (`bg-danger`) while `isRecording` is true

## Next Up

- Feature 04: Analysis Screen — MedPsy processing pipeline + health summary

---

## Build Order (Phases)

| Phase | Feature                           | Key QVAC Capability      | Status     |
|-------|-----------------------------------|--------------------------|------------|
| 0     | Project setup + NativeWind        | —                        | ✅ Done    |
| 0.5   | Design system tokens & global CSS | —                        | ✅ Done    |
| 0.6   | Onboarding setup + App shell      | —                        | ✅ Done    |
| 1     | Text-based MedPsy health analysis | Text Generation (MedPsy) | 🔄 In Progress |
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
