# MedVoice 

**A private, on-device AI health companion. Your voice in. Health insight out. Nothing ever leaves your phone.**

Built for the **QVAC "Unleash Edge AI" Hackathon** by Tether, on DoraHacks.

> Speak how you feel → MedVoice transcribes it, reasons about it with a medical LLM, reads the result back to you, builds a searchable health timeline, and lets you privately share summaries with family — **100% on-device, no cloud, no API keys, no health data ever transmitted.**

---

##  The Story Behind MedVoice

When I gained admission into university, it was one of the happiest moments of my life. For the first time, I was leaving home to pursue my dreams. But there was one problem I could never stop thinking about: my grandmother.

She was getting older. Like many elderly people, she often forgot to mention when she wasn't feeling well. Sometimes she would have headaches for days before telling anyone. Sometimes she would feel dizzy, struggle to sleep, or have pain in her joints — and simply say, *"I'm fine."*

Living hundreds of kilometers away at school, I couldn't check on her every day. Phone calls helped, but they were never enough. I worried about the things she wasn't saying.

I looked at existing health apps, hoping to find something that could help. But most required typing long notes. Many sent health data to cloud servers. Some needed accounts, subscriptions, or constant internet access. None felt designed for someone like my grandmother.

Then I asked a simple question:

> **"What if all she had to do was talk?"**

What if she could simply pick up her phone and say:

- *"Today I have a headache."*
- *"I didn't sleep well."*
- *"My chest feels uncomfortable."*

And what if an AI could listen, understand, provide health insights, keep a history of those conversations, and privately share important updates with family members? Not through the cloud. Not through a third-party server. But directly on her own device.

**That idea became MedVoice.**

MedVoice is a private, on-device AI health companion. Users simply speak about how they feel. MedVoice transcribes their voice, analyzes it using an on-device medical AI model, reads the response back aloud, builds a searchable health timeline, and allows trusted family members to receive private health summaries through encrypted peer-to-peer connections.

Everything happens on the device. No cloud. No API keys. No health data leaves the phone. Ever. Because privacy shouldn't be a feature hidden in settings — it should be the foundation.

For my grandmother, MedVoice means she doesn't need to learn complicated technology. She just talks. For family members living far from home, it means peace of mind. And for millions of elderly and chronically ill people around the world, it means health support that is private, simple, accessible, and always available.

MedVoice wasn't built because we wanted to create another health app. It was built because the people we care about deserve technology that cares about them too.

---

##  The Problem

Most health apps send your most sensitive data — symptoms, conditions, medications — to cloud servers. Elderly and chronically ill users, who would benefit most from continuous health tracking, are often the least comfortable typing detailed logs or trusting Big Tech with their medical history.

##  The Solution

MedVoice lets anyone track their health **just by talking**, with **every AI step running locally on the device** via the QVAC SDK. No account. No internet required for AI. No data collection. A privacy promise that is architecturally enforced, not just stated.

---

##  Core Features

| Feature | What it does | QVAC capability |
|---|---|---|
|  **Voice health journaling** | Speak how you feel; live transcription on-device | QVAC Transcription (Parakeet / Whisper) |
|  **AI health analysis** | Local medical LLM produces a caring summary, severity, tags & patterns | QVAC LLM inference (Qwen3 1.7B / MedGemma 4B) |
|  **Read-aloud responses** | Hears the analysis spoken back — accessibility for elderly users | QVAC Text-to-Speech |
|  **Semantic health timeline** | Search past entries by meaning, not keywords | QVAC Embeddings + on-device RAG |
|  **Private family sharing** | Share health summaries device-to-device, encrypted | QVAC Holepunch P2P (HyperDHT) |
|  **Care View** | Caregivers read a loved one's summaries, read-only | P2P sync |
|  **Light & dark mode** | Polished, accessible, elderly-friendly UI | — |

**Everything above runs on the phone.** The only network use is Holepunch DHT peer discovery for the P2P handshake — and even that carries **no health data**.

---

##  Privacy Promise (Non-Negotiable)

- ❌ No cloud database
- ❌ No cloud AI / external inference
- ❌ No external health APIs
- ❌ No analytics or crash reporting that sends data off device
- ✅ Health entries stored locally in **SQLite**
- ✅ Profile / settings / theme in **AsyncStorage**
- ✅ All AI inference on-device via **QVAC SDK**
- ✅ Family sharing is **encrypted, peer-to-peer**, server-free

