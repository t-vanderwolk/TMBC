"use client";

type Conversation = {
  id: number;
  name: string;
  detail: string;
  lastMessage: string;
  time: string;
  unread: boolean;
};

type ConversationListProps = {
  conversations: Conversation[];
  activeId: number;
  onSelect: (id: number) => void;
};

const ConversationList = ({ conversations, activeId, onSelect }: ConversationListProps) => {
  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation.id)}
          className={`w-full rounded-[24px] border px-4 py-3 text-left transition hover:border-[var(--tmbc-mauve)] ${
            activeId === conversation.id
              ? "border-[var(--tmbc-mauve)] bg-[var(--tmbc-blush)]"
              : "border-[var(--tmbc-charcoal)]/10 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--tmbc-charcoal)]">{conversation.name}</span>
            <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
              {conversation.time}
            </span>
          </div>
          <p className="mt-2 text-xs text-[var(--tmbc-charcoal)]/70">{conversation.detail}</p>
          <p className="text-[0.7rem] text-[var(--tmbc-charcoal)]/60">{conversation.lastMessage}</p>
          {conversation.unread && (
            <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--tmbc-gold)]/20 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]">
              Active
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ConversationList;
