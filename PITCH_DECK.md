# MedVoice — Pitch Deck Outline

8 slides · keep it visual, one idea per slide. Build in Canva/Google Slides/Pitch and export a PDF for the BUIDL.

---

### Slide 1 — Title
- **MedVoice** + logo
- Tagline: *"A private, on-device AI health companion."*
- "QVAC 'Unleash Edge AI' Hackathon — Tether" + team names
- Background: calm health imagery, app screenshot mockup

### Slide 2 — The Problem
- Health apps send your most sensitive data to the cloud.
- Elderly & chronically ill users benefit most from tracking — but trust the cloud least and struggle with typing.
- Stat/visual: data-leak / privacy concern icon.

### Slide 3 — The Solution
- MedVoice: track your health **just by talking**, with **all AI on-device**.
- No account · no cloud · no API keys · works offline.
- One line: *"A privacy promise enforced by architecture, not policy."*

### Slide 4 — How it works (the flow)
- Visual pipeline: 🎙️ Speak → 🧠 Analyze → 🔊 Hear → 🔎 Search → 👪 Share
- Caption each step with the QVAC capability it uses.

### Slide 5 — QVAC SDK = the whole engine
- Transcription (Parakeet/Whisper) · LLM (Qwen3 1.7B / MedGemma 4B) · TTS · Embeddings+RAG · Holepunch P2P.
- "Five edge-AI capabilities, one SDK, zero cloud."
- Emphasize: everything runs on consumer phones.

### Slide 6 — Privacy & architecture
- Diagram: phone box containing SQLite + AI models; the only external arrow is "Holepunch DHT (peer discovery, no health data)".
- Bullets: SQLite local DB · AsyncStorage · encrypted P2P · no analytics.

### Slide 7 — Real-world impact + demo
- Who it helps: elderly, chronic-illness patients, caregivers, privacy-conscious users.
- Embed 2–3 app screenshots (light + dark).
- Link/QR to the demo video.

### Slide 8 — Built with & what's next
- Tech: Expo · React Native · TypeScript · QVAC SDK · expo-sqlite.
- Roadmap: medication reminders, trend charts, more languages (on-device translation via QVAC), multi-member households.
- Close: GitHub repo link · APK download · "100% on-device. Built with QVAC by Tether."

---

## Design notes
- Match the app's palette (calm blues/greens, dark + light).
- Use the app's Georgia/monospace pairing for on-brand slides.
- Minimal text per slide — talk to it, don't read it.
- One hero screenshot per slide beats walls of bullets.
