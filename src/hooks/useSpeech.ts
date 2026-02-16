'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSpeechReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSpeaking: boolean;
  startListening: () => void;
  stopListening: () => void;
  /** Must be called from a click/tap handler on iOS */
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isTTSSupported: boolean;
  isSTTSupported: boolean;
  isSupported: boolean;
  speakingIndex: number | null;
  /** true on iOS/iPadOS Safari where TTS requires user gesture per call */
  requiresGesture: boolean;
}

export function useSpeech(): UseSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTTSSupported, setIsTTSSupported] = useState(false);
  const [isSTTSupported, setIsSTTSupported] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const [requiresGesture, setRequiresGesture] = useState(false);

  useEffect(() => {
    // Detect iOS/iPadOS — these require speak() in direct user gesture
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setRequiresGesture(isIOS);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SR) setIsSTTSupported(true);
    if (window.speechSynthesis) {
      setIsTTSSupported(true);
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;

    // Cancel any active speech first
    synthRef.current.cancel();

    // Small delay after cancel to avoid iOS silent bug
    setTimeout(() => {
      if (!synthRef.current) return;

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = voicesRef.current.length > 0 ? voicesRef.current : synthRef.current.getVoices();
      const preferred = voices.find(v => v.name.includes('Samantha'))
        ?? voices.find(v => v.name.includes('Karen') && v.lang.startsWith('en'))
        ?? voices.find(v => v.name.includes('Natural'))
        ?? voices.find(v => v.name.includes('Google US'))
        ?? voices.find(v => v.lang.startsWith('en') && v.localService);
      if (preferred) utterance.voice = preferred;
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        resumeTimerRef.current = setInterval(() => {
          synthRef.current?.resume();
        }, 5000);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingIndex(null);
        if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
      };

      utterance.onerror = (event) => {
        if (event.error !== 'interrupted' && event.error !== 'canceled') {
          console.error('TTS error:', event.error);
        }
        setIsSpeaking(false);
        setSpeakingIndex(null);
        if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
      };

      synthRef.current.speak(utterance);
    }, 50);
  }, []);

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final) setTranscript(final);
      setInterimTranscript(interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
    setSpeakingIndex(null);
    if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isTTSSupported,
    isSTTSupported,
    isSupported: isTTSSupported || isSTTSupported,
    speakingIndex,
    requiresGesture,
  };
}
