# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.


update the progress-tracker.md file everytime



# AGENTS.md

You are an expert React Native + Expo engineer helping build a production-quality health companion app.

You write clean, simple, maintainable code. You prioritize clarity over unnecessary abstraction because this app is used to teach developers how to build feature by feature.

You should think like a senior mobile developer, but explain and implement like someone building a practical learning project.

-----

## Project Overview

We are building MedVoice — a private, on-device AI health companion mobile app using Expo and QVAC SDK by Tether.

link to docs: https://qvac.tether.io/dev/sdk/

The app allows users to track their health privately through:

- voice-based health entry powered by QVAC Transcription (Whisper)
- on-device AI health analysis powered by QVAC MedPsy model
- text-to-speech responses using QVAC TTS
- semantic health timeline with smart search powered by QVAC Embeddings and RAG
- private family health sharing via QVAC Holepunch P2P
- local health history stored entirely on device
- beautiful mobile-first UI designed for all ages including elderly users

All AI features run entirely on the user’s device. No health data ever leaves the phone. No cloud server. No API keys required for core features.

This is built for the QVAC “Unleash Edge AI” Hackathon on DoraHacks.

-----

## Tech Stack

Use the following stack:

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind / Tailwind CSS
- Zustand
- AsyncStorage
- QVAC SDK (`@qvac/sdk`) for all AI capabilities
- QVAC MedPsy model (1.7B or 4B) for medical reasoning
- QVAC Fabric for on-device inference
- QVAC Holepunch P2P for family device connection
- SQLite (via expo-sqlite) for local health entry storage
- react-native-tcp-socket for P2P data transfer
- Server-side API routes only for QVAC Holepunch peer discovery (no health data sent to server)

Do not introduce new major libraries unless there is a strong reason.

-----

## Development Philosophy

Build feature by feature.

For every feature:

1. Understand the user request.
1. Check this file before coding.
1. Keep the implementation simple.
1. Avoid overengineering.
1. Prefer readable code over clever code.
1. Build the smallest useful version first.
1. Refactor only when repetition or complexity appears.
1. Keep the app easy to teach and explain.

This project should feel like a real production app, but remain approachable for developers learning to build with QVAC and on-device AI.

-----

## Decision Making & Clarifications

If something is unclear or could be improved:

- Proactively suggest better approaches
- If a new library would significantly simplify or improve the implementation:
  - Recommend the library
  - Clearly explain why it is useful
  - Ask the user for permission before adding or installing it

Example:

> “This could be implemented manually, but using expo-av would make audio playback smoother. Do you want me to add it?”

Do not install or use new libraries without user approval.

-----

## Architecture Guidelines

Use this structure unless there is a strong reason to change it:

```
app/
  (onboarding)/
  (tabs)/
  family/
components/
constants/
data/
hooks/
lib/
store/
types/
assets/
```

### app/

Use this for routes and screens only.

Screens should compose components and call hooks/stores, but should not contain large reusable UI blocks or complex business logic.

#### Screen Reference

The bottom navigation has exactly 4 tabs: **HOME, LOG, ANALYSIS, FAMILY**. These match the confirmed designs.

