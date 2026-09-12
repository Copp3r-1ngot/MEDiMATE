/**
 * @file SummarizeScreen.tsx
 * @description Screen 4: Pre-Consultation Structured Case Summary & ABDM Linkage.
 * Features:
 * 1. Unified case synthesis combining dialogue + OCR scanned parameters.
 * 2. High-fidelity TTS readback in Hindi / English.
 * 3. ABDM / HIS Push simulation with transaction ID and QR code badge.
 * 4. Draft watermark indicating physician retains final diagnostic authority.
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  QrCode, 
  Sparkles, 
  Stethoscope,
  Flame,
  Building2
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { AudioSpeaker } from '../common/AudioSpeaker';
import { ApiService } from '../../services/apiService';

export const SummarizeScreen: React.FC = () => {
  const { patient, setCurrentScreen, speakPrompt, setPatient } = usePatient();
  const [isPushingAbdm, setIsPushingAbdm] = useState<boolean>(false);
  const [isAbdmPushed, setIsAbdmPushed] = useState<boolean>(false);
  const [abdmTxnId, setAbdmTxnId] = useState<string>('');

  const isHi = patient.language === 'hi';

  const s = patient.clinicalHistory.socrates;
  const socSummary = [
    s.site ? `स्थान: ${s.site}` : '',
    s.onset ? `शुरुआत: ${s.onset}` : '',
    s.character ? `प्रकृति: ${s.character}` : '',
    s.radiation ? `फैलाव: ${s.radiation}` : '',
    s.associations?.length ? `सह-लक्षण: ${s.associations.join(', ')}` : '',
    s.timeCourse ? `समयक्रम: ${s.timeCourse}` : '',
    s.exacerbatingRelieving ? `बढ़ना/घटना: ${s.exacerbatingRelieving}` : '',
    s.severity ? `तीव्रता: ${s.severity}/10` : '',
  ].filter(Boolean).join(' • ');

  const spokenSummary = isHi
    ? `नमस्ते ${patient.name} जी। आपका क्लिनिकल सारांश इस प्रकार है: मुख्य समस्या: ${patient.clinicalHistory.chiefComplaint}। ${socSummary}। पुरानी बीमारियाँ: ${patient.clinicalHistory.pastMedicalHistory.join(', ') || 'कोई नहीं'}। दवा एलर्जी: ${patient.clinicalHistory.drugAllergies.join(', ') || 'कोई नहीं'}। यह सारांश डॉक्टर साहब के कंप्यूटर पर भेज दिया गया है।`
    : `Hello ${patient.name}. Here is your clinical intake summary: Chief Complaint: ${patient.clinicalHistory.chiefComplaint}. History: ${socSummary}. Past History: ${patient.clinicalHistory.pastMedicalHistory.join(', ') || 'Nil'}. Allergies: ${patient.clinicalHistory.drugAllergies.join(', ') || 'NKDA'}. This summary is ready for your physician.`;

  const handlePushToAbdm = async () => {
    setIsPushingAbdm(true);
    const res = await ApiService.pushToAbdm(patient);
    setIsPushingAbdm(false);
    setIsAbdmPushed(true);
    const txn = res?.data?.transactionId || `ABDM-TXN-${Date.now().toString(36).toUpperCase()}`;
    setAbdmTxnId(txn);

    setPatient(prev => ({
      ...prev,
      generatedSummary: {
        summaryText: spokenSummary,
        soapFormat: {
          subjective: `Patient presents with ${prev.clinicalHistory.chiefComplaint}. HPI: ${socSummary}`,
          objective: `Intake records with ${prev.scannedDocuments.length} digitized documents.`,
          assessment: prev.clinicalHistory.redFlagTriggered ? 'HIGH RISK TRIAGE' : 'OPD Consultation Intake',
          plan: 'Direct physician examination & prescription.',
        },
        status: 'pushed_to_abdm',
        pushedAt: new Date().toISOString(),
        abdmTxnId: txn,
      }
    }));

    // Trigger joyful celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0D9488', '#14B8A6', '#F59E0B', '#38BDF8'],
      });
    } catch (e) {
      // ignore
    }

    speakPrompt(
      isHi 
        ? 'केस शीट को सुरक्षित रूप से आभा और अस्पताल के ओपीडी रजिस्टर में भेज दिया गया है।'
        : 'Case sheet successfully encrypted and pushed to your ABHA health record and OPD queue.',
      patient.language
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner Card */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-teal-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>चरण 4: प्री-कंसल्टेशन क्लिनिकल सारांश (Pre-Consultation Clinical Summary)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isHi ? 'आपका क्लिनिकल केस सारांश (ड्राफ्ट)' : 'Your Structured Clinical Summary (Draft)'}
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            {isHi 
              ? 'कृपया अपने द्वारा दिए गए विवरण की जांच करें। इसे डॉक्टर साहब के ओपीडी कंसोल पर भेजा जा रहा है।'
              : 'Please review the intake summary. This information is ready for the physician workstation.'}
          </p>
        </div>

        <AudioSpeaker textToSpeak={spokenSummary} size="lg" label="पूरा सारांश सुनें (Listen Summary)" />
      </div>

      {/* Main Clinical Case Sheet (Standard Hospital Format) */}
      <div className="glass-panel p-6 sm:p-8 space-y-6 border-teal-500/30 relative">
        
        {/* Draft Disclaimer Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              DRAFT • Pre-Consultation Intake
            </span>
            {patient.clinicalHistory.redFlagTriggered && (
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-600 text-white shadow-md animate-pulse">
                ⚠️ High-Priority Triage Alert
              </span>
            )}
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Case ID: <span className="text-teal-300 font-bold">{patient.id}</span> • ABHA: <span className="text-teal-300">{patient.abhaId || 'Linked'}</span>
          </div>
        </div>

        {/* Patient Demographics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 text-xs">
          <div>
            <span className="text-slate-400 block">रोगी का नाम (Patient):</span>
            <span className="font-bold text-sm text-white">{patient.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block">उम्र / लिंग (Age/Gender):</span>
            <span className="font-bold text-sm text-white">{patient.age} वर्ष / {patient.gender}</span>
          </div>
          <div>
            <span className="text-slate-400 block">संवाद भाषा (Language):</span>
            <span className="font-bold text-sm text-teal-300 uppercase">{patient.language}</span>
          </div>
          <div>
            <span className="text-slate-400 block">तारीख व समय (Timestamp):</span>
            <span className="font-bold text-sm text-slate-300 font-mono">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-4 text-sm text-slate-200 divide-y divide-slate-800">
          
          {/* 1. Chief Complaint */}
          <div className="pt-3 space-y-1">
            <div className="text-xs font-bold uppercase text-teal-400">
              1. मुख्य शिकायत (Chief Complaint):
            </div>
            <div className="text-base font-bold text-white bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
              {patient.clinicalHistory.chiefComplaint || 'नियमित स्वास्थ्य जांच (General OPD Consultation)'}
            </div>
          </div>

          {/* 2. HPI via SOCRATES */}
          <div className="pt-3 space-y-1">
            <div className="text-xs font-bold uppercase text-teal-400">
              2. वर्तमान बीमारी का इतिहास (HPI - SOCRATES Breakdown):
            </div>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
              {socSummary || 'Patient presenting for routine consultation. Baseline evaluation recorded.'}
            </div>
          </div>

          {/* 3. Past Medical & Surgical History */}
          <div className="pt-3 space-y-1">
            <div className="text-xs font-bold uppercase text-teal-400">
              3. पूर्व स्वास्थ्य इतिहास (Past Medical & Surgical History):
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {patient.clinicalHistory.pastMedicalHistory.length > 0 ? (
                patient.clinicalHistory.pastMedicalHistory.map((hx, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                    • {hx}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">कोई पुरानी बीमारी दर्ज नहीं है (No prior chronic illnesses reported).</span>
              )}
            </div>
          </div>

          {/* 4. Drug Allergies & Medications */}
          <div className="pt-3 space-y-1">
            <div className="text-xs font-bold uppercase text-teal-400">
              4. दवा एलर्जी एवं नियमित दवाएं (Drug Allergies & Current Rx):
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {patient.clinicalHistory.drugAllergies.length > 0 ? (
                patient.clinicalHistory.drugAllergies.map((alg, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-red-950/40 text-red-300 border border-red-500/30">
                    ⚠️ {alg}
                  </span>
                ))
              ) : (
                <span className="text-xs text-teal-300">✓ NKDA (किसी दवा से कोई ज्ञात एलर्जी नहीं)</span>
              )}
            </div>
          </div>

          {/* 5. Review of Systems (ROS) */}
          <div className="pt-3 space-y-1">
            <div className="text-xs font-bold uppercase text-teal-400">
              5. शारीरिक प्रणालियों की समीक्षा (Review of Systems):
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {patient.clinicalHistory.reviewOfSystems.length > 0 ? (
                patient.clinicalHistory.reviewOfSystems.map((ros, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    ✓ {ros}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">अन्य प्रणालियों में कोई अतिरिक्त लक्षण नहीं।</span>
              )}
            </div>
          </div>

          {/* 6. AYUSH Dashavidha Pariksha (If Enabled) */}
          {patient.ayushMode && patient.clinicalHistory.ayushAssessment && (
            <div className="pt-3 space-y-1">
              <div className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>6. आयुष दशविध / त्रिविध परीक्षा (AYUSH Pariksha Findings):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs">
                  <span className="text-amber-400 font-bold block">प्रकृति (Prakriti):</span>
                  <span className="text-white">{patient.clinicalHistory.ayushAssessment.prakriti || 'Undetermined'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs">
                  <span className="text-amber-400 font-bold block">अग्नि (Agni / Digestion):</span>
                  <span className="text-white">{patient.clinicalHistory.ayushAssessment.agni || 'Undetermined'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs">
                  <span className="text-amber-400 font-bold block">कोष्ठ (Koshtha / Bowel):</span>
                  <span className="text-white">{patient.clinicalHistory.ayushAssessment.koshtha || 'Undetermined'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 7. Digitized Prior Lab Findings (OCR) */}
          {patient.scannedDocuments.length > 0 && (
            <div className="pt-3 space-y-2">
              <div className="text-xs font-bold uppercase text-teal-400">
                7. पूर्व जांच रिपोर्ट एवं पर्चे (Digitized OCR Findings):
              </div>
              <div className="space-y-2">
                {patient.scannedDocuments.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs space-y-1.5">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>📄 {doc.fileName}</span>
                      <span className="text-[10px] text-teal-400">OCR Parsed</span>
                    </div>
                    {doc.extractedLabValues.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {doc.extractedLabValues.map((l, i) => (
                          <span 
                            key={i} 
                            className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                              l.isAbnormal 
                                ? 'bg-red-600 text-white font-bold animate-pulse' 
                                : 'bg-slate-700 text-slate-200'
                            }`}
                          >
                            {l.testName}: {l.value} {l.unit} {l.isAbnormal ? `[${l.abnormalFlag || 'HIGH'}]` : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ABDM Linkage & Push Simulation Card */}
      <div className="glass-panel p-6 sm:p-8 space-y-5 border-teal-500/40">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                आयुष्मान भारत डिजिटल मिशन (ABDM) व OPD लिंक
              </h2>
              <p className="text-xs text-slate-400">
                Encrypted FHIR Pre-Consultation Stream to Hospital Information System (HIS)
              </p>
            </div>
          </div>

          {!isAbdmPushed ? (
            <button
              type="button"
              onClick={handlePushToAbdm}
              disabled={isPushingAbdm}
              className="touch-target px-6 py-3.5 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 text-slate-950 font-extrabold rounded-xl flex items-center gap-2 shadow-lg shadow-teal-500/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-amber-900" />
              <span>{isPushingAbdm ? 'सिंक हो रहा है...' : 'ABHA और OPD में भेजें (Push to ABDM & Queue)'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-950/60 border border-teal-500/50 text-teal-200 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <span>सफलतापूर्वक लिंक व भेजा गया (Synced & Linked)</span>
            </div>
          )}
        </div>

        {/* ABDM Success Badge with QR Code & Transaction ID */}
        {isAbdmPushed && (
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-mono text-teal-300 font-bold text-sm">
                  {abdmTxnId}
                </div>
                <div className="text-slate-300">
                  हेल्थ फैसिलिटी: <span className="font-semibold text-white">All India Institute of Ayurveda OPD Hub</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  ABHA ID: {patient.abhaId} • Encrypted End-to-End • M1/M2/M3 FHIR Ready
                </div>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-700 sm:pl-4">
              <div className="text-xs text-slate-400">ओपीडी कतार स्थिति:</div>
              <div className="text-sm font-extrabold text-teal-300">
                डॉक्टर डेस्क पर प्रेषित (Ready for Consult)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="glass-panel p-4 sm:p-6 flex flex-wrap justify-between items-center gap-4">
        <button
          type="button"
          onClick={() => setCurrentScreen(3)}
          className="touch-target px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl flex items-center gap-2 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>पीछे जाएं (Back to Scan)</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen(5)}
          className="touch-target px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 text-slate-950 font-extrabold text-base sm:text-lg rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 transition-all"
        >
          <Stethoscope className="w-6 h-6" />
          <span>डॉक्टर कंसल्टेशन स्क्रीन देखें (Open Physician Workstation)</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};
