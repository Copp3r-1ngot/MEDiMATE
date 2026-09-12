/**
 * @file IdentifyScreen.tsx
 * @description Screen 1: Patient Identification, Language Choice, ABHA verification, and Granular Consent.
 */

import React, { useState } from 'react';
import { 
  Languages, 
  CreditCard, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  FileCheck
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { AudioSpeaker } from '../common/AudioSpeaker';
import { DEMO_PRESETS } from '../../data/demoPresets';
import { SupportedLanguage } from '../../types/patient';
import { ApiService } from '../../services/apiService';

export const IdentifyScreen: React.FC = () => {
  const { 
    patient, 
    setPatient, 
    setLanguage, 
    setConsent, 
    setCurrentScreen, 
    speakPrompt, 
    loadDemoPreset 
  } = usePatient();

  const [isVerifyingAbha, setIsVerifyingAbha] = useState<boolean>(false);
  const [abhaVerified, setAbhaVerified] = useState<boolean>(true);
  const [abhaInput, setAbhaInput] = useState<string>(patient.abhaId || '91-8472-9103-4821');

  // Granular consent checkboxes
  const [consentHistory, setConsentHistory] = useState<boolean>(patient.consent.clinicalHistory);
  const [consentOcr, setConsentOcr] = useState<boolean>(patient.consent.ocrProcessing);
  const [consentAbha, setConsentAbha] = useState<boolean>(patient.consent.abhaSync);

  const languages: Array<{ code: SupportedLanguage; label: string; native: string; flag: string; greeting: string }> = [
    { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳', greeting: 'नमस्ते! MEDiMATE में आपका स्वागत है। अपनी भाषा चुनें।' },
    { code: 'en', label: 'English', native: 'English', flag: '🌐', greeting: 'Hello! Welcome to MEDiMATE. Please select your language.' },
    { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳', greeting: 'नमस्कार! MEDiMATE मध्ये आपले स्वागत आहे.' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', greeting: 'வணக்கம்! MEDiMATE-க்கு வரவேற்கிறோம்.' },
  ];

  const handleLanguageChange = (langCode: SupportedLanguage, greeting: string) => {
    setLanguage(langCode);
    speakPrompt(greeting, langCode);
  };

  const handleVerifyAbha = async () => {
    setIsVerifyingAbha(true);
    const res = await ApiService.verifyAbha(abhaInput);
    setIsVerifyingAbha(false);
    if (res.isValid) {
      setAbhaVerified(true);
      setPatient(prev => ({
        ...prev,
        abhaId: abhaInput,
        name: res.data?.fullName || prev.name,
      }));
    } else {
      setAbhaVerified(false);
    }
  };

  const handleProceed = () => {
    setConsent({
      clinicalHistory: consentHistory,
      ocrProcessing: consentOcr,
      abhaSync: consentAbha,
    });
    speakPrompt(
      patient.language === 'hi' 
        ? 'सहमति दर्ज हो गई है। कृपया बताएं आज आपको क्या समस्या है।'
        : 'Consent recorded. Please tell us what brings you in today.',
      patient.language
    );
    setCurrentScreen(2);
  };

  const consentText = patient.language === 'hi'
    ? 'सहमति विवरण: मैं स्वेच्छा से अपने स्वास्थ्य लक्षणों और पूर्व मेडिकल पर्चों/रिपोर्ट्स को डॉक्टर के परामर्श हेतु AI केस-टेकिंग सिस्टम में दर्ज करने और इसे मेरे आभा (ABHA) आईडी से लिंक करने की अनुमति देता/देती हूँ।'
    : 'Consent Terms: I voluntarily consent to recording my clinical symptoms and digitizing prior medical prescriptions/reports via MEDiMATE for physician pre-intake review and linking with my ABHA Health Record.';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Welcome & Voice Guidance */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-teal-500/20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>चरण 1: रोगी पहचान एवं डिजिटल सहमति (Patient Identification & Consent)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {patient.language === 'hi' ? 'नमस्ते! MEDiMATE में आपका स्वागत है' : 'Welcome to MEDiMATE Clinical Intake'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
            {patient.language === 'hi'
              ? 'डॉक्टर से मिलने से पहले, अपनी भाषा में आसानी से अपनी बीमारी के लक्षण बताएं और अपनी पुरानी पर्ची स्कैन करें।'
              : 'Before meeting your physician, easily explain your symptoms in your preferred language and digitize prior medical records.'}
          </p>
        </div>

        <AudioSpeaker 
          textToSpeak={
            patient.language === 'hi' 
              ? 'नमस्ते! MEDiMATE में आपका स्वागत है। कृपया अपनी भाषा चुनें और सहमति प्रदान करें।' 
              : 'Welcome to MEDiMATE. Please select your language and grant consent to begin.'
          } 
          size="lg" 
        />
      </div>

      {/* Quick Demo Preset Hero Box for Evaluators */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-amber-950/40 border border-teal-500/30 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-teal-300">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>परीक्षण हेतु डेमो परिदृश्य (Instant SIH Hackathon Scenarios):</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">1-Click Test Presets</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadDemoPreset(p.id)}
              className="touch-target p-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700 hover:border-teal-400 text-left transition-all hover:scale-[1.02] shadow-md group"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-xs font-bold text-white group-hover:text-teal-300">
                  {p.title.split(':')[1] || p.title}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${p.badgeColor}`}>
                  {p.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {p.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 1. Language Selection & 2. ABHA / Registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language Selection Card */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-teal-400" />
              <h2 className="text-lg font-bold text-white">
                भाषा चुनें (Select Language)
              </h2>
            </div>
            <AudioSpeaker 
              textToSpeak="कृपया अपनी पसंदीदा भाषा का चयन करें।" 
              size="sm" 
              label="Audio" 
            />
          </div>
          <p className="text-xs text-slate-400">
            आप पूरे संवाद के दौरान आवाज और स्क्रीन दोनों में अपनी चुनी हुई भाषा का उपयोग कर सकते हैं।
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {languages.map((lang) => {
              const isSelected = patient.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code, lang.greeting)}
                  className={`touch-target p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 font-bold border-teal-400 shadow-lg shadow-teal-500/30 ring-2 ring-teal-300 scale-[1.02]'
                      : 'bg-slate-800/80 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-teal-500/50'
                  }`}
                >
                  <div>
                    <div className="text-lg font-bold">{lang.native}</div>
                    <div className={`text-xs ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                      {lang.label}
                    </div>
                  </div>
                  <span className="text-2xl">{lang.flag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ABHA ID Entry & Patient Identity Card */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-400" />
              <h2 className="text-lg font-bold text-white">
                आभा पहचान (ABHA ID Verification)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setPatient(prev => ({ ...prev, isNewPatient: !prev.isNewPatient }))}
              className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-medium"
            >
              {patient.isNewPatient ? 'Switch to ABHA ID' : 'नया मरीज (New Patient)'}
            </button>
          </div>

          {!patient.isNewPatient ? (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                14-अंकों का आभा नंबर या ABHA Address दर्ज करें:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={abhaInput}
                  onChange={(e) => {
                    setAbhaInput(e.target.value);
                    setAbhaVerified(false);
                  }}
                  placeholder="91-8472-9103-4821 या username@abdm"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-base text-white font-mono focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
                <button
                  type="button"
                  onClick={handleVerifyAbha}
                  disabled={isVerifyingAbha}
                  className="touch-target px-4 py-3 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center min-w-[90px]"
                >
                  {isVerifyingAbha ? 'जांच...' : 'सत्यापित करें'}
                </button>
              </div>

              {abhaVerified && (
                <div className="p-3 bg-teal-950/60 border border-teal-500/40 rounded-xl flex items-center gap-3 text-teal-200 text-xs">
                  <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold">{patient.name}</span> ({patient.age} वर्ष, {patient.gender}) • ABHA KYC Verified
                    <div className="text-[10px] text-teal-400/80">लिंक्ड अस्पताल: AIIMS / AIIA New Delhi OPD</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-slate-300 block mb-1">मरीज का पूरा नाम (Full Name):</label>
                <input
                  type="text"
                  value={patient.name}
                  onChange={(e) => setPatient(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-teal-400 focus:outline-none"
                  placeholder="उदा. राहुल वर्मा"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">उम्र (Age):</label>
                <input
                  type="number"
                  value={patient.age}
                  onChange={(e) => setPatient(prev => ({ ...prev, age: Number(e.target.value) }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-teal-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">लिंग (Gender):</label>
                <select
                  value={patient.gender}
                  onChange={(e) => setPatient(prev => ({ ...prev, gender: e.target.value as any }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-teal-400 focus:outline-none"
                >
                  <option value="Male">पुरुष (Male)</option>
                  <option value="Female">महिला (Female)</option>
                  <option value="Other">अन्य (Other)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Granular Consent Section (Mandatory Hackathon Requirement) */}
      <div className="glass-panel p-6 sm:p-8 space-y-6 border-teal-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                डिजिटल सहमति प्रपत्र (Granular Patient Consent)
              </h2>
              <p className="text-xs text-slate-400">
                DPDP Act 2023 एवं ABDM दिशानिर्देशों के अनुरूप पारदर्शी सहमति
              </p>
            </div>
          </div>

          <AudioSpeaker textToSpeak={consentText} size="md" label="सहमति शर्तें सुनें (Listen Consent)" />
        </div>

        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {consentText}
        </div>

        {/* 3 Granular Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
            consentHistory ? 'bg-teal-950/40 border-teal-500/50 text-teal-200' : 'bg-slate-800/60 border-slate-700 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">1. क्लिनिकल हिस्ट्री</span>
              <input
                type="checkbox"
                checked={consentHistory}
                onChange={(e) => setConsentHistory(e.target.checked)}
                className="w-5 h-5 rounded text-teal-500 focus:ring-0"
              />
            </div>
            <p className="text-xs leading-normal">
              स्वास्थ्य संवाद एवं लक्षणों को डॉक्टर की पूर्व तैयारी हेतु रिकॉर्ड करने की सहमति।
            </p>
          </label>

          <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
            consentOcr ? 'bg-teal-950/40 border-teal-500/50 text-teal-200' : 'bg-slate-800/60 border-slate-700 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">2. पर्ची/दस्तावेज़ OCR</span>
              <input
                type="checkbox"
                checked={consentOcr}
                onChange={(e) => setConsentOcr(e.target.checked)}
                className="w-5 h-5 rounded text-teal-500 focus:ring-0"
              />
            </div>
            <p className="text-xs leading-normal">
              पुरानी दवाओं व जांच रिपोर्टों को डिजिटाइज़ व विश्लेषण करने की अनुमति।
            </p>
          </label>

          <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
            consentAbha ? 'bg-teal-950/40 border-teal-500/50 text-teal-200' : 'bg-slate-800/60 border-slate-700 text-slate-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">3. ABHA / HIS लिंकेज</span>
              <input
                type="checkbox"
                checked={consentAbha}
                onChange={(e) => setConsentAbha(e.target.checked)}
                className="w-5 h-5 rounded text-teal-500 focus:ring-0"
              />
            </div>
            <p className="text-xs leading-normal">
              अस्पताल के ओपीडी रजिस्टर एवं आभा हेल्थ रिकॉर्ड से सुरक्षित जोड़ने की सहमति।
            </p>
          </label>
        </div>

        {/* Large Proceed Touch Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleProceed}
            disabled={!consentHistory}
            className={`touch-target px-8 py-4 rounded-2xl font-extrabold text-base sm:text-lg flex items-center gap-3 transition-all shadow-xl ${
              consentHistory
                ? 'bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 shadow-teal-500/25 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>सहमति प्रदान करें एवं स्वास्थ्य संवाद शुरू करें (I Consent & Begin Intake)</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

    </div>
  );
};
