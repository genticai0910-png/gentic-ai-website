'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSpeechReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSpeaking: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSupported: boolean;
}

export function useSpeech(): UseSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SR && window.speechSynthesis) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
      // Load voices — may be async in some browsers
      const loadVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const startListening = useCallback(() => {
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Use cached voices (loaded via onvoiceschanged), with fresh fallback
    const voices = voicesRef.current.length > 0 ? voicesRef.current : synthRef.current.getVoices();
    const preferred = voices.find(v => v.name.includes('Samantha'))
      ?? voices.find(v => v.name.includes('Natural'))
      ?? voices.find(v => v.name.includes('Google US'))
      ?? voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      resumeTimerRef.current = setInterval(() => {
        synthRef.current?.resume();
      }, 10000);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
    };

    utterance.onerror = (event) => {
      console.error('TTS error:', event.error);
      setIsSpeaking(false);
      if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
    };

    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
    if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
  }, []);

  return { isListening, transcript, interimTranscript, isSpeaking, startListening, stopListening, speak, stopSpeaking, isSupported };
}
