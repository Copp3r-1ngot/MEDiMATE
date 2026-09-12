# Implementation Plan: MEDiMATE — AI-Powered Patient Case-Taking Software (v0.1 Prototype)

MEDiMATE is an AI-powered kiosk/tablet clinical case-taking platform designed for Smart India Hackathon Problem Statement #26047 (Ministry of Ayush / All India Institute of Ayurveda). It empowers OPD patients to complete a structured, voice-and-touch clinical history and digitize prior medical records before seeing the doctor, generating a physician-ready structured clinical summary linked to ABHA/ABDM.

## User Review Required

> [!IMPORTANT]
> - **Architecture**: We will set up a modern, responsive React + TypeScript + Vite frontend with Tailwind CSS and Lucide icons, backed by a lightweight Express backend (with simulated and real-API pluggable endpoints for OCR, LLM history engine, and ABDM sync).
> - **Kiosk & Accessibility First**: Designed for elderly and low-literacy users with large touch targets, high contrast, bilingual Hindi/English prompts, icon-driven choices, and browser-native Web Speech API (STT & TTS).
> - **Pluggable Config**: Easily toggles between zero-key Mocked Mode (offline demo ready) and Real API Mode (OpenAI/Gemini LLM & Vision OCR).

## Proposed Architecture & Structure

```
MEDiMATE/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (Header, Footer, StepProgress, LanguageSwitch, KioskContainer)
│   │   │   ├── common/ (AudioSpeaker, MicVoiceInput, QuickReplyPills, AlertBanner, Modal)
│   │   │   ├── identify/ (LanguageSelect, AbhaInput, GranularConsent, DemoPresets)
│   │   │   ├── converse/ (ChatHistory, SocratesFlow, AyushPariksha, RedFlagAlert, PainScale)
│   │   │   ├── scan/ (DocumentUploader, OcrBoundingPreview, EditableLabTable, FlaggedAbnormals)
│   │   │   ├── summarize/ (ClinicalSummaryCard, TtsPlayback, AbhaSyncStatus, QRBadge)
│   │   │   └── consult/ (DoctorQueue, SoapSummary, EditApproveControls, PrescriptionPad, PrintableSlip)
│   │   ├── services/
│   │   │   ├── speechService.ts (Web Speech API STT/TTS engine with fallback)
│   │   │   ├── ocrService.ts (Mock + Vision API parser, reference ranges analyzer)
│   │   │   ├── aiEngine.ts (SOCRATES question generator, Red-Flag detector, AYUSH evaluator)
│   │   │   └── abdmMockService.ts (ABHA validation, M1/M2/M3 FHIR bundle generator)
│   │   ├── context/ (PatientContext.tsx - manages case-taking state across 5 screens)
│   │   ├── data/ (sampleScenarios.ts, socratesQuestions.ts, normalRanges.ts, ayushQuestions.ts)
│   │   ├── types/ (patient.ts, clinical.ts, ocr.ts)
│   │   └── App.tsx
├── backend/
│   ├── src/
│   │   ├── routes/ (historyRoutes.ts, ocrRoutes.ts, abhaRoutes.ts, doctorRoutes.ts)
│   │   ├── services/ (ocrEngine.ts, llmEngine.ts, mockDataStore.ts)
│   │   └── server.ts
├── docs/
│   ├── BUILD_LOG.md (running step-by-step dev log with trade-offs and bug fixes)
│   ├── ARCHITECTURE.md (module breakdown, data flow, real API swap guide)
│   ├── KNOWN_ISSUES.md (assumptions, limitations, browser support)
│   └── CHANGELOG.md (versioning)
└── README.md
```

## Step-by-Step Execution Plan

