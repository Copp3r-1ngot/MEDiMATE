/**
 * @file MicVoiceInput.tsx
 * @description Dual-mode Voice Input component.
 * Features:
 * 1. Web Speech API live speech recognition.
 * 2. Visual ripple and waveform animations during listening.
 * 3. Quick simulated speech chips for instant demo testing in noisy environments.
 */

import React, { useState } from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { SpeechService } from '../../services/speechService';
import { usePatient } from '../../context/PatientContext';

interface MicVoiceInputProps {
  onTranscriptFinal: (transcript: string) => void;
  placeholderText?: string;
  samplePhrases?: string[];
}

export const MicVoiceInput: React.FC<MicVoiceInputProps> = ({
  onTranscriptFinal,
  placeholderText = 'माइक दबाकर बोलें या नीचे दिए गए विकल्प चुनें...',
  samplePhrases = [],
}) => {
  const { patient } = usePatient();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const toggleListening = () => {
    setErrorMessage('');
    if (isListening) {
      SpeechService.stopListening();
      setIsListening(false);
      if (transcript) {
        onTranscriptFinal(transcript);
      }
    } else {
      setTranscript('');
      const started = SpeechService.startListening(
        patient.language,
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setIsListening(false);
            onTranscriptFinal(text);
          }
        },
        (err) => {
          setIsListening(false);
          setErrorMessage(err);
        },
        () => {
          setIsListening(false);
        }
      );
      if (started) {
        setIsListening(true);
      }
    }
  };

  const handleSimulateSpeech = (phrase: string) => {
    setTranscript(phrase);
    onTranscriptFinal(phrase);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Microphone Main Touch Button */}
      <div className="relative flex items-center justify-center">
        {isListening && (
          <div className="absolute inset-0 rounded-full bg-teal-500/30 animate-ping duration-1000"></div>
        )}
        <button
          type="button"
          onClick={toggleListening}
          className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
            isListening
              ? 'bg-red-500 text-white shadow-red-500/50 scale-110 ring-8 ring-red-500/30 animate-pulse'
              : 'bg-gradient-to-tr from-teal-600 to-teal-400 hover:from-teal-500 hover:to-teal-300 text-slate-950 shadow-teal-500/30 hover:scale-105 active:scale-95'
          }`}
        >
          {isListening ? (
            <>
              <Mic className="w-10 h-10 animate-bounce" />
              <span className="text-xs font-bold uppercase mt-1 tracking-wider">सुन रहे हैं...</span>
            </>
          ) : (
            <>
              <Mic className="w-10 h-10" />
              <span className="text-xs font-bold uppercase mt-1 tracking-wider">बोलें (Speak)</span>
            </>
          )}
        </button>
      </div>

      {/* Transcript or Status Display */}
      <div className="w-full max-w-xl text-center">
        {isListening ? (
          <div className="p-3 bg-teal-950/60 border border-teal-500/40 rounded-xl text-teal-200 text-base animate-pulse flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span>{transcript || 'कृपया स्पष्ट आवाज में बोलें (Listening...)'}</span>
          </div>
        ) : transcript ? (
          <div className="p-3 bg-slate-800 border border-teal-500/40 rounded-xl text-slate-100 text-base flex items-center justify-between gap-2">
            <span className="italic">"{transcript}"</span>
            <span className="text-xs text-teal-400 font-semibold uppercase">दर्ज हो गया (Recorded)</span>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">{placeholderText}</p>
        )}

        {errorMessage && (
          <p className="text-amber-400 text-xs mt-1">
            ⚠️ माइक कनेक्ट नहीं हुआ (Touch विकल्प से उत्तर दें): {errorMessage}
          </p>
        )}
      </div>

      {/* Quick speech preset simulation chips (essential for zero-friction hackathon testing) */}
      {samplePhrases.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl pt-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            त्वरित वाक्य (Voice Sample Shortcuts):
          </span>
          {samplePhrases.map((phrase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSimulateSpeech(phrase)}
              className="text-xs bg-slate-800 hover:bg-teal-900/60 text-slate-300 hover:text-teal-200 border border-slate-700 hover:border-teal-500/50 px-3 py-1.5 rounded-full transition-all duration-150"
            >
              🎤 "{phrase}"
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
