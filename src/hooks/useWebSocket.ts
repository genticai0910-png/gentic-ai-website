'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface WSMessage {
  type: 'start' | 'message' | 'end';
  text?: string;
  sessionId: string;
}

export interface WSResponse {
  type: 'greeting' | 'response' | 'booking_confirm' | 'error';
  text: string;
  sessionId?: string;
  metadata?: {
    tierMatch?: string;
    appointmentBooked?: boolean;
  };
  appointmentTime?: string;
}

function generateSessionId(): string {
  return `gs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<WSResponse | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  const connect = useCallback((metadata?: Record<string, string>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'wss://api.gentic.pro/ws';
    const newSessionId = generateSessionId();
    sessionIdRef.current = newSessionId;
    setSessionId(newSessionId);
    try {
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        setIsConnected(true);
        ws.send(JSON.stringify({ type: 'start', sessionId: newSessionId, ...metadata }));
      };
      ws.onmessage = (event: MessageEvent) => {
        try {
          const data: WSResponse = JSON.parse(event.data as string);
          setLastResponse(data);
        } catch { /* ignore malformed */ }
      };
      ws.onclose = () => setIsConnected(false);
      ws.onerror = () => setIsConnected(false);
      wsRef.current = ws;
    } catch {
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current && sessionIdRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'end', sessionId: sessionIdRef.current }));
      }
      wsRef.current.close();
      wsRef.current = null;
      sessionIdRef.current = null;
      setSessionId(null);
      setIsConnected(false);
      setLastResponse(null);
    }
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && sessionIdRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'message', text, sessionId: sessionIdRef.current }));
    }
  }, []);

  useEffect(() => {
    return () => { wsRef.current?.close(); };
  }, []);

  return { isConnected, sessionId, connect, disconnect, sendMessage, lastResponse };
}
