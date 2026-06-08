# MedVoice — Screen Implementation Prompts (v2)

## Based on final designs. 5 tab routes + sub-pages.

-----

## NAVIGATION STRUCTURE

```
Tabs (bottom nav — exactly 5):
  HOME · TIMELINE · FAMILY · CARE VIEW · SETTINGS

Onboarding (shown once on first launch):
  (onboarding)/welcome   — Splash + features
  (onboarding)/role      — Role selection
  (onboarding)/profile   — Profile form

Sub-pages (pushed on top of tabs, not tabs themselves):
  recording/ready        — Ready to listen (from HOME tap)
  recording/active       — Active recording with waveform
  analysis/processing    — MedPsy pipeline steps
  analysis/result        — Full MedPsy analysis + patterns
  family/show-code       — QR code display
  family/scan-code       — Camera QR scanner
```

-----

## PROMPT 00A — Onboarding: Welcome Screen

```
Read AGENTS.md first and follow it strictly.

Implement the first onboarding screen at (onboarding)/welcome exactly as
shown in the attached design.

This is a full-screen dark layout (#111827). At the very top show a progress
dot indicator: 3 dots in a row, first dot active (blue #3b82f6, wider pill
shape ~24px wide), remaining two dots inactive (gray, 8px circles). Center
the dots horizontally near the top of the screen.

In the upper-center area show a large circle (120px diameter) with a dark
blue background (#151d2e) and a subtle blue glow. Inside the circle show a
heart emoji (❤️) centered at 52px size.

Below the circle show the app name "MedVoice" in Georgia serif 32px white
bold, centered. Below that show the tagline "Your Private Health Companion"
in Georgia serif italic 18px #3b82f6 (accent blue), centered.

Below the tagline show a description paragraph centered: "AI-powered health
insights that live entirely on your phone. Your data never leaves your device.
Ever." Georgia serif 14px #8b9bb4 lineHeight 22, max width 280px centered.

Below the description show three feature rows. Each row is a full-width card
(background #151d2e, border #1e293b, radius 14px, padding 16px). Each row
has an emoji icon on the left (48px container) and text on the right:
  Row 1: 🎙 "Speak naturally about how you feel"
  Row 2: 🧠 "MedPsy AI analyzes your health locally"
  Row 3: 📡 "Share with family via private P2P"
Text is Georgia serif 15px white. Rows have 10px gap between them.

At the bottom, fixed, show a full-width "GET STARTED →" button. Background
#3b82f6, radius 14px, height 54px, monospace uppercase 14px white bold.

When pressed navigate to (onboarding)/role.

Extract components:
  components/OnboardingProgressDots.tsx
  components/FeatureRow.tsx

@prompt_material/00a-onboarding-welcome.png
```

-----

## PROMPT 00B — Onboarding: Role Selection

```
Read AGENTS.md first and follow it strictly.

Implement the role selection screen at (onboarding)/role exactly as shown
in the attached design.

Progress dots at the top: dot 1 filled (past), dot 2 active (blue pill),
dot 3 inactive. Same OnboardingProgressDots component from previous screen.

Show the heading in two lines:
  Line 1: "How will you use" — Georgia serif 28px white bold
  Line 2: "MedVoice?" — Georgia serif 28px #3b82f6 italic

Below the heading show the subtext: "We'll personalise the app for you."
Georgia serif 14px #8b9bb4.

Below the subtext show two large selectable role cards stacked vertically
with 14px gap. Each card has:
  - background #151d2e, border 1.5px #1e293b, radius 16px, padding 20px
  - emoji icon in a dark circle on the left (44px container)
  - title in Georgia serif 17px white bold
  - description below title in Georgia serif 13px #8b9bb4 lineHeight 20

  Card 1:
    emoji: 🧑
    title: "I am tracking my own health"
    description: "Log daily symptoms, get AI insights, stay on top of your
    wellbeing"

  Card 2:
    emoji: 👥
    title: "I am caring for a family member"
    description: "Monitor a loved one's health, receive updates, stay
    connected privately"

When a card is selected:
  - border changes to 1.5px #3b82f6
  - background changes to rgba(59, 130, 246, 0.08)
  - a blue checkmark appears in the top-right corner of the card

At the bottom show two side-by-side buttons (equal width, 12px gap):
  Left: "← BACK" — background transparent, border 1.5px #1e293b, radius
        12px, height 52px, monospace 13px #8b9bb4
  Right: "CONTINUE →" — background #151d2e, border 1.5px #1e293b, radius
         12px, height 52px, monospace 13px #8b9bb4 when no role selected.
         When a role IS selected: background #3b82f6, border #3b82f6,
         text white, enabled.

BACK navigates to (onboarding)/welcome.
CONTINUE (when enabled) navigates to (onboarding)/profile.

Save selected role to Zustand useUserStore as role: 'patient' | 'caregiver'.

Extract components:
  components/RoleCard.tsx
  components/OnboardingNavButtons.tsx

@prompt_material/00b-onboarding-role.png
```

