/**
 * @file PatientContext.tsx
 * @description Central React state context for MEDiMATE.
 * Manages patient intake data, screen transitions (1->2->3->4->5), audio preferences,
 * AYUSH toggle, scanned documents, and doctor sign-off.
 */

import React, { createContext, useContext, useState } from 'react';
import { FullPatientCase, SocratesData, AyushAssessment } from '../types/clinical';
import { SupportedLanguage } from '../types/patient';
import { ExtractedDocument, ExtractedLabValue } from '../types/ocr';
import { DEMO_PRESETS } from '../data/demoPresets';
import { SpeechService } from '../services/speechService';

export interface PatientContextType {
  currentScreen: 1 | 2 | 3 | 4 | 5;
  setCurrentScreen: (screen: 1 | 2 | 3 | 4 | 5) => void;
  patient: FullPatientCase;
  setPatient: React.Dispatch<React.SetStateAction<FullPatientCase>>;
  
  // Quick operations
  setLanguage: (lang: SupportedLanguage) => void;
  setAyushMode: (enabled: boolean) => void;
  setConsent: (consent: { clinicalHistory: boolean; ocrProcessing: boolean; abhaSync: boolean }) => void;
  setChiefComplaint: (cc: string) => void;
  updateSocrates: (update: Partial<SocratesData>) => void;
  updateAyushAssessment: (update: Partial<AyushAssessment>) => void;
  addScannedDocument: (doc: ExtractedDocument) => void;
  updateScannedLabValue: (docId: string, testIndex: number, updated: ExtractedLabValue) => void;
  triggerRedFlag: (details: string) => void;
  
  // Demo presets
  loadDemoPreset: (presetId: string) => void;
  resetIntake: () => void;
  
  // Audio
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  speakPrompt: (text: string, overrideLang?: SupportedLanguage) => void;
}

const defaultInitialPatient: FullPatientCase = {
  id: `MED-2026-${Math.floor(100 + Math.random() * 900)}`,
  abhaId: '91-8472-9103-4821',
  isNewPatient: false,
  name: 'Rajesh Sharma',
  age: 54,
  gender: 'Male',
  phone: '+91 98765 43210',
  language: 'hi',
  ayushMode: false,
  consent: {
    clinicalHistory: true,
    ocrProcessing: true,
    abhaSync: true,
    timestamp: new Date().toISOString(),
  },
  clinicalHistory: {
    chiefComplaint: '',
    socrates: {},
    pastMedicalHistory: [],
    drugAllergies: [],
    currentMedications: [],
    familyHistory: [],
    personalHistory: {
      diet: 'Mixed',
      sleep: 'Normal',
      bowelBladder: 'Regular',
      smokingAlcohol: 'None',
    },
    reviewOfSystems: [],
    redFlagTriggered: false,
  },
  scannedDocuments: [],
  triagePriority: 'ROUTINE',
  createdAt: new Date().toISOString(),
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [patient, setPatient] = useState<FullPatientCase>(defaultInitialPatient);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  const toggleAudioMute = () => {
    setIsAudioMuted(prev => {
      if (!prev) SpeechService.stopSpeaking();
      return !prev;
    });
  };

  const speakPrompt = (text: string, overrideLang?: SupportedLanguage) => {
    if (isAudioMuted || !text) return;
    SpeechService.speak(text, overrideLang || patient.language);
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setPatient(prev => ({ ...prev, language: lang }));
  };

  const setAyushMode = (enabled: boolean) => {
    setPatient(prev => ({ ...prev, ayushMode: enabled }));
  };

  const setConsent = (consent: { clinicalHistory: boolean; ocrProcessing: boolean; abhaSync: boolean }) => {
    setPatient(prev => ({
      ...prev,
      consent: {
        ...consent,
        timestamp: new Date().toISOString(),
      }
    }));
  };

  const setChiefComplaint = (cc: string) => {
    setPatient(prev => ({
      ...prev,
      clinicalHistory: {
        ...prev.clinicalHistory,
        chiefComplaint: cc,
      }
    }));
  };

  const updateSocrates = (update: Partial<SocratesData>) => {
    setPatient(prev => ({
      ...prev,
      clinicalHistory: {
        ...prev.clinicalHistory,
        socrates: {
          ...prev.clinicalHistory.socrates,
          ...update,
        }
      }
    }));
  };

  const updateAyushAssessment = (update: Partial<AyushAssessment>) => {
    setPatient(prev => ({
      ...prev,
      clinicalHistory: {
        ...prev.clinicalHistory,
        ayushAssessment: {
          ...prev.clinicalHistory.ayushAssessment,
          ...update,
        }
      }
    }));
  };

  const addScannedDocument = (doc: ExtractedDocument) => {
    setPatient(prev => ({
      ...prev,
      scannedDocuments: [...prev.scannedDocuments, doc],
    }));
  };

  const updateScannedLabValue = (docId: string, testIndex: number, updated: ExtractedLabValue) => {
    setPatient(prev => ({
      ...prev,
      scannedDocuments: prev.scannedDocuments.map(doc => {
        if (doc.id !== docId) return doc;
        const newLabs = [...doc.extractedLabValues];
        newLabs[testIndex] = updated;
        return { ...doc, extractedLabValues: newLabs };
      })
    }));
  };

  const triggerRedFlag = (details: string) => {
    setPatient(prev => ({
      ...prev,
      triagePriority: 'EMERGENCY',
      clinicalHistory: {
        ...prev.clinicalHistory,
        redFlagTriggered: true,
        redFlagDetails: details,
      }
    }));
  };

  const loadDemoPreset = (presetId: string) => {
    const preset = DEMO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setPatient(JSON.parse(JSON.stringify(preset.data)));
      setCurrentScreen(preset.targetScreen);
    }
  };

  const resetIntake = () => {
    setPatient({
      ...defaultInitialPatient,
      id: `MED-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    });
    setCurrentScreen(1);
    SpeechService.stopSpeaking();
    SpeechService.stopListening();
  };

  return (
    <PatientContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        patient,
        setPatient,
        setLanguage,
        setAyushMode,
        setConsent,
        setChiefComplaint,
        updateSocrates,
        updateAyushAssessment,
        addScannedDocument,
        updateScannedLabValue,
        triggerRedFlag,
        loadDemoPreset,
        resetIntake,
        isAudioMuted,
        toggleAudioMute,
        speakPrompt,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
