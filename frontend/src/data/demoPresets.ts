/**
 * @file demoPresets.ts
 * @description Pre-configured demo scenarios for Hackathon evaluators to test
 * all system features (Emergency Red-Flag ACS, Diabetic Lab Scan, AYUSH Sandhivata) in a single click.
 */

import { FullPatientCase } from '../types/clinical';

export interface DemoPreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  description: string;
  targetScreen: 1 | 2 | 3 | 4 | 5;
  data: FullPatientCase;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'preset-chest-pain-emergency',
    title: 'Preset 1: Acute Chest Pain (Red-Flag ACS)',
    subtitle: 'Simulates high-risk emergency detection with instant OPD triage alert',
    badge: 'EMERGENCY RED-FLAG',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    description: 'Male 54y with crushing retrosternal pain radiating to left arm + diaphoresis. Triggers audio-visual emergency alert and staff pager.',
    targetScreen: 2,
    data: {
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
        chiefComplaint: 'तीव्र सीने में दर्द और सांस लेने में कठिनाई (Acute crushing chest pain & dyspnea)',
        socrates: {
          site: 'छाती / सीने के बीच में (Retrosternal)',
          onset: 'अचानक (1 घंटे के भीतर)',
          character: 'निचोड़ने जैसा भारी दबाव (Heavy crushing pressure)',
          radiation: 'बाएं हाथ और जबड़े में फैलता है (Spreads to left arm & jaw)',
          associations: ['अधिक पसीना आना (Profuse sweating)', 'सांस फूलना (Shortness of breath)', 'उल्टी या जी मिचलाना'],
          timeCourse: 'लगातार बनी हुई है और बढ़ रही है (Continuous & worsening)',
          exacerbatingRelieving: 'मेहनत से बढ़ती है, आराम से घटती है (Worse on exertion)',
          severity: 9,
        },
        pastMedicalHistory: ['Hypertension (5 years)', 'Type 2 Diabetes Mellitus (3 years)'],
        drugAllergies: ['Sulfa drugs (Causes skin rashes)'],
        currentMedications: ['Tab Telmisartan 40mg OD', 'Tab Metformin 500mg BD'],
        familyHistory: ['Father had premature myocardial infarction at age 52'],
        personalHistory: {
          diet: 'Mixed',
          sleep: '6 hours, restless',
          bowelBladder: 'Regular',
          smokingAlcohol: 'Former smoker (Quit 2 years ago)',
        },
        reviewOfSystems: ['Chest discomfort', 'Dyspnea', 'Diaphoresis', 'Fatigue'],
        redFlagTriggered: true,
        redFlagDetails: 'CRITICAL ALERT: Acute crushing retrosternal pain + Left arm radiation + Diaphoresis + Dyspnea. Suspected Acute Coronary Syndrome (ACS). Emergency OPD Desk notified.',
      },
      scannedDocuments: [],
      triagePriority: 'EMERGENCY',
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'preset-diabetes-lab-scan',
    title: 'Preset 2: Routine Diabetes + Prior Lab Scan',
    subtitle: 'Demonstrates OCR extraction with abnormal high-glucose and high-HbA1c range flagging',
    badge: 'OCR & LAB SCAN',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    description: 'Female 48y routine follow-up with scanned MaxLab report showing uncontrolled HbA1c (9.4%) and fasting glucose (188 mg/dL) flagged in red.',
    targetScreen: 3,
    data: {
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
        chiefComplaint: 'Routine 3-month diabetes follow-up and burning sensation in feet',
        socrates: {
          site: 'Bilateral feet and toes',
          onset: 'Gradual onset over 2 months',
          character: 'Burning / Pins & needles sensation',
          radiation: 'Spreads up to mid-calf bilaterally',
          associations: ['Increased thirst', 'Fatigue', 'Nocturia x2'],
          timeCourse: 'Worse at bedtime and after standing',
          exacerbatingRelieving: 'Relieved slightly by gentle massage',
          severity: 4,
        },
        pastMedicalHistory: ['Type 2 Diabetes (6 years)', 'Dyslipidemia (2 years)'],
        drugAllergies: ['NKDA (No known drug allergies)'],
        currentMedications: ['Tab Glimepiride 1mg OD', 'Tab Metformin 1000mg BD', 'Tab Atorvastatin 10mg HS'],
        familyHistory: ['Mother: Type 2 Diabetes & Chronic Kidney Disease'],
        personalHistory: {
          diet: 'Vegetarian, high carbohydrate',
          sleep: '7 hours',
          bowelBladder: 'Normal bowel, frequent urination',
          smokingAlcohol: 'Non-smoker',
        },
        reviewOfSystems: ['Polydipsia', 'Polyuria', 'Bilateral pedal paresthesia'],
        redFlagTriggered: false,
      },
      scannedDocuments: [
        {
          id: 'DOC-901',
          fileName: 'MaxLab_HbA1c_Lipid_Panel.pdf',
          fileType: 'lab_report',
          uploadedAt: new Date().toISOString(),
          extractedDiagnoses: ['Uncontrolled Type 2 Diabetes Mellitus', 'Diabetic Peripheral Neuropathy (Early)'],
          extractedMedications: [
            { drugName: 'Glimepiride', dosage: '1mg', frequency: 'Once daily before breakfast', duration: 'Ongoing' },
            { drugName: 'Metformin', dosage: '1000mg', frequency: 'Twice daily after meals', duration: 'Ongoing' },
          ],
          extractedLabValues: [
            { testName: 'HbA1c (Glycated Hemoglobin)', value: '9.4', unit: '%', referenceRange: '4.0 - 5.6', isAbnormal: true, abnormalFlag: 'HIGH' },
            { testName: 'Fasting Blood Glucose', value: '188', unit: 'mg/dL', referenceRange: '70 - 99', isAbnormal: true, abnormalFlag: 'HIGH' },
            { testName: 'Postprandial Blood Glucose', value: '264', unit: 'mg/dL', referenceRange: '< 140', isAbnormal: true, abnormalFlag: 'HIGH' },
            { testName: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', referenceRange: '0.6 - 1.2', isAbnormal: false },
            { testName: 'Total Cholesterol', value: '232', unit: 'mg/dL', referenceRange: '< 200', isAbnormal: true, abnormalFlag: 'HIGH' },
          ],
        }
      ],
      triagePriority: 'ROUTINE',
      createdAt: new Date().toISOString(),
    },
  },
  {
    id: 'preset-ayush-sandhivata',
    title: 'Preset 3: Knee Osteoarthritis (AYUSH Mode)',
    subtitle: 'Demonstrates Dashavidha Pariksha (Prakriti, Agni, Koshtha) integration',
    badge: 'AYUSH PARIKSHA',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Male 62y with bilateral knee pain (Sandhivata). Features Vata-Kapha Prakriti assessment, Agni evaluation, and herbal treatment history.',
    targetScreen: 2,
    data: {
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
          site: 'घुटने या जोड़ों में (Bilateral Knees, R > L)',
          onset: '1 महीने से अधिक समय से (पुराना - Chronic)',
          character: 'धीमा भारी दर्द (Deep aching pain with crepitus)',
          radiation: 'कहीं नहीं फैलता (Localized to knees)',
          associations: ['जोड़ों में जकड़न (Morning stiffness)', 'Fatigue'],
          timeCourse: 'रुक-रुक कर आती-जाती है (Episodic flare-ups)',
          exacerbatingRelieving: 'गर्म तेल मालिश या सिकाई से आराम मिलता है (Relieved by Abhyanga & warm compress)',
          severity: 6,
        },
        pastMedicalHistory: ['Bilateral Knee Osteoarthritis (Grade II Kellegren-Lawrence)'],
        drugAllergies: ['NKDA'],
        currentMedications: ['Shallaki 500mg BD', 'Mahanarayan Oil topical application'],
        familyHistory: ['Mother had severe knee osteoarthritis'],
        personalHistory: {
          diet: 'Dry and cold food habits, irregular meal timings',
          sleep: 'Disturbed due to knee stiffness',
          bowelBladder: 'Hard stool tendency (Krura Koshtha)',
          smokingAlcohol: 'Non-smoker',
        },
        reviewOfSystems: ['Joint stiffness', 'Crepitus', 'Mild joint swelling after exertion'],
        ayushAssessment: {
          prakriti: 'Vata-Kapha Pradhana (वात-कफ प्रधान प्रकृति)',
          agni: 'Vishama Agni / Irregular digestive metabolism (विषमाग्नि)',
          koshtha: 'Krura Koshtha / Constipation prone (क्रूर कोष्ठ)',
        },
        redFlagTriggered: false,
      },
      scannedDocuments: [],
      triagePriority: 'PRIORITY',
      createdAt: new Date().toISOString(),
    },
  }
];
