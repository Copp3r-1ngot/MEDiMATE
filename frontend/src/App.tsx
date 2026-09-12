/**
 * @file App.tsx
 * @description Root Application Shell for MEDiMATE.
 * Coordinates the 5-screen intake flow, header, stepper, and background ambiance.
 */

import React from 'react';
import { PatientProvider, usePatient } from './context/PatientContext';
import { Header } from './components/layout/Header';
import { StepProgress } from './components/layout/StepProgress';
import { IdentifyScreen } from './components/identify/IdentifyScreen';
import { ConverseScreen } from './components/converse/ConverseScreen';
import { ScanScreen } from './components/scan/ScanScreen';
import { SummarizeScreen } from './components/summarize/SummarizeScreen';
import { ConsultScreen } from './components/consult/ConsultScreen';

const ScreenRouter: React.FC = () => {
  const { currentScreen } = usePatient();

  switch (currentScreen) {
    case 1:
      return <IdentifyScreen />;
    case 2:
      return <ConverseScreen />;
    case 3:
      return <ScanScreen />;
    case 4:
      return <SummarizeScreen />;
    case 5:
      return <ConsultScreen />;
    default:
      return <IdentifyScreen />;
  }
};

export const App: React.FC = () => {
  return (
    <PatientProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500 selection:text-slate-950 relative overflow-hidden">
        
        {/* Subtle Background Glow Spheres */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-subtle"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Top Header */}
        <Header />

        {/* Stepper Progression */}
        <StepProgress />

        {/* Main Kiosk Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <ScreenRouter />
        </main>

        {/* Kiosk Footer */}
        <footer className="border-t border-slate-850 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-teal-400">MEDiMATE</span>
              <span>• Patient Case-Taking Software (v0.1 Prototype)</span>
            </div>
            <div className="text-slate-400">
              Smart India Hackathon #26047 • Ministry of Ayush / AIIA
            </div>
          </div>
        </footer>

      </div>
    </PatientProvider>
  );
};

export default App;
