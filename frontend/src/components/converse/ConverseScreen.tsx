/**
 * @file ConverseScreen.tsx
 * @description Screen 2: Core Clinical Dialogue & AI Case-Taking Engine.
 * Implements:
 * 1. Dual-mode Voice (STT) + Tappable Quick-Reply Chips.
 * 2. Adaptive SOCRATES questioning framework (Site, Onset, Character, Radiation, Associations, Time course, Exacerbating/Relieving, Severity).
 * 3. Real-time Emergency Red-Flag detection & staff paging simulation.
 * 4. AYUSH Pariksha Mode (Prakriti, Agni, Koshtha).
 * 5. Review of Systems (ROS), Past History, and Allergies.
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Flame, 
  Siren
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { AudioSpeaker } from '../common/AudioSpeaker';
import { MicVoiceInput } from '../common/MicVoiceInput';
import { 
  COMMON_CHIEF_COMPLAINTS, 
  PAST_MEDICAL_OPTIONS, 
  COMMON_ALLERGIES, 
  REVIEW_OF_SYSTEMS_ITEMS 
} from '../../data/clinicalKnowledge';
import { AYUSH_QUESTIONS } from '../../data/ayushQuestions';
import { ApiService } from '../../services/apiService';
import { SocratesData } from '../../types/clinical';

type DialogueStage = 
  | 'CHIEF_COMPLAINT'
  | 'SOCRATES_SITE'
  | 'SOCRATES_ONSET'
  | 'SOCRATES_CHARACTER'
  | 'SOCRATES_RADIATION'
  | 'SOCRATES_ASSOCIATIONS'
  | 'SOCRATES_TIMECOURSE'
  | 'SOCRATES_EXACERBATING'
  | 'SOCRATES_SEVERITY'
  | 'PAST_HISTORY'
  | 'DRUG_ALLERGIES'
  | 'ROS_CHECKLIST'
  | 'AYUSH_PARIKSHA';

export const ConverseScreen: React.FC = () => {
  const { 
    patient, 
    setCurrentScreen, 
    setChiefComplaint, 
    updateSocrates, 
    updateAyushAssessment, 
    triggerRedFlag, 
    speakPrompt, 
    setPatient 
  } = usePatient();

  const [currentStage, setCurrentStage] = useState<DialogueStage>('CHIEF_COMPLAINT');
  const [showStaffAlertModal, setShowStaffAlertModal] = useState<boolean>(false);

  // Auto-speak question prompt when stage changes
  useEffect(() => {
    const prompt = getStagePrompt();
    speakPrompt(prompt, patient.language);
  }, [currentStage]);

  // Evaluate red-flags whenever relevant fields update
  const checkClinicalRedFlags = async (text: string) => {
    const res = await ApiService.checkRedFlags(
      text, 
      patient.clinicalHistory.chiefComplaint, 
      patient.clinicalHistory.pastMedicalHistory
    );
    if (res && res.triggered) {
      triggerRedFlag(res.clinicalWarningEn || 'Critical emergency indicator');
      setShowStaffAlertModal(true);
    }
  };

  const getStagePrompt = (): string => {
    const isHi = patient.language === 'hi';
    switch (currentStage) {
      case 'CHIEF_COMPLAINT':
        return isHi ? 'आज आपको क्या तकलीफ है? कृपया बताएं या नीचे दिए गए विकल्पों में से चुनें।' : 'What brings you in today? Please speak or tap from the options below.';
      case 'SOCRATES_SITE':
        return isHi ? 'यह तकलीफ या दर्द शरीर में ठीक किस जगह पर है?' : 'Where exactly is the discomfort or pain located?';
      case 'SOCRATES_ONSET':
        return isHi ? 'यह परेशानी कब शुरू हुई? क्या यह अचानक आई या धीरे-धीरे?' : 'When did this start, and did it come on suddenly or gradually?';
      case 'SOCRATES_CHARACTER':
        return isHi ? 'दर्द या तकलीफ का अहसास कैसा है (जैसे भारी दबाव, चुभन या जलन)?' : 'How would you describe the sensation (e.g. crushing, sharp, burning)?';
      case 'SOCRATES_RADIATION':
        return isHi ? 'क्या यह दर्द शरीर के किसी अन्य हिस्से में फैलता है (जैसे हाथ या जबड़े में)?' : 'Does the pain spread or radiate to any other part of your body?';
      case 'SOCRATES_ASSOCIATIONS':
        return isHi ? 'क्या इसके साथ पसीना, सांस फूलना या चक्कर जैसे अन्य लक्षण भी हैं?' : 'Are you experiencing associated symptoms like sweating or shortness of breath?';
      case 'SOCRATES_TIMECOURSE':
        return isHi ? 'समय के साथ यह परेशानी कैसी रही है?' : 'How has the problem progressed over time?';
      case 'SOCRATES_EXACERBATING':
        return isHi ? 'क्या किसी चीज से आराम मिलता है या तकलीफ बढ़ती है?' : 'Does anything make it better or worse (e.g. rest or exertion)?';
      case 'SOCRATES_SEVERITY':
        return isHi ? '1 से 10 के पैमाने पर, अभी आपकी तकलीफ कितनी तीव्र है?' : 'On a scale of 1 to 10, how severe is your pain right now?';
      case 'PAST_HISTORY':
        return isHi ? 'क्या आपको पहले से कोई बीमारी है (जैसे बीपी, शुगर, थायराइड)?' : 'Do you have any past chronic medical conditions (e.g. BP, Diabetes)?';
      case 'DRUG_ALLERGIES':
        return isHi ? 'क्या आपको किसी दवा से कोई एलर्जी है?' : 'Do you have any known allergies to medicines or food?';
      case 'ROS_CHECKLIST':
        return isHi ? 'क्या आपको शरीर के किसी अन्य अंग में कोई परेशानी महसूस हो रही है?' : 'Do you have any additional symptoms across other body systems?';
      case 'AYUSH_PARIKSHA':
        return isHi ? 'आयुष प्रकृति एवं अग्नि मूल्यांकन: अपने शारीरिक स्वभाव का चयन करें।' : 'AYUSH Assessment: Select your body constitution and digestive tendency.';
      default:
        return '';
    }
  };

  const handleSelectChiefComplaint = (complaintText: string) => {
    setChiefComplaint(complaintText);
    checkClinicalRedFlags(complaintText);
    setCurrentStage('SOCRATES_SITE');
  };

  const handleVoiceTranscript = (text: string) => {
    checkClinicalRedFlags(text);

    if (currentStage === 'CHIEF_COMPLAINT') {
      setChiefComplaint(text);
      setCurrentStage('SOCRATES_SITE');
    }
  };

  const handleSocratesAnswer = (key: keyof SocratesData, value: any, nextStage: DialogueStage) => {
    updateSocrates({ [key]: value });
    if (typeof value === 'string') {
      checkClinicalRedFlags(value);
    }
    setCurrentStage(nextStage);
  };

  const togglePastHistory = (item: string) => {
    const current = patient.clinicalHistory.pastMedicalHistory;
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    setPatient(prev => ({
      ...prev,
      clinicalHistory: {
        ...prev.clinicalHistory,
        pastMedicalHistory: updated,
      }
    }));
  };

  const toggleAllergy = (allergy: string) => {
    const current = patient.clinicalHistory.drugAllergies;
    const updated = current.includes(allergy)
      ? current.filter(a => a !== allergy)
      : [...current, allergy];
    setPatient(prev => ({
      ...prev,
      clinicalHistory: {
        ...prev.clinicalHistory,
        drugAllergies: updated,
      }
    }));
  };

  const toggleRosItem = (label: string) => {
    const current = patient.clinicalHistory.reviewOfSystems;
    const updated = current.includes(label)
      ? current.filter(r => r !== label)
      : [...current, label];
    setPatient(prev => ({
      ...prev,
      clinicalHistory: {
        ...prev.clinicalHistory,
        reviewOfSystems: updated,
      }
    }));
  };

  const proceedToNextScreen = () => {
    speakPrompt(
      patient.language === 'hi' 
        ? 'बहुत अच्छा। अब कृपया अपने पुराने मेडिकल पर्चे या जांच रिपोर्ट स्कैन करें।'
        : 'Thank you. Now please scan or upload your prior medical documents.',
      patient.language
    );
    setCurrentScreen(3);
  };

  const isHi = patient.language === 'hi';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Real-time Emergency Red-Flag Banner */}
      {patient.clinicalHistory.redFlagTriggered && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/90 via-red-900/80 to-slate-900 border-2 border-red-500 shadow-2xl flex items-start sm:items-center justify-between gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/50 animate-pulse">
              <Siren className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-red-500 text-white tracking-wider">
                  ⚠️ आपातकालीन रेड-फ्लैग अलर्ट (High-Priority Triage)
                </span>
                <span className="text-xs text-red-300 font-mono">OPD Desk Paged</span>
              </div>
              <p className="text-sm font-bold text-red-100 mt-1">
                {patient.clinicalHistory.redFlagDetails || 'उच्च जोखिम लक्षण पहचाने गए हैं। अस्पताल स्टाफ को सतर्क किया गया है।'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowStaffAlertModal(true)}
            className="touch-target px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all flex-shrink-0 shadow-lg"
          >
            स्टाफ अलर्ट देखें
          </button>
        </div>
      )}

      {/* Staff Alert Simulation Modal */}
      {showStaffAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-elevated max-w-lg w-full p-6 sm:p-8 space-y-5 border-red-500 shadow-red-900/50 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-400">
              <Siren className="w-8 h-8 animate-spin" style={{ animationDuration: '3s' }} />
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  आपातकालीन ट्राइएज नोटिफिकेशन (Staff Paged)
                </h3>
                <p className="text-xs text-red-300">Simulated Hospital Emergency Relay</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-sm text-red-200 space-y-2">
              <div className="font-semibold text-white">मरीज: {patient.name} ({patient.age}y/{patient.gender})</div>
              <div>लक्षण: {patient.clinicalHistory.chiefComplaint}</div>
              <div className="text-xs font-mono text-amber-300">
                🚨 संकेत: सीने में भारी दबाव + बाएं हाथ में दर्द + सांस फूलना (ACS Suspected)
              </div>
              <div className="text-xs text-slate-300 pt-1">
                ✓ ईसीजी कक्ष (Room 104) को सूचना भेजी गई<br />
                ✓ वरिष्ठ रेजिडेंट डॉक्टर एवं ड्यूटी नर्स को अलर्ट जारी
              </div>
            </div>

            <p className="text-xs text-slate-400">
              यह प्रणाली मरीज के स्वास्थ्य की सुरक्षा के लिए उच्च जोखिम मामलों को स्वतः आपातकालीन श्रेणी में प्राथमिकता देती है।
            </p>

            <button
              type="button"
              onClick={() => setShowStaffAlertModal(false)}
              className="touch-target w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/30"
            >
              ठीक है, संवाद जारी रखें (Acknowledge & Continue)
            </button>
          </div>
        </div>
      )}

      {/* Main Dialogue Panel */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        
        {/* Header with Step indicator & Audio Speaker */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                चरण 2: क्लिनिकल संवाद (AI Case-Taking)
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">
                Stage: {currentStage.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {getStagePrompt()}
            </h2>
          </div>

          <AudioSpeaker textToSpeak={getStagePrompt()} size="lg" />
        </div>

        {/* Dynamic Stage Rendering */}

        {/* 1. CHIEF COMPLAINT STAGE */}
        {currentStage === 'CHIEF_COMPLAINT' && (
          <div className="space-y-6">
            <MicVoiceInput
              onTranscriptFinal={handleVoiceTranscript}
              placeholderText="माइक दबाकर बोलें: 'मुझे सीने में दर्द है' या 'मुझे शुगर की जांच करानी है'..."
              samplePhrases={[
                'तीव्र सीने में दर्द और सांस फूलना (Chest pain & SOB)',
                'पेट में बहुत तेज दर्द हो रहा है (Severe stomach pain)',
                'शुगर की 3 महीने की जांच व पैरों में जलन (Diabetes follow-up)',
                'दोनों घुटनों में पुराना दर्द (Knee joint pain / Sandhivata)',
              ]}
            />

            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>या नीचे दिए गए प्रमुख लक्षणों में से एक चुनें (Touch to Select):</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMMON_CHIEF_COMPLAINTS.map((cc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectChiefComplaint(isHi ? cc.hi : cc.en)}
                    className="touch-target p-4 rounded-2xl bg-slate-800/80 hover:bg-teal-900/40 border border-slate-700 hover:border-teal-400 text-left transition-all hover:scale-[1.01] flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-base font-bold text-white group-hover:text-teal-300">
                        {isHi ? cc.hi : cc.en}
                      </div>
                      <div className="text-xs text-slate-400">
                        {isHi ? cc.en : cc.hi}
                      </div>
                    </div>
                    {cc.redFlag && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                        Red-Flag
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. SOCRATES - SITE */}
        {currentStage === 'SOCRATES_SITE' && (
          <div className="space-y-6">
            <MicVoiceInput
              onTranscriptFinal={(txt) => handleSocratesAnswer('site', txt, 'SOCRATES_ONSET')}
              samplePhrases={['सीने के बीच में (Center of chest)', 'पेट के ऊपरी भाग में (Upper abdomen)', 'दोनों घुटनों में (Knees)']}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { en: 'Chest / Center of chest', hi: 'छाती / सीने के बीच में (Retrosternal)' },
                { en: 'Upper Abdomen / Stomach', hi: 'पेट के ऊपरी भाग में (Epigastrium)' },
                { en: 'Lower Back / Spine', hi: 'पीठ के निचले हिस्से में' },
                { en: 'Knee Joints (Bilateral)', hi: 'दोनों घुटनों या जोड़ों में' },
                { en: 'Head / Forehead', hi: 'सिर / माथे में' },
                { en: 'Throat & Neck', hi: 'गले और गर्दन में' },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSocratesAnswer('site', isHi ? opt.hi : opt.en, 'SOCRATES_ONSET')}
                  className="touch-target p-4 rounded-2xl bg-slate-800 hover:bg-teal-900/50 border border-slate-700 hover:border-teal-400 text-left font-bold text-white transition-all hover:scale-[1.01]"
                >
                  {isHi ? opt.hi : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. SOCRATES - ONSET */}
        {currentStage === 'SOCRATES_ONSET' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { en: 'Suddenly (< 1 hour ago)', hi: 'अचानक (1 घंटे के भीतर)' },
                { en: 'Today (A few hours ago)', hi: 'आज (कुछ घंटों पहले)' },
                { en: '2-3 days ago', hi: '2-3 दिन पहले से' },
                { en: '1-2 weeks ago', hi: '1-2 हफ्ते पहले से' },
                { en: 'More than a month (Chronic)', hi: '1 महीने से अधिक समय से (पुराना)' },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSocratesAnswer('onset', isHi ? opt.hi : opt.en, 'SOCRATES_CHARACTER')}
                  className="touch-target p-4 rounded-2xl bg-slate-800 hover:bg-teal-900/50 border border-slate-700 hover:border-teal-400 text-left font-bold text-white transition-all hover:scale-[1.01]"
                >
                  {isHi ? opt.hi : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. SOCRATES - CHARACTER */}
        {currentStage === 'SOCRATES_CHARACTER' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { en: 'Crushing / Heavy Pressure', hi: 'निचोड़ने जैसा भारी दबाव (Heavy Crushing)' },
                { en: 'Sharp / Stabbing Pain', hi: 'चुभने या कांटे जैसा तेज दर्द (Sharp)' },
                { en: 'Burning Sensation / Acidity', hi: 'जलन / एसिडिटी जैसा (Burning)' },
                { en: 'Dull Aching Discomfort', hi: 'धीमा भारी दर्द (Dull Aching)' },
                { en: 'Throbbing / Pulsating', hi: 'धड़कने या टीस मारने वाला दर्द' },
                { en: 'Cramping / Colicky Pain', hi: 'मरोड़ या ऐंठन जैसा दर्द (Cramping)' },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSocratesAnswer('character', isHi ? opt.hi : opt.en, 'SOCRATES_RADIATION')}
                  className="touch-target p-4 rounded-2xl bg-slate-800 hover:bg-teal-900/50 border border-slate-700 hover:border-teal-400 text-left font-bold text-white transition-all hover:scale-[1.01]"
                >
                  {isHi ? opt.hi : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. SOCRATES - RADIATION */}
        {currentStage === 'SOCRATES_RADIATION' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { en: 'Spreads to Left Arm & Jaw', hi: 'बाएं हाथ और जबड़े में फैलता है (Left arm/jaw)' },
                { en: 'Spreads to Back & Shoulder', hi: 'पीठ और कंधे की तरफ जाता है' },
                { en: 'Spreads down the Leg', hi: 'पैर की तरफ नीचे उतरता है' },
                { en: 'Does not spread (Localized)', hi: 'कहीं नहीं फैलता (एक ही जगह रहता है)' },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSocratesAnswer('radiation', isHi ? opt.hi : opt.en, 'SOCRATES_ASSOCIATIONS')}
                  className="touch-target p-4 rounded-2xl bg-slate-800 hover:bg-teal-900/50 border border-slate-700 hover:border-teal-400 text-left font-bold text-white transition-all hover:scale-[1.01]"
                >
                  {isHi ? opt.hi : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 6. SOCRATES - ASSOCIATIONS (Multi-select) */}
        {currentStage === 'SOCRATES_ASSOCIATIONS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { en: 'Profuse Sweating', hi: 'अधिक पसीना आना (Sweating)' },
                { en: 'Shortness of Breath', hi: 'सांस फूलना (Breathlessness)' },
                { en: 'Nausea / Vomiting', hi: 'उल्टी या जी मिचलाना (Nausea)' },
                { en: 'Dizziness / Lightheadedness', hi: 'चक्कर आना / कमजोरी' },
                { en: 'Fever / Chills', hi: 'बुखार / कंपकंपी' },
                { en: 'Morning Joint Stiffness', hi: 'सुबह जोड़ों में जकड़न' },
              ].map((opt, i) => {
                const isChecked = patient.clinicalHistory.socrates.associations?.includes(isHi ? opt.hi : opt.en);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const current = patient.clinicalHistory.socrates.associations || [];
                      const val = isHi ? opt.hi : opt.en;
                      const updated = isChecked ? current.filter(x => x !== val) : [...current, val];
                      updateSocrates({ associations: updated });
                      checkClinicalRedFlags(updated.join(' '));
                    }}
                    className={`touch-target p-4 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                      isChecked
                        ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-md ring-2 ring-teal-300'
                        : 'bg-slate-800 text-white border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    <span>{isHi ? opt.hi : opt.en}</span>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isChecked ? 'bg-slate-950 text-teal-400' : 'border border-slate-600'}`}>
                      {isChecked && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStage('SOCRATES_TIMECOURSE')}
                className="touch-target px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center gap-2"
              >
                <span>आगे बढ़ें (Next)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 7. SOCRATES - TIME COURSE & EXACERBATING */}
        {currentStage === 'SOCRATES_TIMECOURSE' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { en: 'Continuous & progressively worsening', hi: 'लगातार बनी हुई है और बढ़ रही है' },
                { en: 'Comes and goes in episodes', hi: 'रुक-रुक कर आती-जाती है (Episodic)' },
                { en: 'Constant and steady', hi: 'एक जैसी बनी रहती है' },
                { en: 'Only during walking / exertion', hi: 'सिर्फ चलने-फिरने या मेहनत पर होती है' },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSocratesAnswer('timeCourse', isHi ? opt.hi : opt.en, 'SOCRATES_EXACERBATING')}
                  className="touch-target p-4 rounded-2xl bg-slate-800 hover:bg-teal-900/50 border border-slate-700 hover:border-teal-400 text-left font-bold text-white transition-all hover:scale-[1.01]"
                >
                  {isHi ? opt.hi : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStage === 'SOCRATES_EXACERBATING' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { en: 'Aggravated by exertion, relieved by rest', hi: 'मेहनत से बढ़ती है, आराम से घटती है' },
                { en: 'Aggravated after food / spicy meals', hi: 'मसालेदार खाने के बाद बढ़ती है' },
                { en: 'Relieved by warm oil massage / compress', hi: 'गर्म तेल मालिश या सिकाई से आराम मिलता है' },
                { en: 'No change with anything', hi: 'किसी भी चीज से कोई फर्क नहीं पड़ता' },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSocratesAnswer('exacerbatingRelieving', isHi ? opt.hi : opt.en, 'SOCRATES_SEVERITY')}
                  className="touch-target p-4 rounded-2xl bg-slate-800 hover:bg-teal-900/50 border border-slate-700 hover:border-teal-400 text-left font-bold text-white transition-all hover:scale-[1.01]"
                >
                  {isHi ? opt.hi : opt.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 8. SOCRATES - SEVERITY (1-10 Touch Scale) */}
        {currentStage === 'SOCRATES_SEVERITY' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { score: 2, labelEn: '1-3 Mild', labelHi: '1-3 हल्का दर्द', emoji: '😊', color: 'border-green-500/40 hover:bg-green-950/40 text-green-300' },
                { score: 5, labelEn: '4-6 Moderate', labelHi: '4-6 मध्यम कष्टदायक', emoji: '😐', color: 'border-yellow-500/40 hover:bg-yellow-950/40 text-yellow-300' },
                { score: 8, labelEn: '7-8 Severe', labelHi: '7-8 गंभीर दर्द', emoji: '😣', color: 'border-orange-500/40 hover:bg-orange-950/40 text-orange-300' },
                { score: 10, labelEn: '9-10 Emergency', labelHi: '9-10 असहनीय / आपातकाल', emoji: '😫', color: 'border-red-500/60 hover:bg-red-950/60 text-red-300' },
              ].map((scale, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSocratesAnswer('severity', scale.score, 'PAST_HISTORY')}
                  className={`touch-target p-5 rounded-2xl border text-center transition-all hover:scale-105 shadow-lg ${scale.color} bg-slate-800`}
                >
                  <span className="text-4xl block mb-2">{scale.emoji}</span>
                  <div className="text-base font-extrabold text-white">{isHi ? scale.labelHi : scale.labelEn}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 9. PAST MEDICAL HISTORY */}
        {currentStage === 'PAST_HISTORY' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAST_MEDICAL_OPTIONS.map((item, idx) => {
                const label = isHi ? item.hi : item.en;
                const isSelected = patient.clinicalHistory.pastMedicalHistory.includes(label);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => togglePastHistory(label)}
                    className={`touch-target p-4 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-md ring-2 ring-teal-300'
                        : 'bg-slate-800 text-white border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    <span>{label}</span>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? 'bg-slate-950 text-teal-400' : 'border border-slate-600'}`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStage('DRUG_ALLERGIES')}
                className="touch-target px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center gap-2"
              >
                <span>आगे बढ़ें (Next: Allergies)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 10. DRUG ALLERGIES */}
        {currentStage === 'DRUG_ALLERGIES' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMON_ALLERGIES.map((item, idx) => {
                const label = isHi ? item.hi : item.en;
                const isSelected = patient.clinicalHistory.drugAllergies.includes(label);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleAllergy(label)}
                    className={`touch-target p-4 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-md ring-2 ring-teal-300'
                        : 'bg-slate-800 text-white border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    <span>{label}</span>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? 'bg-slate-950 text-teal-400' : 'border border-slate-600'}`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStage(patient.ayushMode ? 'AYUSH_PARIKSHA' : 'ROS_CHECKLIST')}
                className="touch-target px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center gap-2"
              >
                <span>आगे बढ़ें (Next)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 11. AYUSH PARIKSHA MODE */}
        {currentStage === 'AYUSH_PARIKSHA' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-center gap-3">
              <Flame className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <span className="font-bold">आयुष दशविध परीक्षा मोड (AYUSH Pariksha Mode Active):</span>
                <p className="text-slate-300 text-xs mt-0.5">
                  प्रकृति (Constitution), अग्नि (Digestive fire), एवं कोष्ठ (Bowel motility) का मूल्यांकन
                </p>
              </div>
            </div>

            {AYUSH_QUESTIONS.map((q) => (
              <div key={q.key} className="space-y-2 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-white text-base">
                  {isHi ? q.titleHi : q.titleEn}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt, i) => {
                    const isSelected = patient.clinicalHistory.ayushAssessment?.[q.key] === opt.value;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => updateAyushAssessment({ [q.key]: opt.value })}
                        className={`touch-target p-3.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-300 shadow-md ring-2 ring-amber-300'
                            : 'bg-slate-855 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="text-sm font-bold">{isHi ? opt.labelHi : opt.labelEn}</div>
                        <div className={`text-[11px] ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                          {isHi ? opt.descHi : opt.descEn}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStage('ROS_CHECKLIST')}
                className="touch-target px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center gap-2"
              >
                <span>आगे बढ़ें (Next: Systems Review)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* 12. REVIEW OF SYSTEMS (ROS) CHECKLIST */}
        {currentStage === 'ROS_CHECKLIST' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REVIEW_OF_SYSTEMS_ITEMS.map((item) => {
                const label = isHi ? item.labelHi : item.labelEn;
                const isSelected = patient.clinicalHistory.reviewOfSystems.includes(label);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleRosItem(label)}
                    className={`touch-target p-4 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-md ring-2 ring-teal-300'
                        : 'bg-slate-800 text-white border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    <span>{label}</span>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? 'bg-slate-950 text-teal-400' : 'border border-slate-600'}`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setCurrentStage('CHIEF_COMPLAINT')}
                className="touch-target px-4 py-2.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-xl flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>शुरुआत से देखें</span>
              </button>

              <button
                type="button"
                onClick={proceedToNextScreen}
                className="touch-target px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 text-slate-950 font-extrabold text-base sm:text-lg rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
              >
                <span>संवाद पूर्ण • दस्तावेज़ स्कैन पर जाएं (Proceed to Document Scan)</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
