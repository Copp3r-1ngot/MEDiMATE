/**
 * @file clinical.ts
 * @description Types for clinical history, SOCRATES framework, red flags, AYUSH mode, and physician notes.
 */

import { TriagePriority } from './patient';
import { ExtractedDocument } from './ocr';

export interface SocratesData {
  site?: string;
  onset?: string;
  character?: string;
  radiation?: string;
  associations?: string[];
  timeCourse?: string;
  exacerbatingRelieving?: string;
  severity?: number;
}

export interface AyushAssessment {
  prakriti?: string;
  agni?: string;
  koshtha?: string;
  dhatuSrotas?: string;
}

export interface ClinicalHistory {
  chiefComplaint: string;
  socrates: SocratesData;
  pastMedicalHistory: string[];
  drugAllergies: string[];
  currentMedications: string[];
  familyHistory: string[];
  personalHistory: {
    diet?: string;
    sleep?: string;
    bowelBladder?: string;
    smokingAlcohol?: string;
  };
  reviewOfSystems: string[];
  ayushAssessment?: AyushAssessment;
  redFlagTriggered: boolean;
  redFlagDetails?: string;
}

export interface GeneratedSummary {
  summaryText: string;
  soapFormat: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  status: 'draft' | 'pushed_to_abdm' | 'reviewed_by_physician';
  pushedAt?: string;
  abdmTxnId?: string;
}

export interface PhysicianReview {
  physicianName: string;
  physicianNotes: string;
  finalDiagnosis: string;
  prescription: Array<{
    drug: string;
    dosage: string;
    timing: string;
    instructions: string;
  }>;
  status: 'Accepted' | 'Modified' | 'Rejected';
  signedAt: string;
}

export interface FullPatientCase {
  id: string;
  abhaId: string;
  isNewPatient: boolean;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  language: 'hi' | 'en' | 'mr' | 'ta';
  ayushMode: boolean;
  consent: {
    clinicalHistory: boolean;
    ocrProcessing: boolean;
    abhaSync: boolean;
    timestamp: string;
  };
  clinicalHistory: ClinicalHistory;
  scannedDocuments: ExtractedDocument[];
  generatedSummary?: GeneratedSummary;
  physicianReview?: PhysicianReview;
  triagePriority: TriagePriority;
  createdAt: string;
}
