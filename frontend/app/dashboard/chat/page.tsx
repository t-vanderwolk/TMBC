'use client';

import { useEffect, useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth';

type ChatMessage = {
  id: number;
  author: 'member' | 'mentor';
  text: string;
  timestamp: string;
};

const initialMessages: ChatMessage[] = [
  { id: 1, author: 'mentor', text: 'How did the nursery install go?', timestamp: '09:12' },
  { id: 2, author: 'member', text: 'We installed the wallpaper! Need eyes on the rocker setup.', timestamp: '09:13' },
  { id: 3, author: 'mentor', text: 'Upload a photo and I’ll send measurements by tonight.', timestamp: '09:15' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [mentorName, setMentorName] = useState('Your mentor');

  useEffect(() => {
    const session = loadSession();
    if (session?.payload?.mentorName) {
      setMentorName(session.payload.mentorName);
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        await api.get('/api/chat');
        // TODO: connect to backend messages + Supabase Realtime
      } catch (error) {
        console.error('Chat placeholder error', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSend = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, author: 'member', text: draft, timestamp: 'Now' },
    ]);
    setDraft('');
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Mentor Chat</p>
        <h1 className="text-3xl text-tmCharcoal">{mentorName}</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Keep everything in one warm thread—photos, approvals, pep talks.
        </p>
      </header>

      <section className="flex flex-1 flex-col rounded-3xl border border-tmBlush/40 bg-white/90 p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-tmCharcoal/70">
          <MessageCircle className="h-4 w-4 text-tmMauve" />
          Conversation thread
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
              <p className="mt-1 text-xs opacity-70">{message.timestamp}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-tmBlush/50 bg-white/80 p-3">
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
      </section>
    </div>
  );
}
