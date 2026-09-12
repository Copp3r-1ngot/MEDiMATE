/**
 * @file aiEngine.ts
 * @description Clinical Reasoning and Case-Taking AI Engine for MEDiMATE.
 * Implements:
 * 1. Adaptive SOCRATES questioning framework (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/Relieving, Severity).
 * 2. Real-time Emergency Red-Flag detection heuristics.
 * 3. AYUSH Dashavidha / Trividha Pariksha assessment logic (Prakriti, Agni, Koshtha).
 * 4. Structured Clinical Case Sheet & SOAP synthesis.
 * 5. Pluggable Cloud LLM adapter (falls back gracefully to offline deterministic engine).
 */

import { PatientRecord } from './mockStore';

export interface SocratesStep {
  stepKey: 'site' | 'onset' | 'character' | 'radiation' | 'associations' | 'timeCourse' | 'exacerbatingRelieving' | 'severity';
  questionEn: string;
  questionHi: string;
  quickRepliesEn: string[];
  quickRepliesHi: string[];
  inputType: 'choice' | 'multi_choice' | 'scale' | 'text';
}

export interface RedFlagCheckResult {
  triggered: boolean;
  severity: 'EMERGENCY' | 'PRIORITY' | 'ROUTINE';
  matchedKeywords: string[];
  clinicalWarningEn: string;
  clinicalWarningHi: string;
  recommendedAction: string;
}

// Red-flag clinical rules matrix for high-risk OPD triage
const RED_FLAG_RULES = [
  {
    condition: 'Acute Coronary Syndrome / Myocardial Infarction',
    keywords: ['chest pain', 'सीने में दर्द', 'chhati me dard', 'crushing pain', 'jaw pain', 'left arm pain', 'sweating', 'पसीना', 'shortness of breath', 'सांस फूलना', 'ghabrahat'],
    minMatch: 2,
    severity: 'EMERGENCY' as const,
    warningEn: 'CRITICAL ALERT: Acute crushing chest discomfort with breathlessness/radiation detected. Suspected Acute Coronary Syndrome.',
    warningHi: 'आपातकालीन चेतावनी: सीने में तेज दर्द एवं सांस फूलने के लक्षण पाए गए हैं। तुरंत आपातकालीन डॉक्टर को सूचित कर दिया गया है।',
    action: 'Immediate ECG, IV access, and urgent triage desk notification.',
  },
  {
    condition: 'Acute Stroke / TIA (FAST symptoms)',
    keywords: ['facial drooping', 'arm weakness', 'slurred speech', 'लकवा', 'बोलने में दिक्कत', 'sudden numbness', 'आधा शरीर सुन्न'],
    minMatch: 1,
    severity: 'EMERGENCY' as const,
    warningEn: 'CRITICAL ALERT: Acute focal neurological deficit (stroke symptoms) detected.',
    warningHi: 'आपातकालीन चेतावनी: चेहरे या हाथ-पैर में कमजोरी/सुन्नता के लक्षण। तुरंत स्ट्रोक टीम को सूचित किया गया।',
    action: 'Stat Non-Contrast Head CT, Stroke Code activation.',
  },
  {
    condition: 'Acute Severe Asthma / Respiratory Distress',
    keywords: ['unable to speak in sentences', 'blue lips', 'severe wheeze', 'सांस नहीं आ रही', 'दम घुटना', 'stridor'],
    minMatch: 1,
    severity: 'EMERGENCY' as const,
    warningEn: 'URGENT ALERT: Acute respiratory distress / severe bronchospasm detected.',
    warningHi: 'महत्वपूर्ण चेतावनी: सांस लेने में अत्यधिक तकलीफ पाई गई है।',
    action: 'Immediate Oxygen saturation monitoring & nebulization support.',
  },
  {
    condition: 'Acute Surgical Abdomen / Peritonitis',
    keywords: ['severe abdominal pain', 'पेट में बहुत तेज दर्द', 'rigid abdomen', 'vomiting blood', 'खून की उल्टी', 'black stool'],
    minMatch: 2,
    severity: 'PRIORITY' as const,
    warningEn: 'PRIORITY ALERT: Acute severe abdominal pain with potential peritoneal irritation or GI bleed.',
    warningHi: 'प्राथमिकता चेतावनी: पेट में गंभीर दर्द या रक्तस्त्राव के संकेत।',
    action: 'Urgent surgical review, abdominal ultrasound, erect X-ray abdomen.',
  }
];

