"use client";

import { useState } from "react";

import ChatWindow, { Conversation } from "@/components/messaging/ChatWindow";
import ConversationList from "@/components/messaging/ConversationList";

type ConversationMeta = Conversation & {
  id: number;
  detail: string;
  lastMessage: string;
  time: string;
  unread: boolean;
};

const conversations: ConversationMeta[] = [
  {
    id: 1,
    name: "Birthing Circle · Ellie",
    topic: "Voice notes and gentle checkpoints on trimester 3.",
    detail: "Ellie · Mentor",
    lastMessage: "Just tap in whenever you need a voice note.",
    time: "now",
    unread: true,
    messages: [
      { id: 1, sender: "mentor", content: "We’ll keep it calm and luminous this week. Need a breathing cue?", time: "9:02a" },
      { id: 2, sender: "self", content: "Yes please, a little ritual before bed would be amazing.", time: "9:04a" },
      { id: 3, sender: "mentor", content: "Tea, candle, and a quick gratitude note. I’ll drop a template tonight.", time: "9:06a" },
    ],
  },
  {
    id: 2,
    name: "Registry Studio · Marisol",
    topic: "Quick edits to heirlooms, textiles, and moodboard pairings.",
    detail: "Marisol · Mentor",
    lastMessage: "Sharing the curated drop right now.",
    time: "4h ago",
    unread: false,
    messages: [
      { id: 4, sender: "self", content: "Already loving the soft gold accents you suggested!", time: "10:32a" },
      { id: 5, sender: "mentor", content: "I’m pulling the drop together and will send you the registry link directly.", time: "10:35a" },
    ],
  },
  {
    id: 3,
    name: "Community Salon",
    topic: "Weekly check-in for first-time parents.",
    detail: "Community · Mentors",
    lastMessage: "Poll results released for next salon",
    time: "Yesterday",
    unread: false,
    messages: [
      { id: 6, sender: "mentor", content: "Salon tomorrow at 6p PT. RSVP if you can join!", time: "Yesterday" },
    ],
  },
];

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);

  const activeConversation = conversations.find((conv) => conv.id === activeId) ?? conversations[0];

  return (
    <div className="space-y-8">
      <header className="rounded-[36px] border border-[var(--tmbc-mauve)]/40 bg-[var(--tmbc-ivory)]/80 p-6 shadow-[0_25px_80px_rgba(199,166,199,0.2)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">Dashboard</p>
        <h1 className="font-serif text-3xl text-[var(--tmbc-charcoal)]">Messages</h1>
        <p className="text-sm text-[var(--tmbc-charcoal)]/70">
          Conversations are invite-only, curated, and quiet—just like the TMBC village.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.4fr,1fr]">
        <aside className="space-y-5 rounded-[36px] border border-[var(--tmbc-mauve)]/40 bg-white/90 p-5 shadow-[0_25px_60px_rgba(199,166,199,0.2)]">
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--tmbc-charcoal)]/60">Conversations</p>
          <ConversationList conversations={conversations} activeId={activeId} onSelect={setActiveId} />
        </aside>

        <ChatWindow conversation={activeConversation} />
      </div>
    </div>
  );
}
