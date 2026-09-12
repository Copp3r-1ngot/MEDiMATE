/**
 * @file mockStore.ts
 * @description In-memory data store for MEDiMATE v0.1 Prototype.
 * Manages active patient sessions, clinical history records, OCR documents,
 * and the physician's OPD triage queue.
 */

export interface PatientRecord {
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
  clinicalHistory: {
    chiefComplaint: string;
    socrates: {
      site?: string;
      onset?: string;
      character?: string;
      radiation?: string;
      associations?: string[];
      timeCourse?: string;
      exacerbatingRelieving?: string;
      severity?: number;
    };
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
    ayushAssessment?: {
      prakriti?: string;
      agni?: string;
      koshtha?: string;
    };
    redFlagTriggered: boolean;
    redFlagDetails?: string;
  };
  scannedDocuments: {
    id: string;
    fileName: string;
    fileType: 'prescription' | 'lab_report' | 'discharge_summary';
    uploadedAt: string;
    extractedDiagnoses: string[];
    extractedMedications: Array<{
      drugName: string;
      dosage: string;
      frequency: string;
      duration: string;
    }>;
    extractedLabValues: Array<{
      testName: string;
      value: string;
      unit: string;
      referenceRange: string;
      isAbnormal: boolean;
      abnormalFlag?: 'HIGH' | 'LOW' | 'CRITICAL';
    }>;
  }[];
  generatedSummary?: {
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
  };
  physicianReview?: {
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
  };
  triagePriority: 'ROUTINE' | 'PRIORITY' | 'EMERGENCY';
  createdAt: string;
}

// In-memory array for active cases
export const patientDatabase: Map<string, PatientRecord> = new Map();

