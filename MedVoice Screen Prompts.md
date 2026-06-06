# MedVoice — Screen Implementation Prompts

## One prompt per screen. Use these when coding each feature with an AI agent.

-----

## PROMPT 00 — Onboarding Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Onboarding screen. This is the first screen the user sees when 
they open MedVoice for the very first time. It should never appear again after 
setup is complete.

The screen has three steps shown as a progress indicator at the top (Step 1 of 3, 
Step 2 of 3, Step 3 of 3).

STEP 1 — Role Selection:
Show the MedVoice logo and name at the top. Below it show two large selectable 
cards side by side. The first card says "I am tracking my health" with a 
microphone icon. The second card says "I am caring for a family member" with a 
people icon. Only one card can be selected at a time. The selected card has a 
blue border (#3b82f6) and a subtle blue background tint. A "Continue" button is 
at the bottom, disabled until a role is selected.

STEP 2 — Personal Profile:
Show a form with the following fields: Name (text input), Age (numeric input). 
Below that show two optional sections that can be expanded: "Any known health 
conditions?" (text tags input, user types and presses enter to add tags) and 
"Current medications?" (same tag input pattern). Each optional section has a 
small "+" icon to expand it. A "Continue" button is at the bottom, disabled 
until Name is filled.

STEP 3 — Privacy Promise:
Show a full-screen card on the dark background. At the top show a large shield 
icon in blue (#3b82f6). Below it show the heading "Your data stays on your 
device." Below that show three privacy promise rows, each with a green checkmark 
(#34d399) and a statement:
  - "No cloud server. No account. No password."
  - "Your voice never leaves this phone."
  - "Family sharing is device-to-device, encrypted."
Below the rows show a "Get Started" button (full width, blue #3b82f6, rounded 16px).

When "Get Started" is pressed, save the user profile to AsyncStorage and 
Zustand (useUserStore), set onboarding as complete, and navigate to the Home 
tab (tabs)/index.

Use the dark background (#111827) throughout. All text uses Georgia serif. 
Labels and step indicators use monospace font.

@prompt_material/00-onboarding.png
```

-----

## PROMPT 01 — Home Screen (Insights Tab)

```
Read AGENTS.md first and follow it strictly.

Implement the Home screen exactly as shown in the attached design. This is the 
main tab screen at route (tabs)/index.

At the very top of the screen show the date in monospace uppercase 
("THURSDAY, JUNE 5"). On the same row, aligned to the right, show a circular 
icon button with a people/family icon in blue. Tapping it navigates to the 
Family tab.

Below the date show the greeting text in two lines:
  Line 1: "Good morning," — Georgia serif, white, 28px, regular weight
  Line 2: The user's name from useUserStore — Georgia serif, #34d399 (success 
  green), 28px, italic

Below the greeting show the ALL DATA ON-DEVICE privacy badge. This is a small 
pill with a green dot (#34d399) on the left and the text "ALL DATA ON-DEVICE" 
in monospace uppercase. Background is rgba(52, 211, 153, 0.12) with a 
rgba(52, 211, 153, 0.3) border. This badge is always visible.

Below the badge show the "How are you feeling?" microphone card. This is a 
large rounded card (radius 16px, background #151d2e, border #1e293b). Inside 
it show a blue circle with a microphone emoji or icon. Below the icon show the 
heading "How are you feeling?" in Georgia serif 20px white. Below that show 
the subtext "Tap to speak. MedPsy analyzes locally — your words never leave 
this device." in Georgia serif 13px #8b9bb4. The entire card is tappable and 
navigates to the Log tab (tabs)/log.

Below the microphone card show the ENTRIES / INSIGHTS segmented toggle. This 
is a two-button control spanning the full width. The active button has a 
#151d2e filled background and white monospace text. The inactive button is 
transparent with #8b9bb4 monospace text. Border between them is #1e293b.

When INSIGHTS is active (shown in this design), show three stat cards stacked 
vertically with 12px gaps:

Card 1 — KNEE PAIN FREQUENCY:
  Label: "KNEE PAIN FREQUENCY" in monospace 11px #8b9bb4
  Value: "4×" in Georgia serif 36px #f87171 (warning red)
  Unit: "this month" in Georgia 13px #8b9bb4 inline after value
  Trend icon: red upward arrow (↑) aligned right

Card 2 — SLEEP CORRELATION:
  Label: "SLEEP CORRELATION" in monospace 11px #8b9bb4
  Value: "82%" in Georgia serif 36px #fbbf24 (warning amber)
  Unit: "linked to fatigue" in Georgia 13px #8b9bb4
  Trend icon: yellow tilde (~) aligned right

Card 3 — ENTRIES LOGGED:
  Label: "ENTRIES LOGGED" in monospace 11px #8b9bb4
  Value: "23" in Georgia serif 36px #34d399 (success green)
  Unit: "last 30 days" in Georgia 13px #8b9bb4
  Trend icon: green upward arrow (↑) aligned right

Each stat card has background #151d2e, border #1e293b, radius 16px, padding 16px.

Stat values are loaded from useHealthStore. If no data exists yet, show 
placeholder dashes.

The bottom navigation bar shows HOME (active, with blue dot indicator below), 
LOG, ANALYSIS, FAMILY.

@prompt_material/01-home-insights.png
```

-----

## PROMPT 02 — Home Screen (Entries Tab)

```
Read AGENTS.md first and follow it strictly.

This is the same Home screen at (tabs)/index but with the ENTRIES tab active 
in the segmented toggle. Implement the ENTRIES tab content as shown in the 
attached design.

The top section (greeting, privacy badge, microphone card, and toggle) is 
identical to the Insights tab. Only the content below the toggle changes.

When ENTRIES is active, show a scrollable list of health entry cards loaded 
from useHealthStore (SQLite via db.ts). Each card has:

  - A colored status dot on the left:
      Red (#f87171) for entries with severity "moderate"
      Yellow (#fbbf24) for entries with severity "mild"
      Green (#34d399) for entries with severity "good" or null

  - Timestamp text: "Today · 8:14 AM" or "Yesterday · 9:02 AM" or 
    "Mon · 7:45 AM" — monospace 12px #8b9bb4

  - "VIEW →" link aligned to the right — monospace 11px #3b82f6. 
    Tapping navigates to the analysis/summary route for that entry.

  - Transcript snippet below the timestamp row in Georgia serif italic 
    13px #8b9bb4. Wrap in quotes. Truncate to 2 lines with ellipsis.

  - Category tag pills below the snippet. Each tag has background #1e293b, 
    text #8b9bb4, monospace 10px, radius 99px, padding 2px 8px. Show only 
    entries that have tags.

Each card has background #151d2e, border #1e293b, radius 16px, padding 14px 
16px, margin-bottom 10px.

If no entries exist yet, show a friendly empty state: a small microphone icon, 
the text "No entries yet" in Georgia serif #8b9bb4, and a subtext "Tap the 
microphone above to log your first health update."

Load entries from useHealthStore.entries (sorted newest first).

@prompt_material/02-home-entries.png
```

-----

## PROMPT 03 — Log / Recording Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Log screen at route (tabs)/log exactly as shown in the attached 
design. This screen activates when the user taps the LOG tab or the microphone 
card on the Home screen.

When the screen mounts, automatically request microphone permission and begin 
recording. Do not wait for a button tap to start — recording starts immediately.

At the top of the screen, centered, show the label "LISTENING · ON DEVICE" 
in monospace uppercase 11px #8b9bb4 with letter-spacing 0.14em.

Below the label show the animated waveform. This is a row of vertical bars 
centered horizontally. Use 18–22 bars. Each bar is 3px wide, rounded corners 
(2px radius), colored #3b82f6 with the lighter variant #7dd3fc for alternating 
bars. Each bar animates up and down independently using Animated.Value with 
staggered delays to simulate a live audio waveform. The animation loops 
continuously while recording. Bars vary in height between 6px (min) and 36px 
(max).

Below the waveform show the live transcription card. This is a rounded card 
(radius 16px, background rgba(21, 29, 46, 0.8), border #1e293b). Inside it 
show the live transcribed text as it comes from QVAC Transcription. Use Georgia 
serif italic 15px white. The text should appear word by word as transcription 
updates. Show a blinking cursor (|) at the end of the text. If no transcription 
has come in yet, show placeholder text "Listening..." in #8b9bb4.

Below the transcription card show the large stop button. This is a circle 
80px wide, background #f87171 (warning red) with a subtle red glow shadow. 
Inside the circle show a white square (stop icon) 20px. Below the button show 
the label "Tap to stop & analyze" in monospace 12px #8b9bb4.

Below the stop button show "← CANCEL" in monospace 12px #8b9bb4. Tapping 
it stops recording, discards the transcript, and navigates back to the Home tab.

When the stop button is pressed:
  1. Stop recording and transcription
  2. Save the final transcript to useRecordingStore
  3. Navigate to (tabs)/analysis
  4. The Analysis screen reads from useRecordingStore and begins the MedPsy 
     pipeline automatically

While recording, the LOG tab icon in the bottom nav shows a red dot indicator 
instead of the blue dot to signal active recording.

Use StyleSheet for the Animated.View waveform bars. Use NativeWind for all 
other layout.

@prompt_material/03-log-recording.png
```

-----

## PROMPT 04 — Analysis Screen (Processing Pipeline)

```
Read AGENTS.md first and follow it strictly.

Implement the Analysis screen at route (tabs)/analysis exactly as shown in the 
attached design. This screen appears automatically after the user stops 
recording on the Log screen.

When the screen mounts, read the transcript from useRecordingStore and 
immediately begin the MedPsy processing pipeline.

At the top of the screen show the label "MEDPSY PROCESSING" in monospace 
uppercase 11px #8b9bb4 with letter-spacing 0.14em.

Below it show the main heading in two lines:
  Line 1: "Analyzing your" — Georgia serif 28px white bold
  Line 2: "health entry" — Georgia serif 28px #34d399 italic

Below the heading show the pipeline steps list. There are exactly 5 steps. 
Each step row contains:
  - A square icon container: 36px × 36px, background #1e293b, radius 10px, 
    centered emoji icon (🎤 🧠 🔍 📊 ✅)
  - Step label text in monospace 13px white: 
      "Transcribing voice input..."
      "MedPsy-4B analyzing patterns..."
      "Scanning health history..."
      "RAG context retrieval..."
      "Summary ready"
  - Right-side status indicator:
      Pending: nothing shown
      Running: a short animated blue underline (18px wide, 2px height, 
               #3b82f6, pulsing opacity)
      Done: green checkmark ✓ in #34d399, 16px

Steps complete one at a time in sequence. Each step transitions from pending 
→ running → done before the next step starts. Timing:
  Step 1 (Transcription): runs while QVAC transcribes, marks done when complete
  Step 2 (MedPsy analysis): starts immediately after step 1, runs QVAC 
          completion() with MedPsy model, marks done when response received
  Step 3 (Health history scan): queries SQLite for past entries, marks done 
          when loaded
  Step 4 (RAG retrieval): generates embeddings and finds similar past entries, 
          marks done when complete
  Step 5 (Summary ready): marks done last, triggers the RAG INSIGHT card

Each step row has a bottom border of 1px #1e293b, except the last step.

Below the pipeline steps, after step 5 is marked done, show the RAG INSIGHT 
card with a fade-in animation (opacity 0 → 1, duration 400ms). The card has:
  - Label: "RAG INSIGHT" in monospace 11px #8b9bb4 with letter-spacing 0.14em
  - Body text in Georgia serif 15px white with inline bold highlights:
      Teal bold (#34d399): key frequency phrases like "4 times this month"
      Amber bold (#fbbf24): pattern words like "poor sleep"
  - A full-width blue button "VIEW FULL SUMMARY →" in monospace uppercase 
    13px white, background #3b82f6, radius 12px, height 48px

When "VIEW FULL SUMMARY →" is pressed, navigate to analysis/summary and 
pass the full MedPsy analysis result.

Card background: #151d2e, border: #1e293b, radius: 16px, padding: 20px.

Store the full analysis result in useHealthStore before navigating.

@prompt_material/04-analysis-processing.png
```

-----

## PROMPT 05 — Analysis Summary Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Analysis Summary screen at route analysis/summary exactly as 
shown in the attached design. This screen is navigated to from the Analysis 
processing screen after the MedPsy pipeline completes.

At the top show a "← BACK" link in monospace 12px #8b9bb4. Tapping navigates 
back to the Analysis processing screen.

Below BACK show the overall concern banner. This is a full-width card with:
  - A yellow warning triangle emoji (⚠️) on the left
  - "MODERATE CONCERN" label in monospace 13px #f87171 with letter-spacing 
    0.1em (use #fbbf24 for MILD CONCERN)
  - Below the label: "2 patterns flagged by MedPsy" in Georgia serif 12px 
    #8b9bb4
  - Card background: rgba(248, 113, 113, 0.08), border: rgba(248, 113, 113, 0.25)
    (use amber tints for MILD CONCERN)

Below the concern banner show one card per health pattern identified by 
MedPsy. Each pattern card contains:

  PATTERN HEADER ROW:
    - Emoji icon on the left (use 🦵 for joint/knee, 🩸 for glucose, 
      💤 for sleep, ⚡ for energy)
    - Pattern name in Georgia serif 17px white bold
    - Severity badge below the name: rounded pill with border and text matching 
      severity color. MODERATE = #f87171 border and text. MILD = #fbbf24 
      border and text.

  PATTERN DESCRIPTION:
    Georgia serif 14px #8b9bb4 lineHeight 22. Shows the MedPsy analysis 
    explanation for this pattern.

  RECOMMENDATION SUB-CARD:
    A darker inner card (background #0c0f1a, radius 12px, padding 14px) with:
    - 💡 emoji on the left
    - Recommendation text in Georgia serif 13px #8b9bb4

  Pattern card: background #151d2e, border #1e293b, radius 16px, padding 18px.
  Cards are separated by 12px gap.

At the bottom of the screen, fixed above the tab bar, show two side-by-side 
action buttons (equal width, 12px gap between them):

  Button 1 — READ ALOUD:
    Background: #151d2e, border: #1e293b, radius: 12px, height: 48px
    Icon: 🔊 on the left
    Text: "READ ALOUD" in monospace 11px #8b9bb4
    When tapped: call QVAC TTS to read the full summary aloud. While reading, 
    the button label changes to "STOP READING" and the icon becomes ⏹.

  Button 2 — SHARE P2P:
    Background: #151d2e, border: #34d399 (1.5px), radius: 12px, height: 48px
    Icon: 📡 on the left
    Text: "SHARE P2P" in monospace 11px #34d399
    When tapped: send the health summary JSON to all connected family members 
    via QVAC Holepunch P2P using lib/p2p.ts. Show a brief "Sent ✓" confirmation 
    toast for 2 seconds.

Data for this screen comes from the health entry and patterns stored in 
useHealthStore after the processing pipeline completes. If no patterns exist 
yet, show a "No patterns detected" empty state with a green checkmark and 
"All looks good from your recent entry."

@prompt_material/05-analysis-summary.png
```

-----

## PROMPT 06 — Family Circle Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Family Circle screen at route (tabs)/family exactly as shown 
in the attached design.

At the top of the screen show the heading "Family Circle" in Georgia serif 
28px white bold. Below it show the subtitle "Direct device-to-device · No 
cloud server" in Georgia serif 13px #8b9bb4.

Below the heading show the P2P MESH status banner. This is a rounded card 
(radius 14px) with:
  - Green dot (#34d399) on the left
  - Text: "P2P MESH ACTIVE · N device connected" in monospace 13px #34d399, 
    where N is the count of currently online family members from useFamilyStore
  - If no family members are connected, show "P2P MESH INACTIVE" in monospace 
    13px #8b9bb4 with a gray dot
  - Background: rgba(52, 211, 153, 0.08), border: rgba(52, 211, 153, 0.25)

Below the status banner show the list of connected family members from 
useFamilyStore.members. Each member card contains:

  - Avatar circle (44px diameter, radius 50%):
      Border width: 2px
      Online member: border #34d399, background rgba(52, 211, 153, 0.12)
      Offline member: border #4a5568, background #1e293b
      Inside: first letter of member's name in Georgia serif 18px bold, 
      matching the border color

  - Name in Georgia serif 15px white bold
  - Role and last seen below name: monospace 11px #8b9bb4
    Format: "Mother · Just now" or "Son · 2h ago"

  - Connection badge aligned to the right:
      ONLINE: border 1.5px #34d399, text #34d399, monospace 10px, 
              radius 99px, padding 4px 10px
      OFFLINE: border 1.5px #4a5568, text #4a5568, same sizing

  Member card: background #151d2e, border #1e293b, radius 16px, 
  padding 14px 16px. Cards separated by 10px.

Below the member list show the "Invite family member" card. This is a 
dashed-border card (border: 1.5px dashed #1e293b, radius 16px, padding 20px) 
with a centered "+" icon in #3b82f6 (32px) and the text "Invite family member" 
in Georgia serif 14px #8b9bb4 below it.

When the invite card is tapped, navigate to family/invite.

Below the invite card show the "HOW P2P WORKS" info card:
  - Label: "HOW P2P WORKS" in monospace 10px #8b9bb4 with letter-spacing 0.12em
  - Body: "Health summaries are shared directly device-to-device using encrypted 
    peer connections. No server ever touches your data." in Georgia serif 13px 
    #8b9bb4 lineHeight 20
  - Card: background rgba(30, 41, 59, 0.5), border #1e293b, radius 14px, 
    padding 16px

On mount, initialize the QVAC Holepunch P2P node using lib/p2p.ts if not 
already initialized. Update connection status for each family member in 
useFamilyStore every 30 seconds.

The FAMILY tab is active in the bottom navigation. No dot indicator shown 
when on this tab unless a family member sends a new health update (show a 
red dot notification in that case).

@prompt_material/06-family-circle.png
```

-----

## PROMPT 07 — Family Invite Screen

```
Read AGENTS.md first and follow it strictly.

Implement the Family Invite screen at route family/invite.

At the top show "← BACK" in monospace 12px #8b9bb4. Tapping navigates back 
to the Family Circle screen.

Show the heading "Add Family Member" in Georgia serif 24px white bold.
Below it show the subtext "Both phones need internet briefly to connect. 
After that, sharing works privately device-to-device." in Georgia serif 
13px #8b9bb4.

Below the heading show the QR code section. Generate a QR code from this 
device's Holepunch public key (from lib/p2p.ts). Display the QR code centered 
in a white square card (background white, radius 16px, padding 16px, 220px × 
220px). Below the QR code card show the label "Your device address" in 
monospace 11px #8b9bb4.

Below the QR code show a divider with the text "OR" centered in #8b9bb4.

Below the divider show a "Scan Their Code" button (full width, background 
#3b82f6, radius 12px, height 52px) with a 📷 icon and "SCAN THEIR CODE" 
in monospace 13px white. Tapping opens the device camera to scan the other 
person's QR code.

Below that show the three-step instructions as numbered rows:
  1. "Both open MedVoice and go to Family Circle"
  2. "One person taps Invite, the other taps Scan"
  3. "Connected! Health summaries sync automatically"
  Each row has a circular number badge (#3b82f6 background, white monospace 
  text) and the instruction in Georgia serif 14px #8b9bb4.

When a QR code is successfully scanned:
  1. Extract the peer public key from the QR data
  2. Show a name input modal: "Who is this?" with a text field for the 
     person's name and a relationship picker (Mother, Father, Son, Daughter, 
     Spouse, Other)
  3. On confirm, call lib/p2p.ts connectFamilyMember() 
  4. Add the member to useFamilyStore
  5. Show a success state: green checkmark, "Connected to [Name]!" text
  6. After 2 seconds, navigate back to the Family Circle screen

Background #111827 throughout. Use NativeWind for layout.

@prompt_material/07-family-invite.png
```

-----

## USAGE NOTES

When using these prompts with an AI coding agent (Cursor, Claude Code, etc):

1. Place all design images in a folder called `prompt_material/` at the root
   of the project. Name them exactly as referenced at the bottom of each prompt.
1. Always include the AGENTS.md file in the agent’s context.
1. Build one screen at a time in phase order:
   Phase 1 → Prompt 00 (Onboarding)
   Phase 2 → Prompts 01 + 02 (Home with Insights + Entries tabs)
   Phase 3 → Prompt 03 (Log / Recording)
   Phase 4 → Prompts 04 + 05 (Analysis Processing + Summary)
   Phase 5 → Prompts 06 + 07 (Family Circle + Invite)
1. Do not move to the next prompt until the current screen is working
   end-to-end and committed to GitHub.
1. After each screen is implemented, run:
   npm run lint
   npm run typecheck
   Fix all errors before proceeding.