|Screen               |Route               |Tab     |Description                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|---------------------|--------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Onboarding           |`(onboarding)/index`|—       |First-time setup. Name, age, role selection (patient or caregiver), health profile (conditions, medications).                                                                                                                                                                                                                                                                                                                                                            |
|Home                 |`(tabs)/index`      |HOME    |“Good morning, [Name]” greeting with date top-left. Family circle icon top-right. ALL DATA ON-DEVICE green badge. “How are you feeling?” microphone card (tap to start recording). ENTRIES/INSIGHTS toggle below. ENTRIES tab: scrollable health entry cards with timestamp, transcript snippet, and auto-generated category tags (Joint, Glucose, Sleep, Energy, etc.). INSIGHTS tab: stat cards showing health patterns (frequency counts, correlations, entry totals).|
|Log / Record         |`(tabs)/log`        |LOG     |“LISTENING · ON DEVICE” label top center. Animated waveform of blue vertical bars. Live transcription card showing words as user speaks. Large red circular stop button with square icon and “Tap to stop & analyze” label. “← CANCEL” link at bottom.                                                                                                                                                                                                                   |
|Analysis — Processing|`(tabs)/analysis`   |ANALYSIS|Appears immediately after user stops recording. “MEDPSY PROCESSING” small label. “Analyzing your health entry” heading — “health entry” in teal italic. Pipeline checklist with icons and green checkmarks: Transcribing voice input, MedPsy-4B analyzing patterns, Scanning health history, RAG context retrieval, Summary ready. RAG INSIGHT card below with inline bold teal and amber highlights. “VIEW FULL SUMMARY →” blue pill button.                            |
|Analysis — Summary   |`analysis/summary`  |—       |Full health pattern report. Concern level badge (MODERATE CONCERN / MILD CONCERN) with warning icon. Individual pattern cards each with: emoji icon, pattern name, severity badge (MODERATE/MILD), description paragraph, recommendation sub-card with lightbulb icon. READ ALOUD button (dark) and SHARE P2P button (teal) side by side at bottom.                                                                                                                      |
|Family Circle        |`(tabs)/family`     |FAMILY  |“Family Circle” heading. “Direct device-to-device · No cloud server” subtitle. P2P MESH ACTIVE status banner (green dot). Family member list cards: avatar circle with initial, name, relationship label, last seen time, ONLINE (teal badge) or OFFLINE (gray badge). “Invite family member” dashed card with + icon. “HOW P2P WORKS” explanation card at bottom.                                                                                                       |
|Family — Invite      |`family/invite`     |—       |QR code for this device’s public key. Step-by-step pairing instructions.                                                                                                                                                                                                                                                                                                                                                                                                 |
|Settings             |`settings/index`    |—       |User profile, health profile, preferences. Accessible via icon, not a main tab.                                                                                                                                                                                                                                                                                                                                                                                          |

#### Navigation Structure

```
Bottom Tab Bar (exactly 4 tabs):
  HOME     — house icon
  LOG      — microphone/scroll icon  
  ANALYSIS — bar chart icon
  FAMILY   — people/group icon

Active tab: white icon + white label + blue dot indicator below
Inactive tab: muted gray icon + gray label
Tab bar background: dark navy, matches app background
```

### components/

Create a component only when:

- it is reused in multiple places
- it makes a screen easier to read
- it represents a clear UI concept

Components confirmed from the designs:

|Component              |Used In            |Description                                                                               |
|-----------------------|-------------------|------------------------------------------------------------------------------------------|
|`PrivacyBadge`         |Home, Log          |Green pill badge “ALL DATA ON-DEVICE” with green dot                                      |
|`MicrophoneCard`       |Home               |Blue gradient card with mic icon, “How are you feeling?” text                             |
|`EntryCard`            |Home (Entries tab) |Health entry row: colored dot, timestamp, transcript snippet, category tag pills          |
|`InsightStatCard`      |Home (Insights tab)|Stat display: label, large number, unit, trend arrow or symbol                            |
|`EntriesInsightsToggle`|Home               |Two-button segmented toggle: ENTRIES / INSIGHTS                                           |
|`Waveform`             |Log                |Animated blue vertical bars responding to audio input                                     |
|`LiveTranscriptCard`   |Log                |Semi-transparent card showing live transcription text as user speaks                      |
|`StopButton`           |Log                |Large red circular button with square stop icon                                           |
|`PipelineStep`         |Analysis           |Single step row: icon, label text, green checkmark or loading indicator                   |
|`RagInsightCard`       |Analysis           |Highlighted card with inline bold teal and amber text, view summary button                |
|`ConcernBadge`         |Analysis Summary   |Warning badge: MODERATE CONCERN / MILD CONCERN with triangle icon                         |
|`PatternCard`          |Analysis Summary   |Full health pattern card: icon, name, severity badge, description, recommendation sub-card|
|`SeverityBadge`        |Analysis Summary   |Small pill: MODERATE (amber border) or MILD (yellow border)                               |
|`RecommendationCard`   |Analysis Summary   |Dark inner card with lightbulb icon and recommendation text                               |
|`ReadAloudButton`      |Analysis Summary   |Dark outlined button with speaker icon                                                    |
|`ShareP2PButton`       |Analysis Summary   |Teal filled button with share icon                                                        |
|`P2PStatusBanner`      |Family             |Green dot + “P2P MESH ACTIVE · N device connected” banner                                 |
|`FamilyMemberCard`     |Family             |Avatar circle, name, role, last seen, ONLINE/OFFLINE badge                                |
|`InviteFamilyCard`     |Family             |Dashed border card with + icon and “Invite family member”                                 |
|`P2PExplainerCard`     |Family             |“HOW P2P WORKS” info card with description text                                           |

