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

export function VoiceModal({ isOpen, onClose, vertical }: VoiceModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [useVoice, setUseVoice] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ws = useWebSocket();
  const speech = useSpeech();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && !ws.isConnected) {
      ws.connect();
    }
    if (!isOpen && ws.isConnected) {
      ws.disconnect();
      speech.stopSpeaking();
      speech.stopListening();
      setMessages([]);
      setIsProcessing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (ws.lastResponse) {
      const response = ws.lastResponse;
      setIsProcessing(false);
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
      if (useVoice && speech.isSupported) {
        speech.speak(response.text);
      }
    }
  }, [ws.lastResponse]);

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-dark relative flex h-[600px] w-full max-w-lg flex-col overflow-hidden rounded-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{vertical.brandName} AI</h3>
              <p className="text-xs text-white/50">
                {ws.isConnected ? 'Connected' : 'Connecting...'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseVoice(!useVoice)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${useVoice ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/70'}`}
              >
                {useVoice ? 'Voice On' : 'Text Only'}
              </button>
              <button onClick={onClose} className="rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full p-4" style={{ backgroundColor: `color-mix(in srgb, var(--color-accent) 20%, transparent)` }}>
                  <svg className="h-8 w-8" style={{ color: 'var(--color-accent)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <p className="text-sm text-white/70">
                  {useVoice ? 'Tap the mic to start talking' : 'Type your message below'}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'text-white'
                      : 'bg-white/10 text-white/90'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: 'var(--color-accent)' } : undefined}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="mb-3 flex justify-start">
                <div className="flex gap-1 rounded-2xl bg-white/10 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 px-6 py-4">
            {speech.isListening && (
              <div className="mb-3 text-center text-sm text-white/60">
                {speech.interimTranscript || 'Listening...'}
              </div>
            )}

            <div className="flex items-center gap-3">
              {useVoice && speech.isSupported && (
                <button
                  onClick={handleMicToggle}
                  className={`shrink-0 rounded-full p-3 text-white transition-all ${speech.isListening ? 'mic-pulse' : 'hover:scale-105'}`}
                  style={{ backgroundColor: speech.isListening ? '#ef4444' : 'var(--color-accent)' }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}

              <form
                className="flex flex-1 items-center gap-2"
                onSubmit={e => { e.preventDefault(); handleSend(inputText); }}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:bg-white/15"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className="shrink-0 rounded-full p-2.5 text-white transition-all disabled:opacity-40"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