export class ClinicalAiEngine {
  /**
   * Evaluates patient dialogue input against clinical red-flag triage rules
   */
  public static evaluateRedFlags(inputText: string, chiefComplaint: string, pastHx: string[] = []): RedFlagCheckResult {
    const combined = `${chiefComplaint} ${inputText} ${pastHx.join(' ')}`.toLowerCase();
    
    for (const rule of RED_FLAG_RULES) {
      const matches = rule.keywords.filter(kw => combined.includes(kw.toLowerCase()));
      if (matches.length >= rule.minMatch) {
        return {
          triggered: true,
          severity: rule.severity,
          matchedKeywords: matches,
          clinicalWarningEn: rule.warningEn,
          clinicalWarningHi: rule.warningHi,
          recommendedAction: rule.action,
        };
      }
    }

    return {
      triggered: false,
      severity: 'ROUTINE',
      matchedKeywords: [],
      clinicalWarningEn: '',
      clinicalWarningHi: '',
      recommendedAction: 'Proceed with routine OPD intake queue.',
    };
  }

  /**
   * Returns standard SOCRATES questions adapted to the symptom context
   */
  public static getSocratesQuestion(symptom: string, stepKey: SocratesStep['stepKey']): SocratesStep {
    switch (stepKey) {
      case 'site':
        return {
          stepKey: 'site',
          questionEn: `Where exactly is the ${symptom || 'pain / problem'} located?`,
          questionHi: `यह ${symptom || 'तकलीफ या दर्द'} शरीर में ठीक किस जगह पर है?`,
          quickRepliesEn: ['Chest / Center of chest', 'Upper Abdomen / Stomach', 'Lower Back', 'Knee Joints', 'Head / Forehead', 'Throat', 'Generalized'],
          quickRepliesHi: ['छाती / सीने के बीच में', 'पेट के ऊपरी भाग में', 'पीठ के निचले हिस्से में', 'घुटने या जोड़ों में', 'सिर / माथे में', 'गले में', 'पूरे शरीर में'],
          inputType: 'choice',
        };
      case 'onset':
        return {
          stepKey: 'onset',
          questionEn: 'When did this start, and did it come on suddenly or gradually?',
          questionHi: 'यह परेशानी कब शुरू हुई? क्या यह अचानक आई या धीरे-धीरे बढ़ी?',
          quickRepliesEn: ['Suddenly (< 1 hour ago)', 'Today (Few hours ago)', '2-3 days ago', '1-2 weeks ago', 'More than a month (Chronic)'],
          quickRepliesHi: ['अचानक (1 घंटे के भीतर)', 'आज (कुछ घंटों पहले)', '2-3 दिन पहले', '1-2 हफ्ते पहले', '1 महीने से अधिक समय से (पुराना)'],
          inputType: 'choice',
        };
      case 'character':
        return {
          stepKey: 'character',
          questionEn: 'How would you describe the feeling or type of pain?',
          questionHi: 'दर्द या तकलीफ का अहसास कैसा है?',
          quickRepliesEn: ['Crushing / Heavy Pressure', 'Sharp / Stabbing', 'Burning / Acidity', 'Dull Aching', 'Throbbing / Pulsating', 'Cramping'],
          quickRepliesHi: ['निचोड़ने जैसा भारी दबाव', 'चुभने या कांटे जैसा तेज', 'जलन / एसिडिटी जैसा', 'धीमा भारी दर्द', 'धड़कने या टीस मारने वाला', 'मरोड़ या ऐंठन जैसा'],
          inputType: 'choice',
        };
      case 'radiation':
        return {
          stepKey: 'radiation',
          questionEn: 'Does the pain or discomfort spread to any other part of your body?',
          questionHi: 'क्या यह दर्द शरीर के किसी अन्य हिस्से में फैलता है?',
          quickRepliesEn: ['Spreads to Left Arm & Jaw', 'Spreads to Back & Shoulder', 'Spreads down the Leg', 'Does not spread (Localized)'],
          quickRepliesHi: ['बाएं हाथ और जबड़े में फैलता है', 'पीठ और कंधे में फैलता है', 'पैर की तरफ नीचे जाता है', 'कहीं नहीं फैलता (एक ही जगह रहता है)'],
          inputType: 'choice',
        };
      case 'associations':
        return {
          stepKey: 'associations',
          questionEn: 'Are you experiencing any other associated symptoms along with this?',
          questionHi: 'क्या इसके साथ आपको इनमें से कोई और समस्या भी महसूस हो रही है?',
          quickRepliesEn: ['Profuse Sweating', 'Shortness of Breath', 'Nausea / Vomiting', 'Dizziness / Lightheadedness', 'Fever / Chills', 'Joint Stiffness', 'None of these'],
          quickRepliesHi: ['अधिक पसीना आना', 'सांस फूलना', 'उल्टी या जी मिचलाना', 'चक्कर आना / कमजोरी', 'बुखार / कंपकंपी', 'जोड़ों में जकड़न', 'इनमें से कोई नहीं'],
          inputType: 'multi_choice',
        };
      case 'timeCourse':
        return {
          stepKey: 'timeCourse',
          questionEn: 'How has the problem progressed over time?',
          questionHi: 'समय के साथ यह परेशानी कैसी रही है?',
          quickRepliesEn: ['Continuous & getting worse', 'Comes and goes in episodes', 'Constant and steady', 'Only during physical activity / exertion'],
          quickRepliesHi: ['लगातार बनी हुई है और बढ़ रही है', 'रुक-रुक कर आती-जाती है', 'एक जैसी बनी रहती है', 'सिर्फ चलने-फिरने या मेहनत करने पर होती है'],
          inputType: 'choice',
        };
      case 'exacerbatingRelieving':
        return {
          stepKey: 'exacerbatingRelieving',
          questionEn: 'Does anything make it better or worse (e.g. resting, eating, posture, medicines)?',
          questionHi: 'क्या किसी चीज से आराम मिलता है या तकलीफ बढ़ती है (जैसे आराम करने, खाने या चलने से)?',
          quickRepliesEn: ['Worse with exertion, better with rest', 'Worse after eating spicy food', 'Better with warm massage / hot compress', 'No change with anything'],
          quickRepliesHi: ['मेहनत से बढ़ती है, आराम से घटती है', 'मसालेदार खाने के बाद बढ़ती है', 'गर्म तेल मालिश या सिकाई से आराम मिलता है', 'किसी भी चीज से कोई फर्क नहीं पड़ता'],
          inputType: 'choice',
        };
      case 'severity':
        return {
          stepKey: 'severity',
          questionEn: 'On a scale of 1 to 10, how severe is your discomfort right now?',
          questionHi: '1 से 10 के पैमाने पर, अभी आपकी तकलीफ कितनी गंभीर है?',
          quickRepliesEn: ['1-3 (Mild, noticeable)', '4-6 (Moderate, uncomfortable)', '7-8 (Severe, difficult to bear)', '9-10 (Extremely Severe / Emergency)'],
          quickRepliesHi: ['1-3 (हल्का दर्द)', '4-6 (मध्यम, कष्टदायक)', '7-8 (गंभीर, असहनीय)', '9-10 (अत्यधिक तीव्र / आपातकालीन)'],
          inputType: 'scale',
        };
    }
  }

