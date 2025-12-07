'use client';

import { useEffect, useMemo, useState } from 'react';
import { Send, MessageCircle, SquarePen, User2 } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth';

type ChatThread = {
  id: string;
  title: string;
  type: 'GENERAL' | 'MODULE_REVIEW' | 'REGISTRY_REVIEW';
  unreadCount: number;
  lastMessageAt: string;
  linkedTaskId?: string;
};

type ChatMessage = {
  id: string;
  threadId: string;
  author: 'member' | 'mentor';
  text: string;
  timestamp: string;
  read: boolean;
};

export default function ChatPage() {
  const session = loadSession();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const mentorName = session?.payload?.mentorName || 'Your mentor';

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await api.get('/api/chat/threads');
        const inbox = response.data ?? [];
        setThreads(inbox);
        setActiveThread(inbox[0] ?? null);
      } catch (error) {
        console.error('Chat thread placeholder error', error);
      }
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    if (!activeThread) return;
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/api/chat/messages/${activeThread.id}`);
        setMessages(response.data ?? []);
      } catch (error) {
        console.error('Chat message placeholder error', error);
      }
    };

    fetchMessages();
  }, [activeThread]);

  const groupedThreads = useMemo(() => {
    return {
      REGISTRY_REVIEW: threads.filter((thread) => thread.type === 'REGISTRY_REVIEW'),
      MODULE_REVIEW: threads.filter((thread) => thread.type === 'MODULE_REVIEW'),
      GENERAL: threads.filter((thread) => thread.type === 'GENERAL'),
    };
  }, [threads]);

  const handleSend = async () => {
    if (!draft.trim() || !activeThread) return;
    try {
      const response = await api.post('/api/chat/messages', {
        threadId: activeThread.id,
        text: draft,
      });
      setMessages((prev) => [...prev, response.data]);
      setDraft('');
    } catch (error) {
      console.error('Chat send placeholder error', error);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 px-6 py-10 md:px-10">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Mentor Chat</p>
        <h1 className="text-3xl text-tmCharcoal">{mentorName}</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Keep everything in one warm thread—photos, approvals, pep talks. // TODO: Connect to realtime typing indicator
        </p>
      </header>

      <section className="flex flex-1 flex-col gap-4 lg:flex-row">
        <aside className="w-full rounded-3xl border border-white/70 bg-white/90 p-4 shadow-soft lg:w-1/3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
            <MessageCircle className="h-4 w-4 text-tmMauve" />
            Threads
          </div>
          <p className="mt-1 text-xs text-tmCharcoal/60">// TODO: group by type + show read state from API</p>
          <div className="mt-4 space-y-4">
            {(['REGISTRY_REVIEW', 'MODULE_REVIEW', 'GENERAL'] as const).map((type) => (
              <div key={type}>
                <p className="text-xs uppercase tracking-[0.4em] text-tmCharcoal/60">
                  {type.replace('_', ' ')}
                </p>
                <div className="mt-2 space-y-2">
                  {groupedThreads[type].map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => setActiveThread(thread)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left ${
                        activeThread?.id === thread.id
                          ? 'border-tmMauve bg-tmMauve/10'
                          : 'border-tmBlush/30 bg-white'
                      }`}
                    >
                      <p className="text-sm font-semibold text-tmCharcoal">{thread.title}</p>
                      <p className="text-xs text-tmCharcoal/60">
                        Updated {new Date(thread.lastMessageAt).toLocaleDateString()}
                      </p>
                      {thread.unreadCount > 0 && (
                        <span className="mt-1 inline-flex items-center rounded-full bg-tmMauve px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
                          {thread.unreadCount} unread
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex flex-1 flex-col rounded-3xl border border-white/70 bg-white/90 p-4 shadow-soft">
          {activeThread ? (
            <>
              <div className="flex items-center justify-between border-b border-tmDust pb-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">{activeThread.type}</p>
                  <p className="text-lg font-semibold text-tmCharcoal">{activeThread.title}</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full border border-tmMauve px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve">
                  <SquarePen className="h-4 w-4" />
                  Link task
                </button>
              </div>
              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      message.author === 'member'
                        ? 'ml-auto bg-tmMauve text-white'
                        : 'bg-tmIvory text-tmCharcoal'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
                {!messages.length && (
                  <p className="text-xs text-tmCharcoal/60">// TODO: show typing indicator + empty state</p>
                )}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-tmBlush/50 bg-white/80 p-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tmMauve/10 text-sm font-semibold text-tmMauve">
                  <User2 className="h-4 w-4" />
                </div>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a note for your mentor..."
                  className="flex-1 bg-transparent text-sm text-tmCharcoal outline-none"
                />
                <button
                  onClick={handleSend}
                  className="inline-flex items-center gap-2 rounded-full bg-tmMauve px-4 py-2 text-sm font-semibold text-white"
                >
                  Send
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-sm text-tmCharcoal/60">
              Select a thread to get started.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
