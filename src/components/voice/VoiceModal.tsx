'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useSpeech } from '@/hooks/useSpeech';
import type { Vertical } from '@/types/Vertical';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vertical: Vertical;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function SpeakerButton({ onClick, isPlaying }: { onClick: () => void; isPlaying: boolean }) {
  return (
    <button
      onClick={onClick}
      className="mt-1.5 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors active:scale-95"
      style={{ color: isPlaying ? 'var(--color-accent)' : 'rgba(255,255,255,0.5)', backgroundColor: isPlaying ? 'rgba(255,255,255,0.1)' : 'transparent' }}
      aria-label={isPlaying ? 'Stop speaking' : 'Play audio'}
    >
      {isPlaying ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
          </svg>
          <span>Stop</span>
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.383 3.07A1 1 0 0 1 12 4v16a1 1 0 0 1-1.617.786L4.72 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2.72l5.663-4.786a1 1 0 0 1 1 .07zM15.5 8.5a4.5 4.5 0 0 1 0 7" />
            <path d="M18 5a8.5 8.5 0 0 1 0 14" fillOpacity="0.3" />
          </svg>
          <span>Listen</span>
        </>
      )}
    </button>
  );
}

export function VoiceModal({ isOpen, onClose, vertical }: VoiceModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useVoice, setUseVoice] = useState(true);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ws = useWebSocket();
  const speech = useSpeech();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && !ws.isConnected) {
      // Pass UTM params to WebSocket for voice conversation attribution
      const params = new URLSearchParams(window.location.search);
      const utmMeta: Record<string, string> = {};
      for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
        const val = params.get(key);
        if (val) utmMeta[key] = val;
      }
      ws.connect(Object.keys(utmMeta).length > 0 ? utmMeta : undefined);
    }
    if (!isOpen && ws.isConnected) {
      ws.disconnect();
      speech.stopSpeaking();
      speech.stopListening();
      setMessages([]);
      setIsProcessing(false);
      setPlayingIndex(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (ws.lastResponse) {
      const response = ws.lastResponse;
      setIsProcessing(false);
      const newIndex = messages.length;
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
      if (useVoice && speech.isTTSSupported && !speech.requiresGesture) {
        setPlayingIndex(newIndex);
        speech.speak(response.text);
      }
    }
  }, [ws.lastResponse]);

  useEffect(() => {
    if (!speech.isSpeaking && playingIndex !== null) {
      setPlayingIndex(null);
    }
  }, [speech.isSpeaking, playingIndex]);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (speech.transcript && !speech.isListening) {
      handleSend(speech.transcript);
    }
  }, [speech.isListening, speech.transcript]);

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isProcessing) return;
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    ws.sendMessage(trimmed);
    setIsProcessing(true);
    setInputText('');
  }, [ws, isProcessing]);

  const handleMicToggle = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.stopSpeaking();
      speech.startListening();
    }
  }, [speech]);

  const handlePlayMessage = useCallback((index: number, text: string) => {
    if (playingIndex === index && speech.isSpeaking) {
      speech.stopSpeaking();
      setPlayingIndex(null);
    } else {
      speech.stopSpeaking();
      setPlayingIndex(index);
      speech.speak(text);
    }
  }, [speech, playingIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop — full screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:flex md:items-center md:justify-center md:p-6"
        onClick={onClose}
      >
        {/* Modal container:
            Mobile: full screen, slide up from bottom
            Desktop: centered card, max-w-lg */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={[
            'relative flex flex-col overflow-hidden bg-[#0a0a0f]',
            // Mobile: full screen with safe area
            'h-[100dvh] w-full',
            // Desktop: centered modal
            'md:h-[min(700px,85vh)] md:max-w-lg md:rounded-2xl md:border md:border-white/10',
          ].join(' ')}
          onClick={e => e.stopPropagation()}
        >
          {/* Header — safe area top */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6 md:py-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--color-accent)' }}>
                <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold leading-tight text-white">Alex</h3>
                <p className="text-xs text-white/40">
                  {ws.isConnected
                    ? `${vertical.brandName} AI Advisor`
                    : 'Connecting...'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setUseVoice(!useVoice); if (useVoice) speech.stopSpeaking(); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors active:scale-95 ${useVoice ? 'bg-white/15 text-white' : 'text-white/40'}`}
              >
                {useVoice ? 'Voice On' : 'Text Only'}
              </button>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors active:bg-white/10 active:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages — scrollable, fills remaining space */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: `color-mix(in srgb, var(--color-accent) 15%, transparent)` }}>
                  <svg className="h-8 w-8" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h4 className="mb-2 text-base font-medium text-white">Chat with Alex</h4>
                <p className="text-sm leading-relaxed text-white/50">
                  {speech.isSTTSupported
                    ? 'Tap the mic or type a message to get started'
                    : speech.requiresGesture
                      ? 'Type a message — tap Listen to hear Alex respond'
                      : 'Type a message — Alex will respond with voice'}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
                    A
                  </div>
                )}
                <div className={msg.role === 'user' ? 'max-w-[80%]' : 'max-w-[80%]'}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-md text-white'
                        : 'rounded-bl-md bg-white/[0.08] text-white/90'
                    }`}
                    style={msg.role === 'user' ? { backgroundColor: 'var(--color-accent)' } : undefined}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'assistant' && useVoice && speech.isTTSSupported && (
                    <SpeakerButton
                      onClick={() => handlePlayMessage(i, msg.content)}
                      isPlaying={playingIndex === i && speech.isSpeaking}
                    />
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="mb-4 flex justify-start">
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
                  A
                </div>
                <div className="flex gap-1.5 rounded-2xl rounded-bl-md bg-white/[0.08] px-5 py-4">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/30" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/30" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/30" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar — fixed at bottom with safe area */}
          <div className="shrink-0 border-t border-white/10 bg-[#0a0a0f] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:px-6 md:py-4">
            {speech.isListening && (
              <div className="mb-3 flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                </span>
                <span className="text-sm text-white/60">
                  {speech.interimTranscript || 'Listening...'}
                </span>
              </div>
            )}

            <div className="flex items-end gap-2">
              {speech.isSTTSupported && (
                <button
                  onClick={handleMicToggle}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all active:scale-90"
                  style={{ backgroundColor: speech.isListening ? '#ef4444' : 'var(--color-accent)' }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}

              <form
                className="flex flex-1 items-end gap-2"
                onSubmit={e => { e.preventDefault(); handleSend(inputText); inputRef.current?.focus(); }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Message Alex..."
                  enterKeyHint="send"
                  autoComplete="off"
                  className="h-11 flex-1 rounded-full bg-white/10 px-4 text-[15px] text-white placeholder-white/30 outline-none transition-colors focus:bg-white/15 focus:ring-1 focus:ring-white/20"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all active:scale-90 disabled:opacity-30"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