-----

## PROMPT 00C — Onboarding: Profile Form

```
Read AGENTS.md first and follow it strictly.

Implement the profile form screen at (onboarding)/profile exactly as shown
in the attached design.

Progress dots at the top: dots 1 and 2 filled (past), dot 3 active (blue pill).

Show the heading in two lines:
  Line 1: "Tell us about" — Georgia serif 28px white bold
  Line 2: "yourself" — Georgia serif 28px #3b82f6 italic

Below the heading show the subtext: "Stored only on your device. Never
shared." Georgia serif 13px #8b9bb4.

Below show four form fields stacked with 16px gap:

  Field 1 — YOUR NAME *:
    Label: "YOUR NAME *" monospace 11px #8b9bb4 letter-spacing 0.12em
    Input: TextInput, background #151d2e, border 1.5px #1e293b, radius 12px,
    height 56px, padding 16px, Georgia serif 16px white.
    Placeholder: empty (shown filled with "Eleanor" in design)
    Use StyleSheet for TextInput as per AGENTS.md rules.

  Field 2 — AGE *:
    Label: "AGE *" same as above
    Input: same styling, keyboardType="numeric"
    Placeholder: empty (shown with "68")

  Field 3 — KNOWN CONDITIONS (OPTIONAL):
    Label: "KNOWN CONDITIONS (OPTIONAL)"
    Input: same styling, multiline false
    Placeholder: "e.g. Type 2 diabetes, arthritis" in #4a5568

  Field 4 — CURRENT MEDICATIONS (OPTIONAL):
    Label: "CURRENT MEDICATIONS (OPTIONAL)"
    Input: same styling
    Placeholder: "e.g. Metformin 500mg" in #4a5568

Wrap the entire form in a KeyboardAvoidingView (use StyleSheet, not
NativeWind, as per AGENTS.md exception rules).

At the bottom show two buttons side by side:
  Left: "← BACK" — same style as previous screen back button
  Right: "LET'S GO 🎉" — background #151d2e, border 1.5px #1e293b, radius
         12px, height 52px, monospace 13px #8b9bb4 when Name is empty.
         When Name is filled: background #3b82f6, border #3b82f6,
         text white, enabled.

When "LET'S GO" is pressed:
  1. Save name, age, conditions, medications to useUserStore
  2. Save to AsyncStorage with key 'user_profile'
  3. Set onboarding complete flag in AsyncStorage: 'onboarding_complete' = 'true'
  4. Navigate to (tabs)/index (the HOME tab)

@prompt_material/00c-onboarding-profile.png
```

-----

## PROMPT 01 — Home Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Home screen at (tabs)/index exactly as shown in the attached
design. This is the main screen users see after onboarding.

At the top left show the date in monospace uppercase: "THURSDAY, JUNE 5"
in 11px #8b9bb4 letter-spacing 0.12em.

