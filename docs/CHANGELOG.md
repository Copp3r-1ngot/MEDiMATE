# MEDiMATE Changelog

All notable changes to the MEDiMATE project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-09-12 (Smart India Hackathon Prototype)

### Added
- **5-Screen End-to-End Clinical Flow:**
  1. `IDENTIFY`: Language selector (Hindi/English), ABHA ID validator & new patient registration, granular consent screen with audio readback, and 3 quick hackathon demo presets.
  2. `CONVERSE`: Dual voice & touch intake, adaptive SOCRATES clinical reasoning engine (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/Relieving, Severity), AYUSH Pariksha mode (Prakriti, Agni, Koshtha), and real-time Red-Flag safety alert system.
  3. `SCAN`: Document & prescription uploader with OCR progress simulation, editable clinical entities table, and automated abnormal lab range flagging in vivid red.
  4. `SUMMARIZE`: Comprehensive pre-consultation clinical case summary, TTS audio readback in native language, and mock ABDM/HIS encrypted push with QR code.
  5. `CONSULT`: Physician OPD workstation with waiting queue, triage badges, SOAP note viewer, Accept/Modify/Reject controls, prescription pad, and printable OPD slip.
- **Backend Mock & Real-API Ready Service:** Node.js/Express server providing endpoints for SOCRATES question generation, OCR document analysis, ABDM sync, and doctor OPD queue.
- **Comprehensive Documentation Suite:** `BUILD_LOG.md`, `ARCHITECTURE.md`, `KNOWN_ISSUES.md`, and top-level `README.md`.
