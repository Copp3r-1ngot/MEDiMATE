# MEDiMATE Build Log (v0.1 Prototype)

This chronological log tracks all development steps, design decisions, architectural trade-offs, and bug fixes for the **MEDiMATE** Patient Case-Taking Software (Smart India Hackathon #26047).

---

## Step 0: Project Inception & Workspace Setup
- **Timestamp:** 2026-09-12 18:56 IST
- **Action:**
  - Initialized workspace structure adhering to problem statement specifications: `frontend/`, `backend/`, and `docs/`.
  - Established documentation standards in `docs/`: `BUILD_LOG.md`, `ARCHITECTURE.md`, `KNOWN_ISSUES.md`, and `CHANGELOG.md`.
- **Decisions & Trade-offs:**
  - *Frontend Framework:* React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons chosen for fast bundle times, high interactivity, and fine-grained styling control for kiosk/tablet touchscreen ergonomics.
  - *Backend:* Node.js / Express lightweight API service with modular adapters for AI services (Web Speech / Bhashini, Mock OCR / Cloud Vision OCR, Rule-based SOCRATES / LLM history engine, ABDM M1/M2/M3 FHIR mock).
  - *Audio & Speech Strategy:* Browser-native Web Speech API (STT for voice input + TTS for audio prompts) ensures zero-latency, zero-cost, offline-friendly demonstration while providing clean abstraction interfaces to plug in Bhashini or Whisper.
- **Bug / Resolution:** N/A (Initial setup).

---

## Step 1: Backend Architecture & Mock Services
- **Timestamp:** 2026-09-12 19:00 IST
- **Action:**
  - Built Express server on port 5000 with CORS and JSON streaming.
  - Built `mockStore.ts` containing the patient queue, case records, and 3 pre-seeded demo presets (Chest Pain Emergency ACS, Diabetes Follow-up Lab Scan, AYUSH Sandhivata).
  - Built `aiEngine.ts` implementing the dynamic SOCRATES reasoning framework, red-flag triage detection heuristics, AYUSH Dashavidha Pariksha evaluator, and SOAP clinical summary synthesizer.
  - Built `ocrEngine.ts` with Indian clinical reference range evaluation (HbA1c, Blood Glucose, Creatinine, BP) and abnormal range classification (`HIGH` / `LOW` / `CRITICAL`).
  - Created REST routes: `/api/history/*`, `/api/ocr/*`, `/api/abdm/*`, and `/api/doctor/*`.
- **Decisions & Trade-offs:**
  - Designed all endpoints to accept both simulated test payloads and future real API keys (e.g. OpenAI / Gemini / Cloud Vision) configured via `.env`.

---

## Step 2: Frontend Kiosk Shell & Design System
- **Timestamp:** 2026-09-12 19:15 IST
- **Action:**
  - Created Tailwind CSS theme tailored for kiosk accessibility: large touch targets (minimum 54px height), high-contrast fonts (Outfit, Inter, Devanagari), glassmorphism cards, and fluid animations.
  - Implemented `Header.tsx` with MEDiMATE wordmark, SIH #26047 accreditation, 1-click Demo Preset selector, AYUSH Mode toggle, Audio TTS mute switch, and Doctor View toggle.
  - Implemented `StepProgress.tsx` 5-step visual stepper.
  - Created `AudioSpeaker.tsx` with Web Speech API audio wave animation and `MicVoiceInput.tsx` with dual-mode speech recognition + test phrase shortcuts.

---

## Step 3: Screen 1 (IDENTIFY) — Patient Identity & Granular Consent
- **Timestamp:** 2026-09-12 19:30 IST
- **Action:**
  - Created multilingual selection (Hindi, English, Marathi, Tamil) with spoken audio greetings.
  - Implemented 14-digit ABHA ID validator with checksum verification and "Register as new patient" toggle.
  - Implemented Granular Consent UI conforming to DPDP Act 2023 with 3 individual permission checkboxes and spoken audio readback of terms.
  - Added prominent 1-click Demo Scenario quick-load cards for evaluators.

---

## Step 4: Screen 2 (CONVERSE) — Core Clinical Dialogue & Red-Flag Engine
- **Timestamp:** 2026-09-12 19:45 IST
- **Action:**
  - Built dual voice (mic) and touch (chips) conversation flow.
  - Implemented full SOCRATES framework: Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/Relieving, Severity (1-10 pain scale with facial emojis).
  - Integrated Past Medical/Surgical history, Drug Allergies, and Review of Systems (ROS) checklist.
  - Integrated AYUSH Pariksha mode (*Prakriti, Agni, Koshtha*).
  - Built real-time Emergency Red-Flag detection triggering a high-priority warning banner and simulated hospital staff pager alert modal.

---

## Step 5: Screen 3 (SCAN) — Document OCR & Lab Normal Range Flagging
- **Timestamp:** 2026-09-12 20:00 IST
- **Action:**
  - Built document file upload dropzone and camera snapshot simulator.
  - Added pre-loaded sample report buttons ("MaxLab HbA1c Panel" and "Apollo OPD Rx").
  - Implemented laser scanning progress animation.
  - Implemented extracted tables with **automatic red range highlighting** for abnormal clinical parameters (e.g. HbA1c 9.4% [HIGH], Fasting Sugar 188 mg/dL [HIGH]).

---

## Step 6: Screen 4 (SUMMARIZE) — Pre-Consultation Summary & ABDM Push
- **Timestamp:** 2026-09-12 20:15 IST
- **Action:**
  - Synthesized unified structured clinical case draft in standard hospital format.
  - Integrated patient-facing TTS audio readback.
  - Built ABDM & HIS push simulation with animated celebration confetti, transaction UUID (`ABDM-TXN-XXXXXXXX`), and QR code badge.

---

## Step 7: Screen 5 (CONSULT) — Physician OPD Workstation
- **Timestamp:** 2026-09-12 20:30 IST
- **Action:**
  - Built live OPD waiting queue with triaged urgency badges (`EMERGENCY RED-FLAG`, `PRIORITY`, `ROUTINE`).
  - Created standardized SOAP clinical sheet viewer with highlighted abnormal lab markers.
  - Built Physician Governance Controls: `Accept`, `Modify Note`, `Reject / Retake`.
  - Built interactive Prescription Pad and generated clean, printable OPD Consultation Slips.

---

## Bug Fixes & Refinements Log:
1. **Symptom:** `tsc` reported unused variables (`VolumeX`, `Sparkles`, `MicOff`, etc.) under strict TypeScript settings.
   - **Root Cause:** Imported helper icons and types that were not utilized in the final markup.
   - **Fix:** Cleaned all imports across components and updated `ConsultScreen.tsx` status type signatures to match `'Accepted' | 'Modified' | 'Rejected'`.
2. **Symptom:** Status typing mismatch in `ConsultScreen.tsx` sign-off handler.
   - **Root Cause:** Type `'Accept' | 'Modify' | 'Reject'` passed to state typed as `'Accepted' | 'Modified' | 'Rejected'`.
   - **Fix:** Mapped UI actions cleanly to the case sheet status enum.

---
