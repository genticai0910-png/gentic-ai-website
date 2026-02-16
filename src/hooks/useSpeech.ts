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
  isTTSSupported: boolean;
  isSTTSupported: boolean;
  /** @deprecated Use isTTSSupported || isSTTSupported */
  isSupported: boolean;
  /** Call on first user tap to unlock iOS audio */
  unlockAudio: () => void;
}

export function useSpeech(): UseSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTTSSupported, setIsTTSSupported] = useState(false);
  const [isSTTSupported, setIsSTTSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const audioUnlockedRef = useRef(false);
  const pendingTextRef = useRef<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;

    // STT: Chrome (desktop+Android), Edge — NOT iOS Safari
    if (SR) {
      setIsSTTSupported(true);
    }

    // TTS: Supported on iOS Safari, Chrome, Edge, Firefox
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

  // iOS requires the first speechSynthesis.speak() to happen inside a user gesture.
  // Call this on the first tap/click in the voice modal to "unlock" the audio context.
  const unlockAudio = useCallback(() => {
    if (audioUnlockedRef.current) return;
    if (!synthRef.current) return;

    // Speak a silent utterance to unlock the audio pipeline
    const silent = new SpeechSynthesisUtterance('');
    silent.volume = 0;
    silent.lang = 'en-US';
    synthRef.current.speak(silent);
    audioUnlockedRef.current = true;

    // If there's a pending TTS queued before unlock, play it now
    if (pendingTextRef.current) {
      const text = pendingTextRef.current;
      pendingTextRef.current = null;
      // Small delay to let the silent utterance finish
      setTimeout(() => speakInternal(text), 100);
    }
  }, []);

  const speakInternal = useCallback((text: string) => {
    if (!synthRef.current) return;

    // On iOS, cancel() immediately before speak() can cause silence.
    // Only cancel if already speaking.
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = voicesRef.current.length > 0 ? voicesRef.current : synthRef.current.getVoices();

    // Mobile-friendly voice selection: prefer compact/enhanced voices
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
      // iOS pauses long utterances after ~15s — resume timer keeps it going
      resumeTimerRef.current = setInterval(() => {
        synthRef.current?.resume();
      }, 5000);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
    };

    utterance.onerror = (event) => {
      // 'interrupted' and 'canceled' are not real errors — ignore them
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('TTS error:', event.error);
      }
      setIsSpeaking(false);
      if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
    };

    synthRef.current.speak(utterance);
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;

    // If audio hasn't been unlocked yet (no user gesture), queue it
    if (!audioUnlockedRef.current) {
      pendingTextRef.current = text;
      return;
    }

    speakInternal(text);
  }, [speakInternal]);

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SR) return;

    // Unlock audio on user gesture (mic tap counts)
    if (!audioUnlockedRef.current && synthRef.current) {
      const silent = new SpeechSynthesisUtterance('');
      silent.volume = 0;
      synthRef.current.speak(silent);
      audioUnlockedRef.current = true;
    }

    const recognition = new SR();
    recognition.continuous = false; // false is more reliable on mobile
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
    unlockAudio,
  };
}
