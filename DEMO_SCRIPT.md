# MedVoice — Demo Video Script

**Target length:** 2:30–3:00 min · **Format:** screen recording of the app on a real phone + your voiceover.

> 🔑 **Pro move:** after the AI models are downloaded, put the phone in **airplane mode** and keep the airplane icon visible in the status bar for the whole demo. This *proves* on-device AI to judges — the single most convincing thing you can show for an edge-AI hackathon.

---

## Shot list & narration

### 0:00–0:20 — Hook + problem
**On screen:** App icon / Home screen, airplane-mode icon visible in status bar.
**Voiceover:**
> "This is MedVoice — a private health companion that runs entirely on your phone. Notice the airplane mode: there's no internet. Every AI feature you're about to see runs on-device. Your health data never leaves the phone."

### 0:20–0:35 — Onboarding / privacy promise (optional, skip if tight)
**On screen:** Quick swipe through role → profile → privacy screen.
**Voiceover:**
> "You set up once — your role, your conditions — and MedVoice promises your data stays local. That's not a marketing line; it's how the app is built. No cloud, no account, no API keys."

### 0:35–1:05 — Voice journaling (Transcription)
**On screen:** Tap "Tap to Talk" → recording screen with live waveform. Speak a symptom.
**Say into the app:** *"I've had a throbbing headache since this morning and I didn't sleep well last night."*
**Voiceover:**
> "I just talk. QVAC's on-device transcription turns my voice into text in real time — no server, no streaming audio anywhere."

### 1:05–1:40 — AI analysis (Local LLM)
**On screen:** Processing pipeline → result screen (summary, severity badge, tags, patterns).
**Voiceover:**
> "Now a medical language model — running locally through the QVAC SDK — analyzes what I said. It gives a caring summary, flags a severity level, tags the entry, and surfaces patterns. It never diagnoses, and it always recommends professional care for anything serious."

### 1:40–1:55 — Read aloud (TTS)
**On screen:** Tap "READ ALOUD".
**Voiceover:**
> "It can read the result back out loud — on-device text-to-speech — so it works for elderly users or anyone who'd rather listen than read."

### 1:55–2:15 — Timeline + semantic search (Embeddings / RAG)
**On screen:** Save entry → Timeline tab → type a meaning-based search like "trouble sleeping".
**Voiceover:**
> "Every entry builds a private health timeline. Search works by meaning, not just keywords — powered by on-device embeddings. Searching 'trouble sleeping' surfaces related entries even if I never used those exact words."

### 2:15–2:45 — Family sharing (Holepunch P2P)
**On screen:** Family tab → Show QR code on one phone, scan on a second phone → Care View shows the shared summary.
**Voiceover:**
> "Families can connect peer-to-peer. One phone shows a QR code, the other scans it, and they sync encrypted health summaries directly — device to device, through QVAC's Holepunch P2P. No server ever sees the data. A caregiver opens Care View to read their loved one's summaries."

### 2:45–3:00 — Close
**On screen:** Settings (model selection 1.7B / 4B) → back to Home.
**Voiceover:**
> "You can even choose which on-device medical model to run. MedVoice proves real, useful AI health tools can run fully on the edge — private by design. Built with the QVAC SDK by Tether."

---

## Recording checklist
- [ ] Models pre-downloaded, then **airplane mode ON** before recording.
- [ ] Two phones (or phone + emulator) ready for the P2P/Care View segment.
- [ ] Clean status bar, full battery, notifications silenced.
- [ ] Speak slowly and clearly into the recording mic.
- [ ] Show both light and dark mode for ~2 seconds if time allows.
- [ ] Export 1080p, upload to YouTube/Vimeo (unlisted is fine), paste link into README + BUIDL.

## Editing tips
- Add on-screen captions for the QVAC capability used in each segment (Transcription / LLM / TTS / Embeddings / P2P).
- Keep cuts tight — judges watch many videos; lead with the airplane-mode hook.
- End card: app name + "100% on-device · Built with QVAC SDK".