---

##  Tech Stack

- **Framework:** Expo SDK 56 · React Native 0.85 · TypeScript · Expo Router (file-based routing)
- **AI / Edge inference:** [`@qvac/sdk`](https://github.com/tetherto/qvac) `0.12.x` — transcription, LLM, TTS, embeddings
- **P2P:** QVAC Holepunch (HyperDHT) via a Bare worklet bundled with `bare-pack`
- **State:** Zustand · **Local DB:** `expo-sqlite` · **Persistence:** AsyncStorage
- **Audio:** `expo-audio` (real-time PCM mic capture for live transcription)
- **UI:** NativeWind v5 / Tailwind CSS v4 · light + dark theming
- **QR (family pairing):** `react-native-qrcode-svg` + `expo-camera`

### AI Models (user-selectable in Settings → AI Model)
| Model | Size | Use |
|---|---|---|
| **Qwen3 1.7B (default)** | ~1.1 GB | Smaller download, lower RAM — runs on most devices |
| **MedGemma 4B** | ~2.5 GB | Google's medical Gemma — higher-fidelity summaries |

Models download once on first use and run entirely offline thereafter.

---

## 📱 App Flow

```
Onboarding (role · profile · privacy)
      │
      ▼
   HOME  ──tap to talk──►  Recording (ready → active, live waveform + transcript)
      │                          │
      │                          ▼
      │                   Analysis (MedPsy pipeline → result: summary, severity, patterns)
      │                          │  └─ READ ALOUD (TTS) · SAVE TO TIMELINE
      ▼                          ▼
  TIMELINE  ◄── semantic RAG search over saved entries
      │
  FAMILY ──QR pair──► P2P connection ──► CARE VIEW (caregiver, read-only)
      │
  SETTINGS (model selection · theme · profile · privacy)
```

The bottom navigation has 5 tabs: **HOME · TIMELINE · FAMILY · CARE VIEW · SETTINGS**.

---

##  Running Locally

> MedVoice uses native modules (QVAC SDK, Bare P2P worklet, camera, audio). **It requires a development build — it will not run in Expo Go.**

### Prerequisites
- Node.js 18+
- Android device/emulator (Android 12+ recommended for the QVAC llama.cpp engine) or iOS device
- ~3 GB free storage on device for AI models

### Steps
```bash
# 1. Install dependencies
npm install

# 2. (P2P only) bundle the Holepunch worklet
npm run bundle:p2p

# 3. Build & run a development client
npx expo run:android      # or: npx expo run:ios

# 4. Start the dev server (if not already running)
npx expo start --dev-client
```

On first launch, granting microphone permission and selecting an AI model triggers a one-time on-device model download.

### Quality gates
```bash
npm run lint
npm run typecheck
```

---

##  Project Structure

```
app/            Expo Router screens (onboarding, tabs, recording, analysis, family)
components/     Reusable UI (cards, badges, waveform, pipeline rows)
lib/            qvac.ts · medpsy.ts · transcription.ts · tts.ts · embeddings.ts · p2p.ts · db.ts
store/          Zustand stores (user, health, family, recording, settings, theme)
constants/      colors.ts (light+dark tokens) · typography.ts · images.ts
p2p/            Bare worklet + bundled Holepunch P2P node
types/          Shared TypeScript types
```

---

##  Demo

- **Demo video:** _<!-- TODO: add public YouTube/Vimeo link -->_
- **Download APK (Android):** [Direct APK download](https://expo.dev/artifacts/eas/_-siqiaaUWi2S2P47OreXcDOzxFfRa9xZzVyQ1oeMcY.apk) · [EAS build page](https://expo.dev/accounts/muhaj_dev/projects/Medv/builds/2a7129c1-f057-4b2b-b379-3ff92dd48325)
- **Screenshots:** _<!-- TODO: add screenshots in /docs -->_

---

##  Team

- **Ajibade Muhammod** — Developer — GitHub [@muhaj-dev](https://github.com/muhaj-dev) · DoraHacks [@muhaj](https://dorahacks.io/hacker/Muhaj)
- **Adeshina Fuad** — Designer · DoraHacks [@leadui](https://dorahacks.io/hacker/Leadui)

---

##  License

Released under the [MIT License](./LICENSE).

---

*Built with ❤️ and zero cloud calls using the QVAC SDK by Tether.*