Do not create tiny one-off components too early.

When unsure, ask:

> Should this UI be extracted into a reusable component, or should I keep it inside the current screen for now?

-----

## UI Implementation Rules (VERY IMPORTANT)

For any UI-related task:

- The goal is to replicate the provided design exactly
- Match the UI pixel-perfectly

When the user provides a design image:

You MUST:

- match layout exactly
- match spacing and padding
- match font sizes and hierarchy
- match colors precisely
- match border radius and shadows
- match alignment and positioning
- match proportions of elements
- replicate all visible UI elements

Do not approximate. Do not simplify unless explicitly asked.

-----

## Image Generation Rules

If the user enables image generation:

- Generate images that are visually identical or extremely close to the provided UI reference
- Do not change style, colors, or composition
- Keep consistency with the design system

After generating images:

- Place them inside the `assets/` folder
- Use clear and organized naming:

```txt
assets/images/onboarding-illustration.png
assets/images/medvoice-logo.png
assets/images/health-icon.png
assets/images/family-connect.png
```

Use these assets properly in the UI.

-----

## Styling Rules

Use NativeWind tailwindcss classes for styling strictly. Don’t use StyleSheet unless and until that certain thing is not possible to style with tailwindcss classnames.

Prioritize clean, readable mobile UI. MedVoice targets all age groups including elderly users — use large text, high contrast, and generous touch targets.

When building from an attached design image:

- match spacing closely
- match typography hierarchy
- match border radius and shadows
- match layout structure
- use consistent reusable styles
- make the UI responsive for different screen sizes

Prefer reusable class patterns through utilities in `global.css`. If there isn’t any utility and you see a possibility, create that as a new utility in `global.css` by following BEM method.

## Avoid large inline styles unless required.

-----

## Design System (Official Tokens — Do Not Change)

These are the exact design tokens for MedVoice. Use these values precisely. Do not approximate or substitute.

### Colors

```ts
// constants/colors.ts
export const colors = {
  // Backgrounds
  bgPrimary: "#111827",       // Main app background (alternate: #0c0f1a)
  bgCard: "#151d2e",          // Card background

  // Accents
  accentBlue: "#3b82f6",      // Primary blue — buttons, active elements, waveform
  accentBlueLight: "#7dd3fc", // Light blue — waveform bars, subtle highlights

  // Status
  successGreen: "#34d399",    // Success / online / privacy badge / checkmarks / teal name

  // Warning & Severity
  warningRed: "#f87171",      // Warning red — MODERATE concern, stop button, red trend arrows
  warningAmber: "#fbbf24",    // Warning amber — MILD concern, yellow trend symbols, RAG highlights

  // Border
  border: "#1e293b",          // Card borders, dividers, subtle separators

  // Text (derived from background + token contrast)
  textPrimary: "#FFFFFF",
  textSecondary: "#8B9BB4",   // Muted blue-gray for subtitles, secondary info
  textMuted: "#4A5568",       // Dimmed — inactive tabs, placeholders
};
```

### Typography

```ts
// constants/typography.ts
// Body font: Georgia (serif)
// Mono font: System monospace (for pipeline steps and labels)

export const fonts = {
  body: "Georgia",            // Serif — all body text, headings, cards
  mono: "monospace",          // Monospace — pipeline step labels, ALL CAPS badges
};

export const typography = {
  heading:      { fontFamily: "Georgia", fontSize: 28, fontWeight: "700", color: "#FFFFFF" },
  greetingName: { fontFamily: "Georgia", fontSize: 28, fontWeight: "700", fontStyle: "italic", color: "#34d399" },
  sectionTitle: { fontFamily: "Georgia", fontSize: 18, fontWeight: "600", color: "#FFFFFF" },
  cardTitle:    { fontFamily: "Georgia", fontSize: 17, fontWeight: "600", color: "#FFFFFF" },
  body:         { fontFamily: "Georgia", fontSize: 15, fontWeight: "400", color: "#FFFFFF", lineHeight: 22 },
  secondary:    { fontFamily: "Georgia", fontSize: 13, fontWeight: "400", color: "#8B9BB4" },
  label:        { fontFamily: "monospace", fontSize: 11, fontWeight: "600", color: "#8B9BB4", letterSpacing: 1.2 },
  pipelineStep: { fontFamily: "monospace", fontSize: 13, color: "#FFFFFF" },
  statNumber:   { fontFamily: "Georgia", fontSize: 36, fontWeight: "700" },
  tabLabel:     { fontFamily: "monospace", fontSize: 10, fontWeight: "500", letterSpacing: 0.5 },
};
```

