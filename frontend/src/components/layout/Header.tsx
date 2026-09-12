/**
 * @file Header.tsx
 * @description Global Header bar for MEDiMATE Kiosk and Doctor Workstation.
 * Features:
 * 1. MEDiMATE branding with problem statement accreditation.
 * 2. Instant Hackathon Demo Preset selector.
 * 3. AYUSH Mode toggle.
 * 4. Audio TTS toggle and Doctor Workstation view switcher.
 */

import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Stethoscope, 
  UserCircle2, 
  Flame, 
  ChevronDown
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { DEMO_PRESETS } from '../../data/demoPresets';

export const Header: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    patient, 
    setAyushMode, 
    isAudioMuted, 
    toggleAudioMute, 
    loadDemoPreset, 
    resetIntake 
  } = usePatient();

  const [isPresetMenuOpen, setIsPresetMenuOpen] = useState<boolean>(false);

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3.5">
          <button 
            type="button"
            onClick={() => setCurrentScreen(1)} 
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-teal-100 to-white bg-clip-text text-transparent">
                  MEDiMATE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  v0.1 Prototype
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                "Your health, heard clearly before you walk in."
              </p>
            </div>
          </button>

          {/* Hackathon accreditation badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>SIH #26047 • Ministry of Ayush / AIIA</span>
          </div>
        </div>

        {/* Global Controls & Tools */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* AYUSH Mode Toggle */}
          <button
            type="button"
            onClick={() => setAyushMode(!patient.ayushMode)}
            className={`touch-target flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              patient.ayushMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-amber-300 hover:border-amber-500/40'
            }`}
            title="Toggle AYUSH Dashavidha Pariksha Intake Mode"
          >
            <Flame className={`w-4 h-4 ${patient.ayushMode ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
            <span>AYUSH Mode</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
              patient.ayushMode ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-400'
            }`}>
              {patient.ayushMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Quick Demo Presets Dropdown (for Hackathon Judges) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPresetMenuOpen(!isPresetMenuOpen)}
              className="touch-target flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-gradient-to-r from-slate-800 to-slate-850 hover:bg-slate-700 text-teal-300 border border-teal-500/40 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden md:inline">Demo Presets</span>
              <span className="md:hidden">Presets</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {isPresetMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsPresetMenuOpen(false)}
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
                  🎯 Quick Demo Scenarios (Click to Load)
                </div>
                <div className="space-y-2">
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => loadDemoPreset(preset.id)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 hover:border-teal-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-teal-300">
                          {preset.title}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {preset.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Audio TTS Toggle */}
          <button
            type="button"
            onClick={toggleAudioMute}
            className={`p-2.5 rounded-xl border transition-colors ${
              isAudioMuted
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-slate-800 text-teal-400 border-slate-700 hover:border-teal-500/40'
            }`}
            title={isAudioMuted ? 'Unmute Audio Voice Prompts' : 'Mute Audio Voice Prompts'}
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Reset Intake */}
          <button
            type="button"
            onClick={resetIntake}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
            title="Reset Patient Intake & Start Fresh"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Doctor vs Patient Mode Switcher */}
          <button
            type="button"
            onClick={() => setCurrentScreen(currentScreen === 5 ? 1 : 5)}
            className={`touch-target flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md ${
              currentScreen === 5
                ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400'
                : 'bg-slate-800 text-teal-300 border border-teal-500/50 hover:bg-slate-700'
            }`}
          >
            {currentScreen === 5 ? (
              <>
                <UserCircle2 className="w-4 h-4" />
                <span>Patient Kiosk View</span>
              </>
            ) : (
              <>
                <Stethoscope className="w-4 h-4" />
                <span>Doctor OPD View</span>
              </>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
