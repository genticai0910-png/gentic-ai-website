"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechReturn {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

export function useSpeech(): UseSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const voicesLoadedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speakDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load and cache voices with proper async handling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    if (!synth) return;
    synthRef.current = synth;

    const loadVoices = () => {
      const voices = synth.getVoices();
      if (voices.length > 0) {
        voicesRef.current = voices;
        voicesLoadedRef.current = true;
      }
    };

    // Load immediately (works in Firefox/Safari)
    loadVoices();

    // Also listen for async load (Chrome)
    synth.addEventListener("voiceschanged", loadVoices);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsSupported(true);
    }

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      if (resumeTimerRef.current) {
        clearInterval(resumeTimerRef.current);
      }
      if (speakDebounceRef.current) {
        clearTimeout(speakDebounceRef.current);
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    const synth = synthRef.current;
    if (!synth) return;

    // Debounce rapid speak calls (prevents stuttering from rapid WS responses)
    if (speakDebounceRef.current) {
      clearTimeout(speakDebounceRef.current);
    }

    // Cancel any current speech
    synth.cancel();

    // Clear any previous resume timer immediately
    if (resumeTimerRef.current) {
      clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }

    // Brief delay after cancel to let audio buffer drain (fixes overlap glitch)
    speakDebounceRef.current = setTimeout(() => {
      speakDebounceRef.current = null;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Pick the best available voice from cached voices
      const voices = voicesLoadedRef.current
        ? voicesRef.current
        : synth.getVoices();

      if (voices.length > 0) {
        // Priority: Samantha (macOS) > any "Natural" voice > Google US > first en-US
        const preferred =
          voices.find((v) => v.name === "Samantha") ||
          voices.find(
            (v) => v.name.includes("Natural") && v.lang.startsWith("en")
          ) ||
          voices.find((v) => v.name.includes("Google US")) ||
          voices.find((v) => v.lang.startsWith("en-US")) ||
          voices.find((v) => v.lang.startsWith("en"));
        if (preferred) {
          utterance.voice = preferred;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
      };
      utterance.onerror = () => {
        // Always clear speaking state on any error (fixes stuck mic button)
        setIsSpeaking(false);
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
      };

      synth.speak(utterance);

      // Chrome workaround: TTS pauses after ~15s on long utterances.
      // Call resume() periodically, but only while actually speaking.
      // Use shorter interval (5s) for reliability, check speaking state first.
      resumeTimerRef.current = setInterval(() => {
        if (!synth.speaking) {
          if (resumeTimerRef.current) {
            clearInterval(resumeTimerRef.current);
            resumeTimerRef.current = null;
          }
          return;
        }
        if (synth.paused) {
          synth.resume();
        }
      }, 5000);
    }, 80); // 80ms debounce — long enough to drain buffer, short enough to feel instant
  }, []);

  const stopSpeaking = useCallback(() => {
    // Clear debounce first to prevent queued speech from firing
    if (speakDebounceRef.current) {
      clearTimeout(speakDebounceRef.current);
      speakDebounceRef.current = null;
    }
    if (resumeTimerRef.current) {
      clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    isSupported,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