### Spacing & Shape

```
Border radius:
  Phone frame:    44px
  Cards:          16–20px
  Inner cards:    12px
  Badges/pills:   99px (fully rounded)
  Buttons:        12px
  Avatar circles: 50% (fully round)

Card padding:     16px
Section gap:      12px
Screen padding:   20px horizontal

Border color:     #1e293b (all card borders and dividers)
```

### Key UI Patterns

**ALL DATA ON-DEVICE badge:**

- Background: semi-transparent green tint
- Dot: #34d399
- Text: “ALL DATA ON-DEVICE” in monospace small caps, white
- Always visible at top of Home screen

**ENTRIES / INSIGHTS toggle:**

- Active: #151d2e filled, white text
- Inactive: transparent, muted gray text
- Border: #1e293b

**Health Entry Card:**

- Background: #151d2e, border: #1e293b, radius: 16px
- Colored dot: red (#f87171) today concern, yellow (#fbbf24) mild, green (#34d399) good
- Category tag pills: #1e293b background, #8B9BB4 text

**Pipeline step:**

- Font: monospace
- Complete: green checkmark #34d399
- In-progress: blue underline animation #3b82f6

**Severity badges:**

- MODERATE: border #f87171, text #f87171
- MILD: border #fbbf24, text #fbbf24

**ONLINE / OFFLINE badges:**

- ONLINE: border #34d399, text #34d399
- OFFLINE: border #4A5568, text #4A5568

**Dark Theme Rule:**
The entire app uses a dark theme only. No light mode. Background is always #111827 or #0c0f1a. Never use white or light backgrounds inside the app.

## NativeWind Rule

Use the NativeWind version already installed in this app.

Before implementing styling or NativeWind-related code:

- Check the current NativeWind version in `package.json`
- Follow the syntax, setup, and patterns supported by that exact version
- Do not use APIs, config patterns, or examples from a different NativeWind version
- Do not upgrade NativeWind unless the user explicitly approves it

Refer to this for more info: <https://www.nativewind.dev/v5/llms-full.txt>

-----

## Style Exception Rules

Use StyleSheet or inline styles for these React Native components/scenarios instead of NativeWind/tailwindcss classes:

|Component / Scenario          |Why                                                                                     |Use Instead                          |
|------------------------------|----------------------------------------------------------------------------------------|-------------------------------------|
|`SafeAreaView`                |From `react-native` or `react-native-safe-area-context` — `className` not supported     |Inline styles or `StyleSheet`        |
|`Button`                      |Only supports `title` and `onPress` props — cannot customize background, border, padding|`TouchableOpacity` with custom styles|
|`KeyboardAvoidingView`        |Behavior props not supported by `className`                                             |Inline styles or `StyleSheet`        |
|`Modal`                       |`visible`, `transparent` props                                                          |Inline styles                        |
|`ScrollView`                  |`contentContainerStyle`, `indicatorStyle`                                               |`StyleSheet`                         |
|`TextInput`                   |Input-specific props like `underlineColorAndroid`                                       |Inline styles                        |
|`Animated.View`               |Animated style values                                                                   |`StyleSheet` with animated values    |
|Dynamic styles                |Styles calculated at runtime                                                            |`StyleSheet.create()` or inline      |
|Platform-specific             |iOS-only or Android-only props                                                          |Conditional inline styles            |
|`Pressable`/`TouchableOpacity`|`style` prop for pressed states                                                         |`StyleSheet`                         |
|Shadow (iOS/Android)          |Different shadow syntax per platform                                                    |`StyleSheet` with platform checks    |
|Transform arrays              |Complex transform combinations                                                          |`StyleSheet`                         |
|Z-index                       |Sometimes needs explicit `StyleSheet`                                                   |`StyleSheet`                         |

### When to Use StyleSheet

Use StyleSheet or inline styles when:

- The prop is React Native-specific (not web-equivalent)
- The value is dynamic/calculated at runtime
- Platform-specific behavior is needed
- NativeWind doesn’t map the property to a style

### SafeAreaView Example

```tsx
// ✅ CORRECT - Use inline styles or StyleSheet
import { SafeAreaView } from "react-native-safe-area-context";

function MyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* content */}
    </SafeAreaView>
  );
}

// ❌ INCORRECT - Do not use NativeWind/tailwindcss classes
function MyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">{/* content */}</SafeAreaView>
  );
}
```

And similar for above mentioned exception components. Otherwise, always stick to NativeWind utilities.

-----

## UI Quality Bar

The app should feel:

- calm and reassuring (health context — not clinical or cold)
- polished
- friendly and approachable for all ages
- mobile-first
- visually close to the provided design references

Use:

- rounded cards
- soft shadows
- clear spacing
- large touch targets (elderly-friendly minimum 48x48pt)
- large readable font sizes (minimum 16pt for body text)
- high contrast text
- clear status indicators for connection and recording states
- simple pulse animations for microphone recording
- friendly empty states
- progress and sync indicators

-----

## Image Rule

Use centralized image imports.

Before using any image asset:

1. Check if `constants/images.ts` exists.
1. If it does not exist, create it.
1. Import and export all app images from `constants/images.ts`.
1. Use images through the centralized object.

Example:

```ts
import medvoiceLogo from "@/assets/images/medvoice-logo.png";
import onboardingIllustration from "@/assets/images/onboarding-illustration.png";
import familyConnect from "@/assets/images/family-connect.png";

export const images = {
  medvoiceLogo,
  onboardingIllustration,
  familyConnect,
};
```

Use images like this:

```tsx
<Image source={images.medvoiceLogo} />
```

Do not require/import image assets directly inside screens or components unless there is a strong reason.

-----

## data/

Use this for hardcoded reference content.

Example:

```
data/
  healthCategories.ts
  onboardingSteps.ts
  medpsyPrompts.ts
```

Health reference content should be typed.

-----

## store/

Use Zustand stores here.

Use Zustand for:

- user profile (name, age, health conditions, medications)
- current recording and transcription state
- health entry list (loaded from SQLite into memory)
- family member connections list
- P2P connection status
- app settings and preferences

Use AsyncStorage persistence where needed for lightweight values. Use SQLite for health entries.

Example store structure:

```
store/
  useUserStore.ts
  useHealthStore.ts
  useFamilyStore.ts
  useRecordingStore.ts
  useSettingsStore.ts
```

-----

## lib/

Use this for external service helpers.

Examples:

```
lib/
  qvac.ts         — QVAC SDK initialization, model loading, completion helper
  medpsy.ts       — MedPsy model wrapper, health analysis helper functions
  transcription.ts — QVAC Whisper transcription helper
  tts.ts          — QVAC text-to-speech helper
  embeddings.ts   — QVAC embeddings and RAG helper
  p2p.ts          — QVAC Holepunch P2P connection manager
  db.ts           — SQLite database helper for health entries
  cn.ts           — NativeWind class merge utility
```

Never expose secret keys in the mobile app. The QVAC SDK requires no API keys — all AI runs locally.

-----

## State Management Rules

Use Zustand for global client state.

Use local state for temporary UI state (e.g., microphone active, modal open).

Persist lightweight values using AsyncStorage when needed.

Persist health entries using SQLite via `expo-sqlite`.

-----

## TypeScript Rules

Use TypeScript strictly.

Avoid `any`.

Keep types simple and readable.

Key types to define in `types/`:

```ts
// types/health.ts
export type Severity = "moderate" | "mild" | "good";

export type HealthEntry = {
  id: string;
  timestamp: string;
  transcript: string;
  analysis: string;
  tags: string[];             // e.g. ["Joint", "Glucose", "Sleep"]
  severity: Severity | null;
  embedding?: number[];
};

export type HealthPattern = {
  id: string;
  entryId: string;
  patternName: string;        // e.g. "Knee Pain Pattern"
  severity: "moderate" | "mild";
  description: string;
  recommendation: string;
  createdAt: string;
};

export type RagInsight = {
  text: string;               // e.g. "Your knee pain has appeared 4 times this month..."
  highlights: string[];       // bold teal phrases
};

export type PipelineStep = {
  id: string;
  label: string;              // e.g. "Transcribing voice input..."
  status: "pending" | "running" | "done";
  icon: string;               // emoji or icon name
};

// types/family.ts
export type ConnectionStatus = "online" | "offline" | "pending";

export type FamilyMember = {
  id: string;
  name: string;
  relationship: string;       // e.g. "Mother", "Son"
  publicKey: string;
  connectionStatus: ConnectionStatus;
  lastSynced: string | null;
};

// types/user.ts
export type UserRole = "patient" | "caregiver";

export type UserProfile = {
  name: string;
  age: number;
  role: UserRole;
  conditions: string[];
  medications: string[];
};

// types/insights.ts
export type InsightStat = {
  label: string;              // e.g. "KNEE PAIN FREQUENCY"
  value: string;              // e.g. "4×"
  unit: string;               // e.g. "this month"
  trend: "up" | "down" | "neutral";
  trendColor: "red" | "green" | "yellow";
};
```

-----

## Feature Implementation Rules

When the user asks to build a feature:

1. Read this file first.
1. Identify files to change.
1. Keep changes focused.
1. Do not rewrite unrelated code.
1. Follow existing patterns.
1. Ensure feature works end-to-end.
1. Fix errors before finishing.

### Build Order (Phases)

Always follow this order unless the user says otherwise:

|Phase|Feature                          |Key QVAC Capability     |
|-----|---------------------------------|------------------------|
|1    |Text-based MedPsy health analysis|Text Generation (MedPsy)|
|2    |Voice recording + TTS response   |Transcription + TTS     |
|3    |Health timeline + smart search   |Text Embeddings + RAG   |
|4    |Family connection via P2P        |Holepunch P2P           |
|5    |UI polish + demo preparation     |All                     |

Do not start Phase 4 if Phase 3 is broken.

-----

## QVAC SDK Rules (CRITICAL)

All AI runs on the device. No AI calls go to a cloud server.

### Model Loading

Load models once at app startup. Store the model ID in the QVAC store.

```ts
// lib/qvac.ts
import { loadModel } from "@qvac/sdk";

export const loadMedPsy = async () => {
  const modelId = await loadModel("path/to/medpsy-1.7b.gguf", {
    modelType: "llm",
  });
  return modelId;
};
```

### Health Analysis

Always use MedPsy for health-related queries. Do not use a generic model for medical reasoning.

```ts
// lib/medpsy.ts
import { completion } from "@qvac/sdk";

export const analyzeHealthUpdate = async (
  modelId: string,
  userText: string,
  pastEntries: string
) => {
  const response = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You are MedVoice, a private health assistant. You help users understand their health based on what they tell you. You are caring, clear, and always recommend professional medical advice for serious concerns. Never diagnose. Always be helpful.",
      },
      {
        role: "user",
        content: `Here is relevant context from past entries:\n${pastEntries}\n\nToday's update: ${userText}`,
      },
    ],
    stream: true,
  });
  return response.text;
};
```

### Voice Transcription

```ts
// lib/transcription.ts
import { transcribe } from "@qvac/sdk";

