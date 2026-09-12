/**
 * @file patient.ts
 * @description Type definitions for patient demographics, ABHA ID identity, and consent.
 */

export type SupportedLanguage = 'hi' | 'en' | 'mr' | 'ta';

export type TriagePriority = 'ROUTINE' | 'PRIORITY' | 'EMERGENCY';

export interface PatientDemographics {
  id: string;
  abhaId: string;
  isNewPatient: boolean;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  language: SupportedLanguage;
  ayushMode: boolean;
  consent: {
    clinicalHistory: boolean;
    ocrProcessing: boolean;
    abhaSync: boolean;
    timestamp: string;
  };
}
