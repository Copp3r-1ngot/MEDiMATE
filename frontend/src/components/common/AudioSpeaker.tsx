/**
 * @file AudioSpeaker.tsx
 * @description Accessible audio playback button that speaks any prompt out loud
 * in Hindi or English using Web Speech API synthesis with visual audio wave animation.
 */

import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { SpeechService } from '../../services/speechService';
import { usePatient } from '../../context/PatientContext';

interface AudioSpeakerProps {
  textToSpeak: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AudioSpeaker: React.FC<AudioSpeakerProps> = ({
  textToSpeak,
  label = 'सुनें (Listen)',
  size = 'md',
  className = '',
}) => {
  const { patient, isAudioMuted } = usePatient();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAudioMuted) return;

    if (isPlaying) {
      SpeechService.stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      SpeechService.speak(textToSpeak, patient.language, () => {
        setIsPlaying(false);
      });
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  }[size];

  return (
    <button
      type="button"
      onClick={handleSpeak}
      disabled={isAudioMuted}
      title={isAudioMuted ? 'Audio muted' : 'Listen to audio prompt'}
      className={`touch-target inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ${
        isPlaying
          ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 scale-105'
          : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 hover:border-teal-400'
      } ${isAudioMuted ? 'opacity-50 cursor-not-allowed' : ''} ${sizeClasses} ${className}`}
    >
      {isPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-1 bg-slate-950 rounded-full voice-bar h-3"></span>
            <span className="w-1 bg-slate-950 rounded-full voice-bar h-4"></span>
            <span className="w-1 bg-slate-950 rounded-full voice-bar h-2"></span>
            <span className="w-1 bg-slate-950 rounded-full voice-bar h-4"></span>
          </div>
          <span className="font-semibold text-slate-950">बोल रहा है...</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-teal-400 animate-pulse" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