export const transcribeAudio = async (modelId: string, audioPath: string) => {
  const result = await transcribe({ modelId, audioPath });
  return result.text;
};
```

### Text-to-Speech

```ts
// lib/tts.ts
import { speak } from "@qvac/sdk";

export const speakResponse = async (modelId: string, text: string) => {
  await speak({ modelId, text });
};
```

### Embeddings and RAG

```ts
// lib/embeddings.ts
import { embed } from "@qvac/sdk";

export const generateEmbedding = async (
  modelId: string,
  text: string
): Promise<number[]> => {
  const result = await embed({ modelId, text });
  return result.embedding;
};

export const cosineSimilarity = (a: number[], b: number[]): number => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};
```

### P2P Family Connection

Use QVAC Holepunch for all family device connections. Both devices must be briefly online to establish the initial connection. After that, syncing happens whenever both are online.

```ts
// lib/p2p.ts
import { createP2PNode, connectToPeer } from "@qvac/sdk";

export const initP2PNode = async () => {
  const node = await createP2PNode();
  return { node, publicKey: node.publicKey };
};

export const connectFamilyMember = async (
  node: any,
  peerPublicKey: string
) => {
  const peer = await connectToPeer(node, peerPublicKey);
  return peer;
};
```

### QVAC Rules Summary

- All inference runs on device. Never send health data to an external server.
- Load models once. Reuse the model ID.
- Use MedPsy only for health analysis. Never use a general model for medical reasoning.
- Use streaming responses (`stream: true`) for better UX on slower devices.
- Unload models when the app goes to background to free memory.
- Handle model loading errors gracefully — show a friendly error screen if the model fails to load.

-----

## P2P Rules

Use QVAC Holepunch P2P only for family connection. No WiFi Direct. No Bluetooth. No third-party P2P libraries.

The Holepunch connection flow:

1. Device A generates a key pair and displays public key as a QR code
1. Device B scans the QR code
1. Both devices go online briefly to handshake via HyperDHT
1. Once connected, health summaries sync device-to-device (encrypted)
1. No server ever sees the health data — only the DHT peer discovery nodes are used

When implementing P2P:

- Generate and store the key pair in AsyncStorage on first app launch
- Never regenerate the key pair (it is the device’s permanent identity)
- Show clear connection status to the user (connecting, connected, syncing, offline)
- Sync health summaries as JSON — do not sync raw audio or embeddings
- Handle offline gracefully — queue sync and retry when connection resumes

-----

## Database Rules

Use `expo-sqlite` for all health entry storage.

Health entries live only on the local device. Never sync to a cloud database.

Schema:

```sql
CREATE TABLE IF NOT EXISTS health_entries (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  transcript TEXT NOT NULL,
  analysis TEXT NOT NULL,
  tags TEXT,              -- JSON array of auto-generated category tags e.g. ["Joint","Glucose"]
  severity TEXT,         -- "moderate" | "mild" | "good" | null
  embedding TEXT         -- JSON array of floats for semantic search
);

