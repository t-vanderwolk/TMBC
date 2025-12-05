"use client";

import MessageBubble from "@/components/messaging/MessageBubble";
import { useState } from "react";

type Message = {
  id: number;
  sender: "self" | "mentor";
  content: string;
  time: string;
};

type Conversation = {
  name: string;
  topic: string;
  messages: Message[];
};

type ChatWindowProps = {
  conversation: Conversation;
};

const ChatWindow = ({ conversation }: ChatWindowProps) => {
  const [draft, setDraft] = useState("");

  return (
    <div className="flex h-full flex-col rounded-[36px] border border-[var(--tmbc-mauve)]/40 bg-[var(--tmbc-ivory)]/80 p-5 shadow-[0_35px_90px_rgba(199,166,199,0.2)]">
      <header className="mb-4 flex items-center justify-between border-b border-[var(--tmbc-mauve)]/20 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-[var(--tmbc-charcoal)]/60">Mentor chat</p>
          <h2 className="text-2xl font-serif text-[var(--tmbc-charcoal)]">{conversation.name}</h2>
          <p className="text-sm text-[var(--tmbc-charcoal)]/70">{conversation.topic}</p>
        </div>
        <button className="rounded-full border border-[var(--tmbc-charcoal)]/30 px-4 py-2 text-[0.7rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)]">
          Settings
        </button>
      </header>

      <div className="mb-4 flex-1 space-y-4 overflow-y-auto pr-2">
        {conversation.messages.map((message) => (
          <MessageBubble
            key={message.id}
            sender={message.sender}
            text={message.content}
            time={message.time}
          />
        ))}
      </div>

      <footer className="mt-auto space-y-3">
        <label className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
          Leave a note
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Share a quick update"
            className="flex-1 rounded-[28px] border border-[var(--tmbc-charcoal)]/20 px-5 py-3 text-sm text-[var(--tmbc-charcoal)] focus:border-[var(--tmbc-mauve)] focus:outline-none"
          />
          <button
            onClick={() => setDraft("")}
            className="rounded-[28px] bg-[var(--tmbc-mauve)] px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[var(--tmbc-ivory)] shadow-[0_10px_40px_rgba(199,166,199,0.35)] transition hover:-translate-y-0.5"
          >
            Send
          </button>
        </div>
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
          No backend yet · placeholder send clears draft only.
        </p>
      </footer>
    </div>
  );
};

export type { Conversation, Message };
export default ChatWindow;
