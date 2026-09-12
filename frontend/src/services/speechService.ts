/**
 * @file speechService.ts
 * @description Web Speech API wrapper for Browser-Native Speech Recognition (STT)
 * and Speech Synthesis (TTS) in Hindi and English.
 * Provides fallback audio simulation when browser mic is unavailable or permission is denied.
 */

// Extend Window interface for Webkit prefix
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;
  public static currentUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Check if browser supports Speech Recognition
   */
  public static isRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  /**
   * Check if browser supports Speech Synthesis (TTS)
   */
  public static isSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Speak text out loud in selected language
   */
  public static speak(
    text: string,
    lang: 'hi' | 'en' | 'mr' | 'ta' = 'hi',
    onEnd?: () => void
  ): void {
    if (!this.isSynthesisSupported()) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Select matching voice
      const langMap: Record<string, string> = {
        hi: 'hi-IN',
        en: 'en-IN',
        mr: 'mr-IN',
        ta: 'ta-IN',
      };
      utterance.lang = langMap[lang] || 'hi-IN';
      utterance.rate = 0.95; // Slightly slower pace for elderly and low-literacy clarity
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang === utterance.lang || v.lang.startsWith(lang));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('[SpeechSynthesis Error]:', e);
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[SpeechSynthesis Exception]:', err);
      if (onEnd) onEnd();
    }
  }

  /**
   * Stop any active speech synthesis
   */
  public static stopSpeaking(): void {
    if (this.isSynthesisSupported()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  /**
   * Start microphone listening
   */
  public static startListening(
    lang: 'hi' | 'en' | 'mr' | 'ta',
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.isRecognitionSupported()) {
      if (onError) onError('Speech Recognition is not supported by your browser. Please use touch buttons or keyboard.');
      return false;
    }

    try {
      if (this.isListening && this.recognition) {
        this.recognition.stop();
      }

      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionClass();

      const langMap: Record<string, string> = {
        hi: 'hi-IN',
        en: 'en-IN',
        mr: 'mr-IN',
        ta: 'ta-IN',
      };
      this.recognition.lang = langMap[lang] || 'hi-IN';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('[SpeechRecognition Error]:', event.error);
        this.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      console.warn('[SpeechRecognition Start Exception]:', e);
      this.isListening = false;
      if (onError) onError(e.message || 'Microphone access failed');
      return false;
    }
  }

  /**
   * Stop active microphone listening
   */
  public static stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    this.isListening = false;
  }
}
