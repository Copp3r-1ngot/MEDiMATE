/**
 * @file ocr.ts
 * @description Types for OCR document extraction, prescriptions, and laboratory values.
 */

export interface ExtractedLabValue {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  abnormalFlag?: 'HIGH' | 'LOW' | 'CRITICAL';
}

export interface ExtractedMedication {
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface ExtractedDocument {
  id: string;
  fileName: string;
  fileType: 'prescription' | 'lab_report' | 'discharge_summary';
  uploadedAt: string;
  extractedDiagnoses: string[];
  extractedMedications: ExtractedMedication[];
  extractedLabValues: ExtractedLabValue[];
  rawTextPreview?: string;
  confidenceScore?: number;
}