### Step 1: Initialize Documentation & Backend
- Create `docs/BUILD_LOG.md`, `docs/ARCHITECTURE.md`, `docs/KNOWN_ISSUES.md`, and `docs/CHANGELOG.md` documenting Step 1 decisions.
- Create lightweight Express backend in `backend/` with endpoints for `/api/ocr`, `/api/converse/next-question`, `/api/summary/generate`, `/api/abdm/push`, and `/api/doctor/queue`.

### Step 2: Scaffold Frontend & Kiosk Design System
- Initialize Vite React + TypeScript in `frontend/` with Tailwind CSS and Lucide React.
- Implement responsive Kiosk Shell with large touch targets, high-contrast theme, top status bar with ABHA ID & AYUSH Mode toggle, voice readback buttons, and step progression.

### Step 3: Screen 1 — IDENTIFY
- Implement Hindi/English/multilingual audio-guided language selection.
- Implement ABHA ID input / "Register as new patient" toggle with instant checksum verification.
- Implement 3 Quick Demo Scenario Presets (Chest Pain Emergency, Diabetes Follow-up, AYUSH Joint Pain).
- Implement Granular Consent UI with audio playback of consent terms and individual permission toggles.

### Step 4: Screen 2 — CONVERSE (Core Clinical History Engine)
- Dual-mode voice (Web Speech API STT + live waveform) and large touchable chip buttons.
- TTS auto-read for every question in chosen language.
- Implement adaptive **SOCRATES** framework (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/Relieving, Severity 1-10 with facial emojis).
- Comprehensive sections: Chief Complaint, HPI, PMHx, Meds & Allergies, Family, Personal/Lifestyle, ROS checklist.
- Implement **AYUSH Mode** (Prakriti, Agni, Koshtha questions).
- Implement **Red-Flag Clinical Triaging**: Real-time detection of high-risk keywords (e.g. chest pain + diaphoresis / dyspnea) triggering an urgent priority alert and mock staff pager notification.

### Step 5: Screen 3 — SCAN (Document OCR & Lab Normal Range Flagging)
- Prescription & lab report file uploader with camera capture simulation & sample image quick-loads.
- Realistic scanning/digitizing animation.
- Editable extracted tables for Diagnoses, Medications, and Lab Investigations.
- Automatic normal reference range evaluator highlighting out-of-range values in bright RED (e.g., HbA1c > 6.5%, Fasting Sugar > 126 mg/dL, High BP).

### Step 6: Screen 4 — SUMMARIZE (Patient-Facing Summary & ABDM Push)
- Unified clinical summary assembling conversation history + extracted scanned records into standardized clinical case sheet format.
- Interactive audio TTS readback in selected language.
- Mock ABDM push simulation: displays ABDM Transaction ID, QR code, and confirmation of encrypted transmission to Hospital Information System (HIS).

### Step 7: Screen 5 — CONSULT (Physician OPD Workstation)
- Doctor OPD queue dashboard showing waiting patients with triaged severity badges and red-flag alerts.
- Detailed case sheet inspection view with SOAP breakdown.
- Physician Governance Controls: Accept / Modify / Reject clinical intake.
- Physician Rx & Diagnosis note editor and Final Sign-off producing a clean, printable/exportable OPD Consultation Slip.

### Step 8: Polish, Test & Final Documentation
- Verify speech recognition, TTS, audio cues, and responsiveness.
- Run complete browser testing across desktop and tablet views.
- Update `docs/BUILD_LOG.md`, `docs/ARCHITECTURE.md`, `docs/KNOWN_ISSUES.md`, `docs/CHANGELOG.md`, and top-level `README.md`.

## Verification Plan

### Automated Tests & Quality Checks
- `npm run build` in both `frontend` and `backend` to ensure strict TypeScript compilation.
- API route tests using curl or fetch.

### Manual Verification
- Test all 3 hackathon demo presets end-to-end.
- Test speech recognition & TTS audio playback.
- Test red-flag trigger with emergency banner.
- Test OCR upload and editable abnormal lab highlights.
- Test Doctor view Accept/Edit/Sign-off flow.
