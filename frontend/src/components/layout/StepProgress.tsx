/**
 * @file StepProgress.tsx
 * @description Accessible 5-Step Kiosk Progression Indicator.
 * Enables patients and evaluators to see current intake progress and jump between steps.
 */

import React from 'react';
import { 
  UserCheck, 
  MessageSquareHeart, 
  ScanLine, 
  FileText, 
  Stethoscope, 
  CheckCircle2 
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';

export const StepProgress: React.FC = () => {
  const { currentScreen, setCurrentScreen } = usePatient();

  const steps = [
    {
      step: 1 as const,
      nameEn: 'Identify',
      nameHi: 'पहचान व सहमति',
      icon: UserCheck,
    },
    {
      step: 2 as const,
      nameEn: 'Converse',
      nameHi: 'स्वास्थ्य संवाद',
      icon: MessageSquareHeart,
    },
    {
      step: 3 as const,
      nameEn: 'Scan',
      nameHi: 'दस्तावेज़ स्कैन',
      icon: ScanLine,
    },
    {
      step: 4 as const,
      nameEn: 'Summarize',
      nameHi: 'क्लिनिकल सारांश',
      icon: FileText,
    },
    {
      step: 5 as const,
      nameEn: 'Consult',
      nameHi: 'डॉक्टर परामर्श',
      icon: Stethoscope,
    },
  ];

  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between overflow-x-auto gap-2 sm:gap-4 no-scrollbar py-1">
        {steps.map((item, idx) => {
          const isCurrent = currentScreen === item.step;
          const isCompleted = currentScreen > item.step;
          const Icon = item.icon;

          return (
            <React.Fragment key={item.step}>
              <button
                type="button"
                onClick={() => setCurrentScreen(item.step)}
                className={`touch-target flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-2xl transition-all flex-shrink-0 ${
                  isCurrent
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/20 ring-2 ring-teal-300'
                    : isCompleted
                    ? 'bg-slate-800/90 text-teal-300 border border-teal-500/30 hover:bg-slate-800'
                    : 'bg-slate-850/60 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isCurrent
                    ? 'bg-slate-950 text-teal-400'
                    : isCompleted
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="text-left">
                  <div className="text-xs sm:text-sm font-semibold leading-tight">
                    {item.nameEn}
                  </div>
                  <div className={`text-[10px] leading-tight ${isCurrent ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                    {item.nameHi}
                  </div>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div className={`hidden md:block flex-1 h-[2px] rounded ${
                  isCompleted ? 'bg-teal-500/40' : 'bg-slate-800'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
