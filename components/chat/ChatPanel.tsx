'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { api } from '@/lib/api';

export type ChatMessage = {
  id: string;
  mentorId: string;
  memberId: string;
  senderId: string;
  senderName: string | null;
  senderRole: string;
  content: string;
  createdAt: string;
};

type ChatPanelProps = {
  mentorId: string;
  memberId: string;
  token?: string;
  currentUserId: string;
  currentUserRole: 'mentor' | 'member';
  currentUserName?: string | null;
  label?: string;
};

const formatLabel = (message: ChatMessage, currentUserId: string) => {
  if (message.senderId === currentUserId) return 'You';
  if (message.senderName) return message.senderName;
  return message.senderRole === 'mentor' ? 'Mentor' : 'Member';
};

export default function ChatPanel({
  mentorId,
  memberId,
  token,
  currentUserId,
  currentUserRole,
  currentUserName,
  label,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const canChat = Boolean(mentorId && memberId && token);

  useEffect(() => {
    if (!canChat || typeof window === 'undefined') return undefined;
    let cancelled = false;

    setLoading(true);
    setError(null);

    api
      .get(`/chat/${mentorId}/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (cancelled) return;
        setMessages(res.data ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Unable to load chat history.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [mentorId, memberId, token, canChat]);

  useEffect(() => {
    if (!canChat) return undefined;
    const wsHost = process.env.NEXT_PUBLIC_CHAT_WS_URL ?? 'ws://localhost:4000';
    const ws = new WebSocket(
      `${wsHost}/ws/chat?mentorId=${encodeURIComponent(mentorId)}&memberId=${encodeURIComponent(
        memberId,
      )}&token=${encodeURIComponent(token ?? '')}`,
    );

    ws.addEventListener('open', () => setStatus('connected'));
    ws.addEventListener('close', () => setStatus('disconnected'));
    ws.addEventListener('error', () => setStatus('disconnected'));
    ws.addEventListener('message', (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed?.type === 'message' && parsed?.data) {
          setMessages((prev) => {
            const exists = prev.some((message) => message.id === parsed.data.id);
            if (exists) return prev;
            return [...prev, parsed.data];
          });
        }
      } catch {
        // ignore
      }
    });

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [mentorId, memberId, token, canChat]);

  const activeLabel = label ?? (currentUserRole === 'mentor' ? 'Mentor chat' : 'Mentor chat');

  const sendMessage = async () => {
    if (!input.trim() || !canChat) return;
    const payload = { mentorId, memberId, content: input.trim() };
    setInput('');

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'send-message', data: payload }));
      return;
    }

    try {
      await api.post('/chat/message', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      setError('Unable to send message right now.');
    }
  };

  const subtitle = useMemo(() => {
    if (status === 'connected') return 'Live · TMBC whisper channel';
    if (status === 'connecting') return 'Connecting…';
    return 'Disconnected · messages will queue';
  }, [status]);

  return (
    <section className="space-y-3 rounded-[32px] border border-[var(--tm-mauve)]/30 bg-white/90 p-5 shadow-[0_20px_70px_rgba(199,166,199,0.2)]">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-[var(--tm-charcoal)]/60">{activeLabel}</p>
        <h3 className="mt-1 text-lg font-semibold text-[var(--tm-charcoal)]">{currentUserName ?? (currentUserRole === 'mentor' ? 'Mentor channel' : 'Mentor chat')}</h3>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tm-charcoal)]/60">{subtitle}</p>
      </div>

      <div className="h-56 space-y-3 overflow-y-auto rounded-[24px] border border-[var(--tm-charcoal)]/10 bg-[var(--tm-ivory)]/80 p-4 text-sm text-[var(--tm-charcoal)]">
        {loading && <p className="text-sm text-[var(--tm-charcoal)]/70">Loading conversation…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-[0.9rem] text-[var(--tm-charcoal)]/60">No messages yet—start the ritual.</p>
        )}
        {messages.map((message) => (
          <div key={message.id} className="space-y-1 rounded-[18px] border border-[var(--tm-charcoal)]/10 bg-white/60 px-3 py-2">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-charcoal)]/60">{formatLabel(message, currentUserId)}</p>
            <p className="text-[0.85rem] text-[var(--tm-charcoal)]/80">{message.content}</p>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-charcoal)]/50">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-[var(--tm-charcoal)]/70">{error}</p>}

      <div className="space-y-2">
        <textarea
          className="w-full rounded-[24px] border border-[var(--tm-mauve)]/40 bg-[var(--tm-ivory)]/80 px-3 py-2 text-sm text-[var(--tm-charcoal)] focus:border-[var(--tm-mauve)] focus:outline-none"
          placeholder="Send a quick mentor note"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={!canChat}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={!canChat || !input.trim()}
          className="w-full rounded-[999px] border border-[var(--tm-mauve)] bg-[var(--tm-mauve)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
        >
          Send note
        </button>
      </div>
    </section>
  );
}
