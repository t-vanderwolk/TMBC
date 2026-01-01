"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Notebook } from "lucide-react";

import ChatComposer from "./ChatComposer";
import MessageBubble from "./MessageBubble";
import { useChatPolling } from "@/hooks/useChatPolling";
import type { ChatConversationResponse, ChatMessagePayload, RoleType } from "@/types/chat";
import MentorNotesDrawer from "@/app/dashboard/chat/components/MentorNotesDrawer";

type ChatThreadProps = {
  conversationId?: string;
  viewerRole: RoleType;
};

const ChatThread = ({ conversationId, viewerRole }: ChatThreadProps) => {
  const {
    conversation,
    messages: fetchedMessages,
    loading,
    error,
    refresh,
  } = useChatPolling({ conversationId });

  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessagePayload[]>([]);
  const [notesOpen, setNotesOpen] = useState(false);

  useEffect(() => {
    if (!fetchedMessages.length) {
      setOptimisticMessages((prev) => prev.filter((message) => !message.isSystem));
      return;
    }
    setOptimisticMessages((prev) =>
      prev.filter(
        (message) => !fetchedMessages.some((serverMessage) => serverMessage.id === message.id),
      ),
    );
  }, [fetchedMessages]);

  const messages = useMemo(() => {
    const map = new Map<string, ChatMessagePayload>();
    [...fetchedMessages, ...optimisticMessages].forEach((message) => {
      map.set(message.id, message);
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [fetchedMessages, optimisticMessages]);

  const handleMessageSent = (message: ChatMessagePayload) => {
    setOptimisticMessages((prev) => [...prev, message]);
  };

  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  useEffect(() => {
    setNotesOpen(false);
  }, [conversationId]);

  if (!conversationId) {
    return (
      <div className="flex flex-1 flex-col justify-center rounded-[28px] border border-[#E3C6D4] bg-white/80 p-6 text-center shadow-[0_16px_50px_rgba(180,143,164,0.2)]">
        <p className="text-sm text-[#3E2F35]/70">
          Choose a conversation to begin. Your mentor is here whenever you're ready.
        </p>
      </div>
    );
  }

  const participants = conversation?.participants ?? [];
  const memberId =
    conversation?.member?.id ??
    participants.find((participant) => participant.role === "MEMBER")?.id ??
    null;
  const partner =
    viewerRole === "MEMBER"
      ? conversation?.mentor ?? participants.find((participant) => participant.role === "MENTOR") ?? null
      : conversation?.member ?? participants.find((participant) => participant.role === "MEMBER") ?? null;
  const partnerName = partner?.name ?? (viewerRole === "MEMBER" ? "Mentor" : "Member");
  const latestMessage = messages[messages.length - 1] ?? null;
  const latestMessageDate = latestMessage ? new Date(latestMessage.createdAt) : null;

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-[28px] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <header className="flex flex-col gap-3 rounded-[28px] border border-[#E3C6D4] bg-[#FFF8F6]/60 p-4 shadow-[0_12px_35px_rgba(180,143,164,0.2)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-1">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/60">Mentor chat</p>
          <h3 className="text-2xl font-serif text-[#3E2F35]">{partnerName}</h3>
          <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">
            Message sent{" "}
            {latestMessageDate
              ? latestMessageDate.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "recently"}
          </p>
        </div>
        {viewerRole === "MENTOR" && memberId && (
          <button
            type="button"
            onClick={() => setNotesOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E3C6D4] bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35] shadow-[0_8px_25px_rgba(180,143,164,0.2)]"
          >
            <Notebook className="h-4 w-4" />
            Mentor notes
          </button>
        )}
      </header>
      <MentorNotesDrawer open={notesOpen} memberId={memberId ?? undefined} onClose={() => setNotesOpen(false)} />
      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto rounded-[22px] border border-[#EAD4D8] bg-[#FFFAF8] p-4 text-sm text-[#3E2F35]"
      >
        {loading && <p className="text-[0.85rem] text-[#3E2F35]/70">Loading conversation…</p>}
        {error && (
          <p className="text-[0.9rem] text-[#3E2F35]/70">
            {error}
          </p>
        )}
        {!loading && !error && messages.length === 0 && (
          <p className="text-[0.9rem] text-[#3E2F35]/60">
            {viewerRole === "MEMBER"
              ? "Your mentor will respond here."
              : "No messages yet—send a calm check-in when you’re ready."}
          </p>
        )}
        {!loading &&
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              viewerRole={viewerRole}
              isOwn={message.senderRole === viewerRole}
            />
          ))}
      </div>

      <ChatComposer
        conversationId={conversationId}
        onMessageSent={(message) => {
          handleMessageSent(message);
          refresh();
        }}
      />
    </div>
  );
};

export default ChatThread;