At the top right show a circular settings icon button (38px diameter,
background #151d2e, border #1e293b). Tapping navigates to (tabs)/settings.

Below the date row show the greeting in two lines:
  Line 1: "Good morning," — Georgia serif 28px white bold
  Line 2: User's name from useUserStore — Georgia serif 28px #34d399 italic

Below the greeting show the ALL DATA ON-DEVICE privacy badge. Pill shape,
background rgba(52, 211, 153, 0.12), border rgba(52, 211, 153, 0.3),
radius 99px, padding 6px 14px. Green dot (#34d399) 6px on left, then
"ALL DATA ON-DEVICE" monospace 10px #34d399 letter-spacing 0.1em.

Below the badge show the "Tap to Talk" microphone card. This is the primary
action element. Large rounded card (radius 20px, background #151d2e,
border #1e293b, padding 32px 24px). Inside:
  - Centered blue glowing circle (72px diameter, background #3b82f6 with
    rgba(59,130,246,0.3) shadow/glow effect spreading 20px outward)
  - Inside the circle: white microphone icon 28px
  - Below circle: "Tap to Talk" Georgia serif 22px white bold centered
  - Below heading: "Tell me how you feel today" Georgia serif 14px #8b9bb4
    centered

The entire card is a Pressable. When pressed navigate to recording/ready.
Use StyleSheet for the glow shadow effect.

Below the microphone card show the "RECENT ENTRIES" section header row:
  Left: "RECENT ENTRIES" monospace 11px #8b9bb4 letter-spacing 0.12em
  Right: "SEE ALL →" monospace 11px #3b82f6

Tapping "SEE ALL →" navigates to (tabs)/timeline.

Below the header show the 3 most recent health entries from useHealthStore,
loaded from SQLite. Each entry uses the RecentEntryCard component.

RecentEntryCard shows:
  - Top row: colored severity dot (red/yellow/green) + timestamp + "LATEST"
    badge on the most recent entry (monospace 10px #3b82f6, no border)
  - Transcript snippet in Georgia serif italic 14px #8b9bb4, truncated to
    2 lines
  - Category tag pills in a row (background #1e293b, monospace 10px #8b9bb4,
    radius 99px, padding 3px 10px)
  Card: background #151d2e, border #1e293b, radius 16px, padding 14px 16px

If no entries exist show a friendly empty state: microphone emoji, "No
entries yet" Georgia 15px #8b9bb4, "Tap the microphone above to get started"
Georgia 13px #4a5568.

Bottom nav: HOME active (gold/white icon + label + blue dot below).

Extract components:
  components/PrivacyBadge.tsx
  components/TapToTalkCard.tsx
  components/RecentEntryCard.tsx

@prompt_material/01-home.png
```

-----

## PROMPT 02 — Recording: Ready to Listen

```
Read AGENTS.md first and follow it strictly.

Implement the Ready to Listen screen at route recording/ready exactly as
shown in the attached design. This screen is pushed when the user taps
the Tap to Talk card on the Home screen.

This is a full-screen layout, no bottom tab bar visible.

At the top left show "← BACK" in monospace 12px #8b9bb4. Tapping pops
back to Home.

Centered near the top show the label "READY TO LISTEN" in monospace 11px
#8b9bb4 letter-spacing 0.18em.

Below the label show a large dark circle (160px diameter, background
#151d2e, border 2px #1e293b, subtle dark glow). Inside the circle show
a microphone icon in #8b9bb4 at 52px. This is the decorative/idle state
microphone — it does NOT animate yet.

Below the circle show the heading "How are you feeling?" Georgia serif
28px white bold centered.

Below the heading show the description centered: "Tap the button below and
speak naturally. MedPsy will analyze your health update on this device."
Georgia serif 14px #8b9bb4 lineHeight 22 centered, max width 280px.

At the bottom of the screen (positioned low, fixed above safe area) show
the active "Tap to start" button:
  - Large circle 80px diameter
  - Background #3b82f6 with a rgba(59,130,246,0.35) glow ring around it
    (~100px outer diameter, the ring is 10px wide and semi-transparent)
  - White microphone icon inside, 28px
  - "Tap to start" text below the button in Georgia serif 13px #8b9bb4

The glow ring on the blue button should pulse slowly using Animated.Value
(opacity oscillating between 0.3 and 0.8, duration 1500ms, loop). Use
StyleSheet for the Animated.View.

When the button is tapped:
  1. Request microphone permission (expo-av)
  2. If granted, navigate to recording/active
  3. If denied, show an alert explaining why the permission is needed

Extract components:
  components/ReadyMicDisplay.tsx
  components/PulsingMicButton.tsx

@prompt_material/02-recording-ready.png
```

-----

## PROMPT 03 — Recording: Active Recording

```
Read AGENTS.md first and follow it strictly.

Implement the Active Recording screen at route recording/active exactly as
shown in the attached design. This screen is pushed from recording/ready
when the user taps "Tap to start".

This is a full-screen dark layout (#111827), no bottom tab bar.

At the top show "BACK" with a left arrow in monospace 12px #8b9bb4 top-left.
Tapping stops recording, discards transcript, and pops to Home.

Centered near the top show "LISTENING • ON DEVICE" in monospace 11px
#8b9bb4 letter-spacing 0.14em. The dot is a bullet character •.

Below the label show the waveform animation. This is 18 vertical bars
arranged in a row, centered horizontally. Each bar is:
  - Width: 3px
  - Border radius: 2px
  - Color: gradient between #3b82f6 (taller bars) and #7dd3fc (shorter bars)
  - Each bar animates independently using Animated.Value
  - Height oscillates between a min and max using a looping animation
  - Staggered delays (i * 80ms) so they don't all move together
  - Bar heights vary: alternate between short (6-10px min) and tall (28-36px
    max) so the waveform has visual variety

Use StyleSheet for all bar animations. Do not use NativeWind for animated
values.

Below the waveform show the live transcript card:
  - Background: rgba(21, 29, 46, 0.9)
  - Border: #1e293b
  - Radius: 16px
  - Padding: 20px
  - Georgia serif italic 16px white lineHeight 26
  - Text appears word by word as QVAC Transcription returns chunks
  - Show a blinking cursor "|" at the end using a separate Animated opacity
    (opacity 0 to 1, 500ms, loop)
  - If no text yet: show "Listening..." in #4a5568

At the bottom center show the large stop button:
  - Circle 72px diameter
  - Background #f87171 (warning red)
  - Red glow using StyleSheet shadow: shadowColor #f87171, shadowRadius 20,
    shadowOpacity 0.5, elevation 12
  - White square stop icon inside (20px × 20px white rectangle)
  - Below button: "Tap to stop & analyze" Georgia serif 13px #8b9bb4

When stop button is pressed:
  1. Stop audio recording
  2. Stop waveform animation
  3. Save final transcript to useRecordingStore
  4. Navigate to analysis/processing

Extract components:
  components/WaveformAnimation.tsx  (max 200 lines — animation logic lives here)
  components/LiveTranscriptCard.tsx
  components/StopRecordingButton.tsx

@prompt_material/03-recording-active.png
```

-----

## PROMPT 04 — Analysis: Processing Pipeline

```
Read AGENTS.md first and follow it strictly.

Implement the Analysis Processing screen at route analysis/processing exactly
as shown in the attached design.

This screen is navigated to automatically when the user stops recording.
It reads the transcript from useRecordingStore and immediately begins the
MedPsy pipeline. No bottom tab bar visible.

At the top left show "← BACK" monospace 12px #8b9bb4.

Below BACK show the label "MEDPSY PROCESSING" monospace 11px #8b9bb4
letter-spacing 0.14em.

Below the label show the heading in two lines:
  Line 1: "Analyzing your" — Georgia serif 32px white bold
  Line 2: "health entry" — Georgia serif 32px #3b82f6 italic

Below the heading show the pipeline steps list. Exactly 5 steps, each on
its own row with 16px gap between rows.

Each PipelineStepRow contains:
  - Icon container: 44px × 44px, background #151d2e, border #1e293b,
    radius 12px, centered emoji
  - Label text: monospace 14px white, flex 1, wraps if long
  - Status indicator on the right: nothing (pending), animated blue underline
    (running), or green checkmark ✓ #34d399 (done)

Steps in order:
  1. 🎙 "Transcribing voice input ..."     → runs immediately on mount
  2. 🧠 "MedPsy-4B analyzing health entry ..."  → starts after step 1 done
  3. 🔍 "Scanning health history ..."       → starts after step 2 done
  4. 📊 "RAG context retrieval ..."         → starts after step 3 done
  5. ✅ "Analysis complete"                 → final step, icon has green bg

Step 5 icon container has background #34d399 (filled green) with a white
checkmark inside, not an emoji — it's always green regardless of status.

The "running" indicator is a short animated line (20px wide, 2px height,
#3b82f6) that animates with a loading shimmer (opacity pulse).
Use StyleSheet + Animated for the running indicator.

Pipeline execution logic (all in useAnalysisStore or local state):
  Step 1: Call QVAC transcription on the audio file from useRecordingStore.
          Mark done when transcription is returned.
  Step 2: Call QVAC completion() with MedPsy model using the transcript.
          Mark done when response received.
  Step 3: Query SQLite for past 30 entries. Mark done immediately after.
  Step 4: Call QVAC embed() on the transcript, find top 3 similar past
          entries by cosine similarity. Mark done when complete.
  Step 5: Mark done 500ms after step 4. Then after 800ms auto-navigate
          to analysis/result.

Each step transition has a 200ms delay before the next starts.

Extract components:
  components/PipelineStepRow.tsx

@prompt_material/04-analysis-processing.png
```

-----

## PROMPT 05 — Analysis: Results

```
Read AGENTS.md first and follow it strictly.

Implement the Analysis Results screen at route analysis/result exactly as
shown in the attached design. This screen is auto-navigated to after the
pipeline completes.

No bottom tab bar. At the top left show "← BACK" monospace 12px #8b9bb4.
Below BACK show "MEDPSY ANALYSIS" monospace 11px #8b9bb4 letter-spacing 0.12em.

First card — YOU SAID:
  - Label: "YOU SAID" monospace 10px #8b9bb4 letter-spacing 0.12em
  - Below label: the original transcript in Georgia serif italic 15px
    #8b9bb4 lineHeight 24, wrapped in quotes
  - Background #1e293b, radius 16px, padding 18px, border #1e293b

Second card — Concern level banner:
  For MODERATE CONCERN:
    Background rgba(248, 113, 113, 0.1), border rgba(248,113,113,0.25),
    radius 14px, padding 16px
    - Left: ⚠️ emoji 22px
    - Top text: "MODERATE CONCERN" monospace 13px #f87171 bold, letter-spacing 0.1em
    - Below text: "· 2 patterns flagged" monospace 11px #f87171
    - Below that: "Review MedPsy's findings below" Georgia 13px #8b9bb4
  For MILD: use #fbbf24 colors and "MILD CONCERN"

Pattern cards (one per pattern identified by MedPsy):

  Each PatternCard contains:
    HEADER ROW:
      - Emoji icon left: 🦵 joint, 🩸 glucose, 💤 sleep, ⚡ energy
      - Pattern name: Georgia serif 18px white bold
      - Severity badge below name: rounded pill border 1.5px, padding 3px 10px,
        monospace 10px. MODERATE = #f87171. MILD = #fbbf24.

    DESCRIPTION:
      Georgia serif 14px #8b9bb4 lineHeight 22

    Pattern card: background #1e293b, radius 16px, padding 18px,
    border 1px #1e293b, gap 12px between header/description.

At the bottom, fixed above safe area, show two buttons side by side (12px gap):
  Left — READ ALOUD:
    Background #151d2e, border #1e293b, radius 12px, height 52px
    🔊 icon left + "READ ALOUD" monospace 11px #8b9bb4
    When tapped: call QVAC TTS speakResponse() with the full analysis text.
    While playing: icon becomes ⏹ and label becomes "STOP". Tap again stops.

  Right — SAVE:
    Background #3b82f6, radius 12px, height 52px, border none
    💾 icon left + "SAVE" monospace 11px white
    When tapped:
      1. Save health entry to SQLite via db.ts with all pattern data
      2. Add to useHealthStore.entries
      3. Navigate to (tabs)/index (Home)
      4. Show a brief success state on Home screen

Extract components:
  components/YouSaidCard.tsx
  components/ConcernBanner.tsx
  components/PatternCard.tsx
  components/AnalysisActionButtons.tsx

@prompt_material/05-analysis-result.png
```

-----

## PROMPT 06 — Timeline Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Timeline screen at (tabs)/timeline exactly as shown in the
attached design (default state and search state).

HEADING:
Two lines top-left:
  Line 1: "Health" — Georgia serif 36px white bold
  Line 2: "Timeline" — Georgia serif 36px #3b82f6 italic

SEARCH BAR:
Full-width rounded input (background #151d2e, border #1e293b, radius 14px,
height 52px, padding 0 16px). Left side has a search icon 🔍 in #8b9bb4.
Placeholder: 'Ask anything — "When did my knee pain star...' in #4a5568
Georgia serif 14px.

When the user types, the search uses QVAC RAG to find semantically matching
entries. On each keystroke (debounced 300ms): generate embedding for the query
text, compare against stored entry embeddings in SQLite, return top matches.
When search is active, show an × clear button on the right of the input.

TIMELINE LIST:
A scrollable list of health entries from useHealthStore (SQLite, sorted
newest first). A vertical line runs down the left side of the list
(2px wide, #1e293b). At each entry a colored dot sits on the line.

Each TimelineEntryCard contains:
  LEFT SIDE: colored dot (8px) aligned to the vertical timeline line.
    Red #f87171 for moderate, yellow #fbbf24 for mild, green #34d399 for good.

  CARD (takes up remaining width):
    Background #151d2e, border #1e293b, radius 16px, padding 16px.

    HEADER ROW: timestamp (Georgia 13px #8b9bb4) + chevron ↓ on the right
    (#8b9bb4). Tapping the card expands/collapses it (default: expanded).

    TRANSCRIPT: Full transcript text in Georgia serif italic 15px #8b9bb4
    lineHeight 24, wrapped in quotes.

    FOOTER ROW: tag pills on the left + severity badge on the right.
      Tags: background #1e293b, border #1e293b, monospace 10px #8b9bb4,
      radius 99px, padding 3px 10px.
      Severity badge:
        MODERATE: border 1.5px #f87171, text #f87171, monospace 10px,
        radius 4px, padding 3px 8px
        MILD: border 1.5px #fbbf24, text #fbbf24
        GOOD: border 1.5px #34d399, text #34d399

  When collapsed, hide the transcript and footer, show only the header row.
  Use LayoutAnimation for smooth expand/collapse.

EMPTY STATE (no entries or no search results):
  Center: magnifying glass emoji, "No entries found" Georgia 15px #8b9bb4,
  relevant subtext in #4a5568.

Bottom tab: TIMELINE active (blue icon + blue text + blue dot below).

Extract components:
  components/TimelineSearchBar.tsx
  components/TimelineEntryCard.tsx  (max 200 lines)
  components/TimelineVerticalLine.tsx

@prompt_material/06-timeline.png
@prompt_material/06b-timeline-search.png
```

-----

## PROMPT 07 — Family Connection Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Family Connection screen at (tabs)/family exactly as shown
in the attached design.

HEADING:
Two lines top-left:
  Line 1: "Family" — Georgia serif 32px white bold
  Line 2: "Connection" — Georgia serif 32px #34d399 italic
Below: "Private P2P · No cloud server" Georgia serif 13px #8b9bb4.

P2P STATUS BANNER:
Full-width rounded card (radius 14px, border 1.5px #34d399, background
rgba(52,211,153,0.08), padding 14px 16px).
  - Green dot (#34d399) 8px on left
  - "P2P MESH ACTIVE · N CONNECTED" monospace 13px #34d399 (N = count of
    online members from useFamilyStore)
  - If no members: "P2P INACTIVE · NO CONNECTIONS" in #8b9bb4 with gray dot

CONNECTED SECTION:
Label "CONNECTED" monospace 10px #8b9bb4 letter-spacing 0.12em, margin-bottom 10px.

For each member in useFamilyStore.members, show a FamilyMemberCard:
  - Avatar circle 44px: for online members background rgba(52,211,153,0.12)
    border 2px #34d399. For offline: background #1e293b, border 2px #4a5568.
    First initial of name in Georgia serif 18px bold, matching border color.
  - Name Georgia serif 15px white bold
  - Below name: "[Relationship] · [last seen]" monospace 11px #8b9bb4
  - Right side: status badge
    ONLINE: border 1.5px #34d399, text #34d399, monospace 10px
    OFFLINE: border 1.5px #4a5568, text #4a5568
  Card: background #151d2e, border #1e293b, radius 16px, padding 14px 16px

ADD A FAMILY MEMBER SECTION:
Label "ADD A FAMILY MEMBER" monospace 10px #8b9bb4 letter-spacing 0.12em.

Two equal-width cards side by side (12px gap):
  Card 1 — SHOW MY CODE:
    Background #151d2e, border #1e293b, radius 16px, padding 20px
    QR icon (📱 or SVG QR icon) centered, 28px, #34d399
    "SHOW MY CODE" monospace 12px #34d399 centered below icon
    Tapping navigates to family/show-code

  Card 2 — SCAN CODE:
    Same styling
    Camera icon 📷 centered, 28px, #34d399
    "SCAN CODE" monospace 12px #34d399 centered below icon
    Tapping navigates to family/scan-code

HOW P2P WORKS CARD:
Rounded card (background #151d2e, border #1e293b, radius 14px, padding 18px).
Label "HOW P2P WORKS" monospace 10px #8b9bb4 letter-spacing 0.12em, margin-bottom 14px.
Four numbered steps, each row:
  - Number circle: 22px diameter, background #1e293b, Georgia serif 12px #3b82f6
  - Text: Georgia serif 13px #8b9bb4
  Steps:
    1 "Both phones need internet briefly"
    2 "One person shows their QR code"
    3 "The other person scans it"
    4 "Connected! Health updates sync automatically"

On mount: initialize QVAC Holepunch P2P node via lib/p2p.ts. Poll connection
status every 30 seconds. Update useFamilyStore.members accordingly.

Bottom tab: FAMILY active.

Extract components:
  components/P2PStatusBanner.tsx
  components/FamilyMemberCard.tsx
  components/AddFamilyMemberCards.tsx
  components/HowP2PWorksCard.tsx

@prompt_material/07-family.png
```

-----

## PROMPT 08 — Family: Show My Code

```
Read AGENTS.md first and follow it strictly.

Implement the Show My Code screen at route family/show-code exactly as
shown in the attached design. Pushed on top of the Family tab, not a tab.

At the top left show "← BACK" monospace 12px #8b9bb4. Tapping pops back.

Show the heading "Your Device Code" Georgia serif 26px white bold centered.
Below: "Ask your family member to scan this code with their MedVoice app"
Georgia serif 14px #8b9bb4 centered, max width 260px.

Below the heading show the QR code. Generate it from this device's Holepunch
public key using the react-native-qrcode-svg library (ask user permission
before installing). Display in a white card (background white, radius 20px,
padding 20px, 240px × 240px) centered on screen.

Below the QR card show the status pill:
  Background rgba(52,211,153,0.12), border rgba(52,211,153,0.3), radius 99px,
  padding 10px 20px. Green dot 6px left. "WAITING FOR SCAN..." monospace 12px
  #34d399. The green dot pulses (opacity animation 0.4 to 1, 1000ms loop).

Below the status pill show the note centered:
  "This code is unique to your device." Georgia 13px #8b9bb4
  "Health data is encrypted end-to-end." Georgia 13px #8b9bb4

When another device successfully scans and connects:
  - Status pill changes to "CONNECTED ✓" with solid green background
  - After 1500ms show a name input bottom sheet modal:
    "Who just connected?" heading
    Text input for their name + relationship picker
    Confirm saves to useFamilyStore and pops back to Family screen

Bottom tab bar remains visible (FAMILY active).

Extract components:
  components/DeviceQRCode.tsx
  components/WaitingForScanStatus.tsx

@prompt_material/08-family-show-code.png
```

-----

## PROMPT 09 — Family: Scan Code

```
Read AGENTS.md first and follow it strictly.

Implement the Scan Code screen at route family/scan-code exactly as shown
in the attached design. Pushed on top of the Family tab.

At the top left show "← BACK" monospace 12px #8b9bb4. Tapping pops back.

Show the heading "Scan Family Member's Code" Georgia serif 24px white bold.
Below: "Point your camera at their QR code" Georgia serif 14px #8b9bb4.

Below the heading show the camera viewfinder area. This is a rounded
rectangle (radius 16px, border #1e293b, approximately 300px × 220px,
centered) that renders the live camera preview using expo-camera.

In each of the 4 corners of the viewfinder, render a blue corner bracket
(25px per side, 3px thick, #3b82f6). These are decorative overlays using
absolute positioning in StyleSheet.

In the center of the viewfinder before a QR is detected: "Camera preview"
text in #4a5568 Georgia 13px.

Below the viewfinder show the instruction:
  "The code will be detected automatically."
  "No need to tap anything."
  Georgia serif 13px #8b9bb4 centered lineHeight 22.

Use expo-barcode-scanner or expo-camera with barcode scanning enabled to
detect QR codes automatically. When a QR code is detected:
  1. Pause camera
  2. Extract the peer public key from the QR data
  3. Show a brief "Code detected!" success overlay on the viewfinder
  4. After 500ms show a bottom sheet modal:
     "Who is this?" Georgia 17px white bold
     TextInput for name (monospace styled, background #151d2e)
     Relationship picker: Mother, Father, Son, Daughter, Spouse, Other
     "CONNECT →" button (#3b82f6)
  5. On confirm: call lib/p2p.ts connectFamilyMember(), add to
     useFamilyStore, pop back to Family screen

Request camera permission on mount. If denied show an error state with
instructions to enable in Settings.

Bottom tab bar remains visible (FAMILY active).

Extract components:
  components/QRScannerViewfinder.tsx
  components/CornerBrackets.tsx

@prompt_material/09-family-scan-code.png
```

-----

## PROMPT 10 — Care View Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Care View screen at (tabs)/care-view exactly as shown in the
attached design. This screen is for caregivers who are monitoring a family
member's health.

At the top left show "MONITORING" monospace 10px #8b9bb4 letter-spacing 0.12em.
At the top right show a "● LIVE" badge: green dot + "LIVE" monospace 10px #34d399
in a pill (background rgba(52,211,153,0.12), border rgba(52,211,153,0.3),
radius 99px, padding 4px 10px).

Below show the monitored person's name heading:
  Line 1: "[Name]'s" — Georgia serif 32px white bold (name from connected
           family member in useFamilyStore)
  Line 2: "Health" — Georgia serif 32px #34d399 italic

CONCERN FLAGGED BANNER (show only if latest entry has patterns):
  Background rgba(248,113,113,0.1), border rgba(248,113,113,0.2), radius 14px,
  padding 14px 16px.
  🔔 emoji left, "CONCERN FLAGGED" monospace 13px #f87171 bold, below:
  "MedPsy flagged N items in today's entry" Georgia 13px #8b9bb4.

LATEST ENTRY CARD:
  Background #151d2e, border #1e293b, radius 16px, padding 18px.
  Header row: "LATEST ENTRY" monospace 10px #3b82f6 left + "Today · 8:14 AM"
  Georgia 12px #8b9bb4 right.
  Horizontal divider #1e293b 1px, margin 12px 0.
  Transcript in Georgia serif italic 15px #8b9bb4 lineHeight 24, quoted.
  Horizontal divider, then:
  "MEDPSY SUMMARY" monospace 10px #8b9bb4 letter-spacing 0.1em, margin-bottom 8px.
  Summary text Georgia serif 14px #8b9bb4 lineHeight 22.
  Tag pills row below summary (same style as elsewhere).

RECENT ENTRIES · READ ONLY SECTION:
  Label: "RECENT ENTRIES · READ ONLY" monospace 10px #8b9bb4.
  List of CareViewEntryRow components — simpler than full timeline cards:
    - Colored dot (severity) on left with a vertical colored line connecting
      to the next entry
    - Timestamp Georgia 12px #8b9bb4
    - Transcript snippet Georgia italic 13px #8b9bb4, 2 lines max, quoted

The colored left border line uses the severity color of that entry
(#f87171, #fbbf24, or #34d399).

All data shown here comes from P2P sync via useFamilyStore. It is READ-ONLY.
No editing, no adding, no deleting. The caregiver only views.

If no family member connected yet: show an empty state with a family emoji,
"No one connected yet" Georgia 15px #8b9bb4, and a button "Connect a family
member →" (#3b82f6) that navigates to (tabs)/family.

Bottom tab: CARE VIEW active.

Extract components:
  components/LiveMonitoringBadge.tsx
  components/ConcernFlaggedBanner.tsx
  components/LatestEntryCard.tsx
  components/CareViewEntryRow.tsx

@prompt_material/10-care-view.png
```

-----

## PROMPT 11 — Settings Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Settings screen at (tabs)/settings exactly as shown in the
attached design.

HEADING: "Settings" Georgia serif 28px white bold.

PROFILE CARD:
Background #151d2e, border #1e293b, radius 16px, padding 16px. Row layout:
  - Avatar circle 44px: background #3b82f6, first initial Georgia serif 20px
    white bold
  - Name Georgia serif 16px white bold
  - Below name: "Age [N] · [first condition]" Georgia 13px #8b9bb4

Tapping the profile card navigates to settings/edit-profile (push screen
where user can edit name, age, conditions, medications — same form layout
as onboarding profile step).

AI MODEL SECTION:
Section label "AI MODEL" monospace 10px #8b9bb4 letter-spacing 0.12em.
Three SettingsRow items in a card (background #151d2e, border #1e293b,
radius 16px, overflow hidden):

  Row 1 — MedPsy Model:
    Icon: 🧠 in a pink/red circle background
    Label: "MedPsy Model" Georgia 15px white
    Right value: "4B · Active" — "Active" in #34d399, rest #8b9bb4

  Row 2 — Storage used:
    Icon: 💾 in a gray circle
    Label: "Storage used" Georgia 15px white
    Right value: "2.6 GB" monospace 13px #8b9bb4

  Row 3 — Network mode:
    Icon: 📡 in a gray circle
    Label: "Network mode" Georgia 15px white
    Right value: "Offline" monospace 13px #8b9bb4

PRIVACY SECTION:
Section label "PRIVACY" same style.
Three SettingsRow items:

  Row 1 — Data location:
    Icon: 🔒 orange bg
    Label: "Data location"
    Right: "On-device only" monospace 13px #34d399

  Row 2 — Cloud sync:
    Icon: 🛡️ red bg
    Label: "Cloud sync"
    Right: "Disabled" monospace 13px #f87171

  Row 3 — P2P encryption:
    Icon: 🔑 orange bg
    Label: "P2P encryption"
    Right: "Enabled" monospace 13px #34d399

ABOUT SECTION:
Section label "ABOUT" same style.
Three SettingsRow items:

  Row 1 — Powered by:
    Icon: ⚡ yellow bg
    Label: "Powered by"
    Right: "QVAC SDK" monospace 13px #8b9bb4

  Row 2 — License:
    Icon: 📄 gray bg
    Label: "License"
    Right: "Apache 2.0" monospace 13px #8b9bb4

  Row 3 — Hackathon:
    Icon: 🏆 yellow bg
    Label: "Hackathon"
    Right: "QVAC Unleash Edge AI" monospace 11px #8b9bb4

All values in the right column are right-aligned and non-interactive
(display only). None of the privacy rows are toggleable — they are
read-only status displays showing MedVoice's built-in privacy guarantees.

SettingsRow pattern: horizontal row, icon container 36px × 36px radius
10px left, label flex-1, value right. Each row has a bottom border #1e293b
1px except the last row in each section.

Bottom tab: SETTINGS active (blue icon + blue text + blue dot).

Extract components:
  components/ProfileCard.tsx
  components/SettingsSection.tsx
  components/SettingsRow.tsx

@prompt_material/11-settings.png
```

-----

## USAGE NOTES

### Image naming for prompt_material/ folder

```
00a-onboarding-welcome.png    → Image 13 (heart, GET STARTED)
00b-onboarding-role.png       → Image 14 (How will you use MedVoice?)
00c-onboarding-profile.png    → Image 15 (Tell us about yourself)
01-home.png                   → Image 1/16 (Good morning, Fuad)
02-recording-ready.png        → Image 4/19 (Ready to Listen)
03-recording-active.png       → Image 5/20 (waveform + transcript)
04-analysis-processing.png    → Image 6 (Analyzing your health entry)
05-analysis-result.png        → Image 7 (MEDPSY ANALYSIS)
06-timeline.png               → Image 2/17 (Health Timeline default)
06b-timeline-search.png       → Image 3/18 (Timeline with search active)
07-family.png                 → Image 8 (Family Connection)
08-family-show-code.png       → Image 9 (Your Device Code QR)
09-family-scan-code.png       → Image 10 (Scan Family Member's Code)
10-care-view.png              → Image 12 (Mama's Health)
11-settings.png               → Image 11 (Settings)
```

### Build order

```
Phase 1 → Prompts 00A, 00B, 00C  (Onboarding)
Phase 2 → Prompt 01              (Home)
Phase 3 → Prompts 02, 03         (Recording flow)
Phase 4 → Prompts 04, 05         (Analysis flow)
Phase 5 → Prompt 06              (Timeline)
Phase 6 → Prompts 07, 08, 09     (Family + sub-pages)
Phase 7 → Prompt 10              (Care View)
Phase 8 → Prompt 11              (Settings)
```

### Rules reminder

- Screen files: max 150 lines
- Component files: max 200 lines
- Extract before you exceed — plan components first
- Use StyleSheet for: SafeAreaView, Animated.View, TextInput, shadows, transforms
- Use NativeWind for everything else
- Run npm run lint + npm run typecheck after each prompt
- Commit to GitHub after each prompt passes checks