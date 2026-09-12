/**
 * @file clinicalKnowledge.ts
 * @description Question banks, review of systems categories, and red flag keywords for MEDiMATE frontend.
 */

export interface QuestionBankItem {
  id: string;
  category: 'chiefComplaint' | 'socrates' | 'pastHistory' | 'medications' | 'family' | 'personal' | 'ros';
  titleEn: string;
  titleHi: string;
  promptEn: string;
  promptHi: string;
  audioTextEn: string;
  audioTextHi: string;
  optionsEn: string[];
  optionsHi: string[];
  type: 'single' | 'multi' | 'scale' | 'freetext';
  helperTextEn?: string;
  helperTextHi?: string;
}

export const COMMON_CHIEF_COMPLAINTS = [
  { en: 'Chest pain & breathlessness', hi: 'सीने में दर्द और सांस फूलना', icon: 'HeartPulse', redFlag: true },
  { en: 'Severe stomach/abdominal pain', hi: 'पेट में तेज दर्द / मरोड़', icon: 'Activity', redFlag: false },
  { en: 'Diabetes routine check-up & foot numbness', hi: 'शुगर / डायबिटीज की जांच और पैरों में सुन्नता', icon: 'Droplets', redFlag: false },
  { en: 'Knee joint pain & morning stiffness', hi: 'घुटनों में दर्द और सुबह जोड़ों में जकड़न', icon: 'Bone', redFlag: false },
  { en: 'High fever, chills & body ache', hi: 'तेज बुखार, कंपकंपी और बदन दर्द', icon: 'Thermometer', redFlag: false },
  { en: 'Persistent cough & throat irritation', hi: 'लगातार खांसी और गले में खराश', icon: 'Wind', redFlag: false },
];

export const PAST_MEDICAL_OPTIONS = [
  { en: 'Diabetes Mellitus (शुगर)', hi: 'डायबिटीज (शुगर)' },
  { en: 'Hypertension (उच्च रक्तचाप / बीपी)', hi: 'हाई ब्लड प्रेशर (उच्च रक्तचाप)' },
  { en: 'Heart Disease / CAD (हृदय रोग)', hi: 'हृदय रोग (हार्ट की बीमारी)' },
  { en: 'Asthma / Breathing issue (दमा)', hi: 'दमा / सांस की बीमारी (अस्थमा)' },
  { en: 'Thyroid disorder (थायराइड)', hi: 'थायराइड विकार' },
  { en: 'Kidney Disease (गुर्दे की बीमारी)', hi: 'गुर्दे / किडनी की समस्या' },
  { en: 'None of the above (कोई नहीं)', hi: 'इनमें से कोई नहीं' },
];

export const COMMON_ALLERGIES = [
  { en: 'No known drug allergies (NKDA)', hi: 'किसी दवा से कोई एलर्जी नहीं' },
  { en: 'Penicillin / Amoxicillin', hi: 'पेनिसिलिन / एमोक्सिसिलिन' },
  { en: 'Sulfa Drugs', hi: 'सल्फा दवाएं' },
  { en: 'Painkillers (NSAIDs / Ibuprofen)', hi: 'दर्द निवारक दवाएं (पेनकिलर)' },
  { en: 'Dust / Pollen allergy', hi: 'धूल / पराग कण से एलर्जी' },
];

export const REVIEW_OF_SYSTEMS_ITEMS = [
  { id: 'cvs', labelEn: 'Chest pain or palpitations', labelHi: 'सीने में दर्द या दिल की तेज धड़कन', icon: 'Heart' },
  { id: 'resp', labelEn: 'Cough or breathlessness', labelHi: 'खांसी या सांस लेने में परेशानी', icon: 'Wind' },
  { id: 'gi', labelEn: 'Nausea, acidity or bowel changes', labelHi: 'उल्टी, एसिडिटी या पेट में गड़बड़ी', icon: 'Activity' },
  { id: 'cns', labelEn: 'Headache, dizziness or numbness', labelHi: 'सिरदर्द, चक्कर या अंगों में सुन्नता', icon: 'Brain' },
  { id: 'msk', labelEn: 'Joint pain or swelling', labelHi: 'जोड़ों में दर्द या सूजन', icon: 'Bone' },
  { id: 'gen', labelEn: 'Frequent urination or burning', labelHi: 'पेशाब में जलन या बार-बार पेशाब आना', icon: 'Droplet' },
];