// Seed Initial Hackathon Demo Presets
export function seedDemoData(): void {
  // Preset 1: Acute Chest Pain & Dyspnea (Red-Flag Emergency)
  const case1: PatientRecord = {
    id: 'MED-2026-001',
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
      chiefComplaint: 'तीव्र सीने में दर्द और सांस लेने में कठिनाई (Acute retrosternal chest pain with breathlessness)',
      socrates: {
        site: 'Retrosternal (छाती के बीच में)',
        onset: 'Sudden onset 45 minutes ago during light walking',
        character: 'Heavy crushing pressure / निचोड़ने जैसा दबाव',
        radiation: 'Radiating to left arm and jaw (बाएं हाथ और जबड़े तक)',
        associations: ['Profuse sweating (पसीना)', 'Shortness of breath (सांस फूलना)', 'Mild nausea'],
        timeCourse: 'Continuous and progressively worsening',
        exacerbatingRelieving: 'Aggravated by exertion, no relief on resting',
        severity: 9,
      },
      pastMedicalHistory: ['Hypertension (5 years)', 'Type 2 Diabetes Mellitus (3 years)'],
      drugAllergies: ['Sulfa drugs (causes rash)'],
      currentMedications: ['Tab Telmisartan 40mg OD', 'Tab Metformin 500mg BD'],
      familyHistory: ['Father had premature CAD / Myocardial Infarction at age 52'],
      personalHistory: {
        diet: 'Mixed',
        sleep: '6 hours, restless',
        bowelBladder: 'Regular',
        smokingAlcohol: 'Former smoker (quit 2 years ago, 15 pack-years)',
      },
      reviewOfSystems: ['Chest discomfort', 'Dyspnea', 'Diaphoresis', 'Fatigue'],
      redFlagTriggered: true,
      redFlagDetails: 'CRITICAL: Acute crushing chest pain + Left arm radiation + Diaphoresis + Dyspnea. Suspected Acute Coronary Syndrome (ACS / STEMI). Emergency triage notified.',
    },
    scannedDocuments: [],
    triagePriority: 'EMERGENCY',
    createdAt: new Date().toISOString(),
  };

  // Preset 2: Routine Type 2 Diabetes Follow-up + Prior Lab Prescription Scan
  const case2: PatientRecord = {
    id: 'MED-2026-002',
    abhaId: '91-3049-1120-7744',
    isNewPatient: false,
    name: 'Sunita Devi',
    age: 48,
    gender: 'Female',
    phone: '+91 98112 34567',
    language: 'en',
    ayushMode: false,
    consent: {
      clinicalHistory: true,
      ocrProcessing: true,
      abhaSync: true,
      timestamp: new Date().toISOString(),
    },
    clinicalHistory: {
      chiefComplaint: 'Routine 3-month diabetes follow-up and intermittent tingling in feet',
      socrates: {
        site: 'Bilateral feet and toes (Distal lower extremities)',
        onset: 'Gradual onset over 2 months',
        character: 'Pins and needles sensation (Paresthesia), burning at night',
        radiation: 'Up to mid-calf bilaterally',
        associations: ['Increased thirst (polydipsia)', 'Fatigue', 'Nocturia x2'],
        timeCourse: 'Worse at bedtime and after standing for long hours',
        exacerbatingRelieving: 'Relieved slightly by gentle massage and foot elevation',
        severity: 4,
      },
      pastMedicalHistory: ['Type 2 Diabetes (6 years)', 'Dyslipidemia (2 years)'],
      drugAllergies: ['No known drug allergies (NKDA)'],
      currentMedications: ['Tab Glimepiride 1mg OD', 'Tab Metformin 1000mg BD', 'Tab Atorvastatin 10mg HS'],
      familyHistory: ['Mother: Type 2 Diabetes & Chronic Kidney Disease'],
      personalHistory: {
        diet: 'Vegetarian, high carbohydrate intake',
        sleep: '7 hours',
        bowelBladder: 'Normal bowel, increased nocturnal urination',
        smokingAlcohol: 'Non-smoker, non-drinker',
      },
      reviewOfSystems: ['Polydipsia', 'Polyuria', 'Bilateral pedal paresthesia'],
      redFlagTriggered: false,
    },
    scannedDocuments: [
      {
        id: 'DOC-901',
        fileName: 'MaxLab_HbA1c_Report_Sept2026.pdf',
        fileType: 'lab_report',
        uploadedAt: new Date().toISOString(),
        extractedDiagnoses: ['Uncontrolled Type 2 Diabetes Mellitus', 'Diabetic Peripheral Neuropathy (Early)'],
        extractedMedications: [
          { drugName: 'Glimepiride', dosage: '1mg', frequency: 'Once daily before breakfast', duration: 'Ongoing' },
          { drugName: 'Metformin', dosage: '1000mg', frequency: 'Twice daily after meals', duration: 'Ongoing' },
        ],
        extractedLabValues: [
          { testName: 'HbA1c (Glycated Hemoglobin)', value: '9.4', unit: '%', referenceRange: '4.0 - 5.6 (Normal), < 7.0 (Target)', isAbnormal: true, abnormalFlag: 'HIGH' },
          { testName: 'Fasting Blood Glucose', value: '188', unit: 'mg/dL', referenceRange: '70 - 99', isAbnormal: true, abnormalFlag: 'HIGH' },
          { testName: 'Postprandial Blood Glucose', value: '264', unit: 'mg/dL', referenceRange: '< 140', isAbnormal: true, abnormalFlag: 'HIGH' },
          { testName: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', referenceRange: '0.6 - 1.2', isAbnormal: false },
          { testName: 'eGFR', value: '88', unit: 'mL/min/1.73m²', referenceRange: '> 60', isAbnormal: false },
        ],
      },
    ],
    triagePriority: 'ROUTINE',
    createdAt: new Date().toISOString(),
  };

  // Preset 3: Chronic Knee Osteoarthritis / Sandhivata (AYUSH Mode)
  const case3: PatientRecord = {
    id: 'MED-2026-003',
    abhaId: '91-6621-4901-2299',
    isNewPatient: true,
    name: 'Anil Deshmukh',
    age: 62,
    gender: 'Male',
    phone: '+91 99220 11882',
    language: 'hi',
    ayushMode: true,
    consent: {
      clinicalHistory: true,
      ocrProcessing: true,
      abhaSync: true,
      timestamp: new Date().toISOString(),
    },
    clinicalHistory: {
      chiefComplaint: 'दोनों घुटनों में पुराना दर्द और सुबह जकड़न (Bilateral knee joint pain & morning stiffness / संधिवात)',
      socrates: {
        site: 'Bilateral Knee Joints (दोनों घुटने, दायां > बायां)',
        onset: 'Insidious onset over past 1.5 years, worsening in cold weather',
        character: 'Deep aching pain with crepitus / चरचराहट और भारी दर्द',
        radiation: 'Down to proximal tibia',
        associations: ['Morning joint stiffness lasting ~25 mins', 'Difficulty climbing stairs & squatting'],
        timeCourse: 'Chronic persistent, episodic flare-ups during rainy/winter seasons',
        exacerbatingRelieving: 'Aggravated by cold breeze and prolonged walking; relieved by warm oil massage (Abhyanga) & hot fomentation',
        severity: 6,
      },
      pastMedicalHistory: ['Mild Osteoarthritis Bilateral Knees (Grade II Kellegren-Lawrence)'],
      drugAllergies: ['NKDA'],
      currentMedications: ['Shallaki (Boswellia) 500mg BD', 'Ayurvedic Mahanarayan Oil application'],
      familyHistory: ['Mother had severe knee osteoarthritis'],
      personalHistory: {
        diet: 'Vata-aggravating dry and cold foods, irregular meal timings',
        sleep: 'Disturbed due to joint stiffness',
        bowelBladder: 'Mild constipation, hard stools',
        smokingAlcohol: 'Non-smoker',
      },
      reviewOfSystems: ['Joint stiffness', 'Crepitus', 'Mild joint swelling after exertion'],
      ayushAssessment: {
        prakriti: 'Vata-Kapha Pradhana (वात-कफ प्रधान प्रकृति)',
        agni: 'Vishama Agni / Irregular digestive metabolism (विषमाग्नि)',
        koshtha: 'Krura Koshtha / Hard bowel evacuation tendency (क्रूर कोष्ठ)',
      },
      redFlagTriggered: false,
    },
    scannedDocuments: [],
    triagePriority: 'PRIORITY',
    createdAt: new Date().toISOString(),
  };

  patientDatabase.set(case1.id, case1);
  patientDatabase.set(case2.id, case2);
  patientDatabase.set(case3.id, case3);
}

// Initialize seed data
seedDemoData();
