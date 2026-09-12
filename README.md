	
# MEDiMATE — AI-Powered Patient Case-Taking Software (v0.1 Prototype)

> **Smart India Hackathon 2024 / Problem Statement #26047**  
> **Ministry:** Ministry of Ayush / All India Institute of Ayurveda (AIIA)  
> **Tagline:** *"Your health, heard clearly before you walk in."*

---

## 🌟 Overview

**MEDiMATE** is a kiosk- and tablet-optimized clinical case-taking platform designed to eliminate OPD intake bottlenecks in Indian hospitals. Before stepping into the consultation chamber, patients complete an interactive, audio-guided clinical intake in their native language (voice + touch), digitize past paper prescriptions/lab reports via OCR, and get screened for emergency red-flag conditions.

MEDiMATE synthesizes this information into a physician-ready structured case summary linked to their **ABHA (Ayushman Bharat Health Account)**, saving up to **6-8 minutes of intake time per patient** while ensuring registered medical practitioners retain 100% diagnostic and prescription authority.

---

## 🚀 Key Features & 5-Screen Patient Journey

```
┌────────────────────────────────────────────────────────────────────────┐
│                         PATIENT KIOSK / TABLET                         │
│                                                                        │
│  [Screen 1: IDENTIFY] ──> [Screen 2: CONVERSE] ──> [Screen 3: SCAN]   │
│  • Language (HI/EN/MR/TA)  • Dual Voice + Touch     • Prescription/Lab │
│  • ABHA ID / New Pt        • SOCRATES adaptive HPI  • OCR Extraction   │
│  • Granular Consent        • Red-Flag Safety Alert  • Abnormal Ranges  │
│  • 3 Demo Presets          • AYUSH Pariksha Mode                       │
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

1. **Screen 1: IDENTIFY**
   - Multilingual audio-guided selection: **Hindi (हिंदी), English, Marathi (मराठी), Tamil (தமிழ்)**.
   - 14-Digit ABHA ID validator (`91-8472-9103-4821` or `username@abdm`) & New Patient toggle.
   - **Granular Consent UI (DPDP Act 2023 Compliant)** with spoken voice readback of consent terms.
   - **1-Click Hackathon Demo Preset Selector** for rapid evaluation.

2. **Screen 2: CONVERSE (Core Clinical Intake Engine)**
   - **Dual-Mode Input:** Browser-native Web Speech API microphone recognition (STT) + large touchable quick-reply chips.
   - **Adaptive SOCRATES Framework:** Dynamic follow-ups covering **S**ite, **O**nset, **C**haracter, **R**adiation, **A**ssociations, **T**ime course, **E**xacerbating/Relieving factors, and **S**everity (1-10 visual pain scale with facial emojis).
   - **Real-Time Red-Flag Triaging:** Detects critical symptom clusters (e.g. crushing chest pain + dyspnea + left arm radiation) and immediately triggers an emergency alert banner and simulated hospital staff pager notification.
   - **AYUSH Dashavidha Mode:** Captures Ayurvedic constitution (*Prakriti*), digestive fire (*Agni*), and bowel motility (*Koshtha*).
   - Past Medical/Surgical History, Drug Allergies (e.g. Sulfa/Penicillin), and Review of Systems (ROS).

3. **Screen 3: SCAN (Document OCR & Lab Normal Range Flagging)**
   - Upload or snapshot physical prescriptions and lab reports.
   - Animated laser scanning & OCR extraction.
   - **Automated Abnormal Range Highlighting:** Flags out-of-range clinical parameters (e.g., HbA1c 9.4% [HIGH], Fasting Blood Glucose 188 mg/dL [HIGH], BP 148/94 [HIGH]) in vivid red badges.
   - Interactive table allowing patients to inspect or modify digitized values.

4. **Screen 4: SUMMARIZE (Pre-Consultation Summary & ABDM Sync)**
   - Generates unified clinical case draft in standard hospital format.
   - **TTS Spoken Readback:** Speaks the entire clinical summary back to the patient in Hindi or English.
   - **ABDM / HIS Push Simulation:** Dispatches encrypted FHIR bundle to Hospital Information System, generating an ABDM Transaction ID and QR Code badge.

5. **Screen 5: CONSULT (Physician OPD Workstation)**
   - Doctor's live OPD queue sorted by triage urgency (`EMERGENCY RED-FLAG`, `PRIORITY`, `ROUTINE`).
   - Standardized **SOAP** (Subjective, Objective, Assessment, Plan) case note.
   - **Physician Governance Controls:** `Accept`, `Modify Note`, `Reject / Retake`. (Confirms AI is strictly assistive).
   - Digital Prescription Pad and one-click **Printable OPD Consultation Slip**.

---

## 🎯 Scripted Demo Scenarios for Evaluators

You can load these instantly from the top header dropdown (**"Demo Presets"**):

| Preset | Patient | Chief Complaint & Scenario | Key Features Highlighted |
|---|---|---|---|
| **Preset 1** | Rajesh Sharma (54y, M) | Acute retrosternal crushing chest pain radiating to left arm + diaphoresis | **Red-Flag Emergency Triaging**, Staff Pager notification, High-Risk ACS classification |
| **Preset 2** | Sunita Devi (48y, F) | Routine 3-month Type 2 Diabetes follow-up + burning feet | **OCR Document Digitizer**, Out-of-range Lab Flagging (HbA1c 9.4% & Glucose 188 mg/dL highlighted in RED) |
| **Preset 3** | Anil Deshmukh (62y, M) | Bilateral knee pain (Sandhivata) + morning stiffness | **AYUSH Dashavidha Mode**, Vata-Kapha Prakriti, Vishama Agni, Krura Koshtha |

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Vite.
- **Backend:** Node.js, Express, TypeScript, Multer, In-memory state store.
- **Voice STT / TTS:** Web Speech API (`SpeechRecognition`, `speechSynthesis`) with graceful offline fallback.
- **OCR Engine:** Pluggable document parser with Indian clinical reference range validator.
- **Documentation:** Complete traceability suite maintained in `/docs`.

---

## 🔌 What's Mocked vs Real (and Production Swap Guide)

| Component | v0.1 Prototype (Current) | Production Target (Drop-in Replacement) |
|---|---|---|
| **Speech-to-Text (STT)** | Browser Web Speech API (`webkitSpeechRecognition`) | **Bhashini ASR / AI4Bharat** APIs with 22 Indian regional languages and dialect prosody |
| **Text-to-Speech (TTS)** | Browser Web Speech Synthesis (`speechSynthesis`) | **Bhashini TTS / ElevenLabs Multilingual** with natural Indian accents |
| **OCR Document Parsing** | Pluggable Mock Parser + Normal Range Validator | **Google Cloud Vision / Azure Health AI OCR** fine-tuned on handwritten Indian prescriptions |
| **Clinical Reasoning** | Deterministic SOCRATES rule-matrix + Pluggable LLM | **Fine-tuned Clinical LLM (Gemini MedLM / Llama-3-Med)** |
| **ABDM / ABHA Linkage** | In-memory Mock ABDM M1/M2/M3 generator | **National Health Authority (NHA) ABDM Gateway** (M1: ABHA creation, M2: Health Facility Registry, M3: Health Information Exchange FHIR) |
| **Data Protection** | Ephemeral session state | **DPDP Act 2023 Compliant Storage** with AES-256 encryption at rest and audit logging |

### How to Plug in Real Cloud API Keys
Create a `.env` file inside `backend/`:
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLOUD_VISION_KEY=your_cloud_vision_key_here
ABDM_CLIENT_ID=your_nha_sandbox_client_id
ABDM_CLIENT_SECRET=your_nha_sandbox_client_secret
```

---

## 💻 How to Run Locally

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)*

### 2. Start the Frontend Kiosk App
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000` (proxies `/api` calls to port 5000).*

---

## 📜 Traceability & Documentation in `/docs`

- [docs/BUILD_LOG.md](docs/BUILD_LOG.md) — Step-by-step chronological build log with architectural decisions and bug fixes.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Module breakdown, data flows, and production migration roadmap.
- [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md) — Assumptions, browser compatibility, and known limitations.
- [docs/CHANGELOG.md](docs/CHANGELOG.md) — Version release notes.

