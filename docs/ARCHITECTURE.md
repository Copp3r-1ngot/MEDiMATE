# MEDiMATE Architecture & System Design

**Project:** MEDiMATE — AI-Powered Patient Case-Taking Software (v0.1 Prototype)  
**Hackathon Problem:** Smart India Hackathon #26047 (Ministry of Ayush / All India Institute of Ayurveda)  
**Tagline:** *"Your health, heard clearly before you walk in."*

---

## 1. System Overview

MEDiMATE is an OPD kiosk and tablet application designed to bridge the intake bottleneck in Indian healthcare facilities. Before a patient enters the doctor's consultation room, MEDiMATE guides them through a voice-and-touch clinical history intake in their native language, digitizes their physical prescriptions/lab reports via OCR, screens for clinical red flags, and compiles a structured case-taking summary linked to their ABHA health ID.

```
┌────────────────────────────────────────────────────────────────────────┐
│                         PATIENT KIOSK / TABLET                         │
│                                                                        │
│  [Screen 1: IDENTIFY] ──> [Screen 2: CONVERSE] ──> [Screen 3: SCAN]   │
│  • Language (HI/EN/..)     • Voice + Quick Chips    • Prescription/Lab │
│  • ABHA ID / New Pt        • SOCRATES adaptive HPI  • OCR Extraction   │
│  • Granular Consent        • Red-Flag Safety Alert  • Abnormal Ranges  │
│  • Demo Presets            • AYUSH Pariksha Mode                       │
│                                      │                                 │
│                                      ▼                                 │
│                           [Screen 4: SUMMARIZE]                        │
│                           • Structured Case Sheet                      │
│                           • Audio TTS Readback                         │
│                           • ABDM / HIS Push Simulation                 │
└──────────────────────────────────────┬─────────────────────────────────┘
                                       │
                                       ▼ (Secure ABDM / FHIR Data Stream)
┌────────────────────────────────────────────────────────────────────────┐
│                     PHYSICIAN OPD WORKSTATION                          │
│                                                                        │
│  [Screen 5: CONSULT]                                                   │
│  • Doctor OPD Waiting Queue with Red-Flag Triage Badges                │
│  • Formatted SOAP Case Note + Highlighted Lab Abnormals                │
│  • Governance Controls: [Accept] [Modify Note] [Reject/Retake]         │
│  • Clinical Impression & Rx Pad                                        │
│  • Printable OPD Consultation Slip                                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
MEDiMATE/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── historyRoutes.ts     # Dialogue and adaptive SOCRATES follow-up engine
│   │   │   ├── ocrRoutes.ts         # Document scanning & clinical entity extraction
│   │   │   ├── abdmRoutes.ts        # Mock ABDM / ABHA validation & push
│   │   │   └── doctorRoutes.ts      # OPD queue management & physician sign-off
│   │   ├── services/
│   │   │   ├── aiEngine.ts          # Hybrid rule-based + LLM history generator
│   │   │   ├── ocrEngine.ts         # Mock OCR + Vision API parser with normal ranges
│   │   │   └── mockStore.ts         # In-memory patient queue and case records
│   │   └── server.ts                # Express server entry point (Port 5000)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # Header, Footer, TopNav, KioskFrame
│   │   │   ├── common/              # AudioSpeaker, MicVoiceInput, QuickReplyPills, AlertBanner
│   │   │   ├── identify/            # LanguageSelector, AbhaCard, GranularConsent, PresetPicker
│   │   │   ├── converse/            # ChatHistory, SocratesFlow, AyushAssessment, PainScale
│   │   │   ├── scan/                # DocumentUpload, OcrViewer, LabTable, FlaggedMetrics
│   │   │   ├── summarize/           # SummarySheet, AudioReadback, AbhaPushModal, QrDisplay
│   │   │   └── consult/             # DoctorDashboard, QueueList, SoapNote, RxEditor, PrintSlip
│   │   ├── context/
│   │   │   └── PatientContext.tsx   # Global case state across the 5 screens
│   │   ├── services/
│   │   │   ├── speechService.ts     # Browser Web Speech API (STT / TTS)
│   │   │   ├── apiService.ts        # Backend client API
│   │   │   └── ocrService.ts        # Document parser & normal range evaluator
│   │   ├── data/
│   │   │   ├── demoPresets.ts       # 3 Scripted Hackathon Scenarios
│   │   │   ├── clinicalKnowledge.ts # SOCRATES question banks & red-flag rules
│   │   │   └── ayushQuestions.ts    # Prakriti, Agni, Koshtha Dashavidha questions
│   │   ├── types/                   # TypeScript interfaces (Patient, Case, Lab, Rx)
│   │   ├── App.tsx                  # Main route & screen navigator
│   │   └── main.tsx
│   ├── tailwind.config.js
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── BUILD_LOG.md                 # Running chronological log
│   ├── ARCHITECTURE.md              # System design & production roadmap
│   ├── KNOWN_ISSUES.md              # Known limitations and hacks
│   └── CHANGELOG.md                 # Version tracker
└── README.md
```

