# DoraHacks Submission Checklist — MedVoice

Hackathon: **QVAC "Unleash Edge AI" by Tether** (DoraHacks)

> On DoraHacks you submit a project as a **BUIDL**. Go to the hackathon page → **Submit BUIDL** and fill the form below. You can edit a BUIDL up until the deadline, so create it early and refine it.

---

## 1. BUIDL form fields (what DoraHacks asks for)

| Field | Status | Content to paste |
|---|---|---|
| **Project name** | ⬜ | MedVoice |
| **Logo / icon** | ⬜ | Use `assets/images/icon.png` (export 512×512 PNG) |
| **Cover image** | ⬜ | 1280×720 banner (see "Assets to produce" below) |
| **Tagline (1 line)** | ⬜ | "A private, on-device AI health companion — your voice in, health insight out, nothing leaves your phone." |
| **Short description** | ⬜ | First 2 paragraphs of README (Problem + Solution) |
| **Full description / details** | ⬜ | Paste the README body (features, privacy, tech stack, flow) |
| **Tech stack tags** | ⬜ | Expo, React Native, TypeScript, QVAC SDK, SQLite, Holepunch P2P, on-device AI |
| **GitHub repo URL** | ⬜ | Make repo **public** before submitting; paste link |
| **Demo video URL** | ⬜ | Public YouTube/Vimeo (unlisted is fine) — **most important asset** |
| **Live demo / download** | ✅ | [Direct APK](https://expo.dev/artifacts/eas/_-siqiaaUWi2S2P47OreXcDOzxFfRa9xZzVyQ1oeMcY.apk) · [build page](https://expo.dev/accounts/muhaj_dev/projects/Medv/builds/2a7129c1-f057-4b2b-b379-3ff92dd48325) |
| **Track / category** | ⬜ | Pick the track that fits (e.g. Wellness / Health) |
| **Team members** | ✅ | Ajibade Muhammod (Developer, DoraHacks @muhaj) · Adeshina Fuad (Designer, DoraHacks @leadui) — add both to the BUIDL |
| **Pitch deck (optional)** | ⬜ | 5–8 slide PDF (optional but recommended) |

> Note: I could not load the live DoraHacks page (bot-protected). **Verify the exact required fields, tracks, and the deadline on the hackathon page** and update this checklist. The fields above are the standard DoraHacks BUIDL form.

---

## 2. Judging criteria — typical for an edge-AI hackathon

Optimize the submission for these (confirm exact weights on the prizes/judging page):

1. **Use of QVAC SDK / edge AI** — show that transcription, LLM, TTS, embeddings & P2P all run **on-device**. This is the whole point of the hackathon — make it loud in the video and README. ✅ strong fit
2. **Innovation / originality** — voice-first, privacy-by-architecture health tracking.
3. **Technical execution** — working end-to-end pipeline, real models, real P2P.
4. **Real-world impact** — elderly & chronic-illness accessibility angle.
5. **UX / design polish** — light + dark mode, large touch targets, calm health UI.
6. **Completeness / demo quality** — a clear, working demo video beats a long README.

---

## 3. Assets you still need to produce (action items for you)

- [ ] **Demo video (2–3 min)** — the single highest-impact item. **Full shot-by-shot script ready in [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md)** — just record to it.
  - 💡 Record in **airplane mode** (after models are downloaded) to *prove* privacy/offline AI on camera — very persuasive to judges.
- [ ] **Screenshots** (6–8) of key screens, light + dark — add to a `/docs` folder and embed in README.
- [ ] **Cover/banner image** 1280×720.
- [ ] **App icon** exported at 512×512.
- [x] **APK / EAS build link** — done: [Direct APK](https://expo.dev/artifacts/eas/_-siqiaaUWi2S2P47OreXcDOzxFfRa9xZzVyQ1oeMcY.apk). ⚠️ If you change the logo, rebuild so the new icon ships in the APK (link will change).
- [ ] **Pitch deck** (optional) — **8-slide outline ready in [`PITCH_DECK.md`](./PITCH_DECK.md)**; build in Canva/Slides → export PDF.

---

## 4. Repo hygiene before submitting

- [ ] Make the GitHub repo **public**.
- [x] Add a **LICENSE** file (MIT) — done (`LICENSE`).
- [ ] Confirm README demo/team/license TODOs are filled in.
- [ ] Update `progress-tracker.md` (it still says SDK 54 / RN 0.81 — repo is now Expo 56 / RN 0.85).
- [ ] Ensure no secrets/keys committed (QVAC needs none — good).
- [ ] `npm run lint && npm run typecheck` pass.
- [ ] Tag a release (e.g. `v1.0.0-hackathon`) so judges see a stable commit.

---

## 5. Submission steps (DoraHacks)

1. Create/sign in to your DoraHacks account.
2. Open the hackathon → **Submit BUIDL**.
3. Fill the form (section 1 above).
4. Add team members.
5. Attach video + repo + APK links.
6. Select track.
7. Submit **before the deadline**, then keep editing/polishing until it closes.
8. (If the hackathon has community voting) share the BUIDL link to gather votes.

---

## 6. Open questions to confirm on the hackathon page

- Exact **deadline** (date + timezone)?
- Allowed **tracks/categories** and which one MedVoice should enter?
- Is a **demo video required** and is there a max length?
- Is **open-source / public repo** mandatory?
- Are there **eligibility rules** (region, team size, new vs existing project)?
- Is there **community voting** in addition to judge scoring?