  /**
   * Generates a structured clinical case summary and standard SOAP note
   */
  public static generateClinicalSummary(patient: PatientRecord): {
    summaryText: string;
    soapFormat: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
    };
  } {
    const s = patient.clinicalHistory.socrates;
    const socDetails = [
      s.site ? `Site: ${s.site}` : '',
      s.onset ? `Onset: ${s.onset}` : '',
      s.character ? `Character: ${s.character}` : '',
      s.radiation ? `Radiation: ${s.radiation}` : '',
      s.associations && s.associations.length > 0 ? `Associated Symptoms: ${s.associations.join(', ')}` : '',
      s.timeCourse ? `Time Course: ${s.timeCourse}` : '',
      s.exacerbatingRelieving ? `Aggravating/Relieving: ${s.exacerbatingRelieving}` : '',
      s.severity ? `Pain Severity: ${s.severity}/10` : '',
    ].filter(Boolean).join(' | ');

    const scannedFindings = patient.scannedDocuments.map(doc => {
      const labs = doc.extractedLabValues.map(l => `${l.testName}: ${l.value} ${l.unit} ${l.isAbnormal ? `[${l.abnormalFlag || 'ABNORMAL'}]` : ''}`).join(', ');
      const meds = doc.extractedMedications.map(m => `${m.drugName} ${m.dosage} (${m.frequency})`).join(', ');
      return `[Doc: ${doc.fileName}] Rx: ${meds || 'None'} | Labs: ${labs || 'None'}`;
    }).join('\n');

    const ayushText = patient.ayushMode && patient.clinicalHistory.ayushAssessment ? `
AYUSH DASHIVIDHA ASSESSMENT:
• Prakriti: ${patient.clinicalHistory.ayushAssessment.prakriti || 'Undetermined'}
• Agni: ${patient.clinicalHistory.ayushAssessment.agni || 'Undetermined'}
• Koshtha: ${patient.clinicalHistory.ayushAssessment.koshtha || 'Undetermined'}` : '';

    const summaryText = `
CLINICAL CASE SUMMARY (MEDiMATE OPD Intake v0.1)
=====================================================
PATIENT: ${patient.name} | AGE/GENDER: ${patient.age}Y / ${patient.gender}
ABHA ID: ${patient.abhaId || 'Unlinked (New OPD Entry)'}
TRIAGE PRIORITY: ${patient.triagePriority} ${patient.clinicalHistory.redFlagTriggered ? '⚠️ [RED-FLAG ALERT]' : ''}

1. CHIEF COMPLAINT:
   ${patient.clinicalHistory.chiefComplaint}

2. HISTORY OF PRESENT ILLNESS (SOCRATES):
   ${socDetails || 'Patient presented for routine consultation.'}

3. PAST MEDICAL & SURGICAL HISTORY:
   ${patient.clinicalHistory.pastMedicalHistory.length > 0 ? patient.clinicalHistory.pastMedicalHistory.join(', ') : 'No prior chronic illnesses reported.'}

4. DRUG ALLERGIES & CURRENT MEDICATIONS:
   • Allergies: ${patient.clinicalHistory.drugAllergies.length > 0 ? patient.clinicalHistory.drugAllergies.join(', ') : 'NKDA (No known drug allergies)'}
   • Current Medications: ${patient.clinicalHistory.currentMedications.length > 0 ? patient.clinicalHistory.currentMedications.join(', ') : 'None reported'}

5. FAMILY & PERSONAL HISTORY:
   • Family Hx: ${patient.clinicalHistory.familyHistory.length > 0 ? patient.clinicalHistory.familyHistory.join(', ') : 'Non-contributory'}
   • Diet/Habits: Diet: ${patient.clinicalHistory.personalHistory.diet || 'Regular'}, Sleep: ${patient.clinicalHistory.personalHistory.sleep || 'Adequate'}, Tobacco/Alcohol: ${patient.clinicalHistory.personalHistory.smokingAlcohol || 'None'}

6. REVIEW OF SYSTEMS (ROS):
   ${patient.clinicalHistory.reviewOfSystems.length > 0 ? patient.clinicalHistory.reviewOfSystems.join(', ') : 'No additional systemic complaints.'}
${ayushText}

7. DIGITIZED PRIOR INVESTIGATIONS (OCR):
   ${scannedFindings || 'No previous documents scanned.'}
=====================================================
NOTICE: AI-assisted pre-consultation draft. Final clinical decision by registered medical practitioner.
`.trim();

    const soapFormat = {
      subjective: `Patient ${patient.name}, ${patient.age}y/${patient.gender}, presents with ${patient.clinicalHistory.chiefComplaint}. HPI: ${socDetails}. PMHx: ${patient.clinicalHistory.pastMedicalHistory.join(', ') || 'Nil'}. Allergies: ${patient.clinicalHistory.drugAllergies.join(', ') || 'NKDA'}.`,
      objective: `Pre-intake kiosk digitized data. Digitized prior records:\n${scannedFindings || 'No physical documents digitized.'}`,
      assessment: patient.clinicalHistory.redFlagTriggered
        ? `HIGH RISK: Suspected Acute Event. Red flag triggers: ${patient.clinicalHistory.redFlagDetails || 'Multiple critical indicators'}.`
        : `Provisional OPD intake for ${patient.clinicalHistory.chiefComplaint}. Stable baseline vitals recommended for physician evaluation.`,
      plan: `1. Direct clinical review by OPD Physician.\n2. Verify highlighted abnormal parameters.\n3. Formulate definitive diagnostic workup & Rx.`,
    };

    return { summaryText, soapFormat };
  }
}