CREATE TABLE IF NOT EXISTS health_patterns (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  pattern_name TEXT NOT NULL,   -- e.g. "Knee Pain Pattern"
  severity TEXT NOT NULL,       -- "moderate" | "mild"
  description TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (entry_id) REFERENCES health_entries(id)
);

CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  relationship TEXT,            -- e.g. "Mother", "Son"
  public_key TEXT NOT NULL,
  connection_status TEXT,       -- "online" | "offline" | "pending"
  last_synced TEXT
);
```

Use the `db.ts` helper in `lib/` for all database operations. Do not write raw SQL in screens or components.

-----

## Linting and Validation

Run:

```bash
npm run lint
npm run typecheck
```

Fix all errors before considering a feature complete.

-----

## Communication Style

Be concise.

Explain what changed and how to test.

When a phase is complete, state clearly:

> “Phase [N] is complete. Here is how to test it: …”

-----

## Important Constraints

- No cloud database. Health data stays on device.
- No cloud AI. All inference runs via QVAC SDK on device.
- No external health APIs.
- No authentication service (no Clerk, no Firebase Auth). Users are identified by their local profile only.
- No analytics or crash reporting that sends data off device.

Use:

- SQLite for health entries
- AsyncStorage for user profile and settings
- Zustand for app state
- QVAC SDK for all AI (transcription, analysis, TTS, embeddings, RAG, P2P)
- Backend only for QVAC Holepunch peer discovery (no health data involved)

-----

## Privacy Rules (NON-NEGOTIABLE)

MedVoice is built on the promise that health data never leaves the device. Every implementation decision must respect this.

- Never log health entry content to any analytics service
- Never send transcripts, analyses, or embeddings to any external server
- Never cache health data in any cloud storage
- When in doubt, keep data local

If a feature would require sending health data off device, raise it with the user before implementing:

> “This feature would require sending health data to an external service. This conflicts with MedVoice’s privacy promise. Can we find a local alternative?”

-----

## Final Reminder

Before every feature implementation:

- Read this file
- Follow it strictly
- Build clean, simple, teachable code
- Replicate UI exactly when designs are provided
- Never compromise on the privacy promise — health data stays on device, always