---

## 3. Data Flow Between Screens

1. **Screen 1 (IDENTIFY) -> State:**
   - Captures Patient Demographics, ABHA ID (`91-2049-3810-9482` or new registration), selected language (`hi-IN` / `en-IN`), and granular consent flags.
2. **Screen 2 (CONVERSE) -> State:**
   - Patient answers Chief Complaint.
   - Dynamic engine runs adaptive **SOCRATES** questions (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/relieving, Severity).
   - Evaluates real-time **Red-Flag criteria** (e.g. Chest pain + dyspnea -> triggers priority alert).
   - If AYUSH mode active: captures Prakriti, Agni, Koshtha.
3. **Screen 3 (SCAN) -> State:**
   - User uploads or snapshots previous Rx or lab reports.
   - OCR engine extracts medications and lab values, evaluating them against standard reference ranges (HbA1c, Fasting Blood Sugar, Creatinine, BP).
   - Out-of-range values marked in `flaggedAbnormal: true`.
4. **Screen 4 (SUMMARIZE) -> State:**
   - Combines conversation + OCR data into standard Clinical Case Sheet.
   - Patient hears speech summary and confirms.
   - State dispatched to Mock ABDM / HIS endpoint with generated transaction UUID.
5. **Screen 5 (CONSULT) -> State:**
   - Doctor views patient in OPD queue with triage badge (`HIGH PRIORITY` / `ROUTINE`).
   - Doctor reviews full case note, accepts or modifies notes, writes clinical impression/Rx, and signs off the OPD Slip.

---

## 4. Production Integration & Adapter Points

| Service Area | v0.1 Prototype Implementation | Production Target (Drop-in Replacement) |
|---|---|---|
| **Speech-to-Text (STT)** | Browser Web Speech API (`webkitSpeechRecognition`) | **Bhashini ASR / AI4Bharat** REST & WebSocket APIs supporting 22 Indian languages & dialects |
| **Text-to-Speech (TTS)** | Browser Web Speech Synthesis (`speechSynthesis`) | **Bhashini TTS / ElevenLabs Multilingual** with natural Indian accent prosody |
| **Clinical Dialogue Engine** | Deterministic SOCRATES rule-engine + Pluggable LLM endpoint | **Fine-tuned Clinical LLM (Gemini MedLM / Llama-3-Med)** with FHIR questionnaire schema validation |
| **Document OCR** | Pluggable Mock OCR + Google Cloud Vision / Azure Form Recognizer | **Custom Fine-tuned Indian Prescription & Lab OCR** with SNOMED-CT / LOINC mapping |
| **ABDM / ABHA Linkage** | In-memory Mock ABDM M1/M2/M3 generator | **National Health Authority (NHA) ABDM Sandbox Gateway** (M1: ABHA creation, M2: Health Facility Registry, M3: Health Information Exchange FHIR Bundles) |
| **Data Privacy** | In-memory ephemeral session state | **DPDP Act 2023 Compliant Storage** with AES-256 encryption at rest, TLS 1.3 in transit, and granular consent logs |
