"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { useChat, type ChatMessage, type ChatStatus } from "@/hooks/useChat";

type ChatPanelProps = {
  mentorId: string;
  memberId: string;
  currentUserId: string;
  currentUserRole: "mentor" | "member";
  currentUserName?: string | null;
  label?: string;
};

const formatLabel = (message: ChatMessage, currentUserId: string) => {
  if (message.senderId === currentUserId) return "You";
  if (message.senderName) return message.senderName;
  return message.senderRole === "mentor" ? "Mentor" : "Member";
};

const statusMessage = (state: ChatStatus) => {
  switch (state) {
    case "connecting":
      return "Connecting…";
    case "connected":
      return "Live · TMBC whisper channel";
    case "disconnected":
      return "Disconnected · messages will queue";
    case "errored":
      return "Connection paused · messages will catch up soon";
    default:
      return "Preparing your studio";
  }
};

export default function ChatPanel({
  mentorId,
  memberId,
  currentUserId,
  currentUserRole,
  currentUserName,
  label,
}: ChatPanelProps) {
  const [conversationId, setConversationId] = useState("");
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { messages, status, error: socketError, sendMessage } = useChat({
    conversationId,
    initialMessages,
  });

  useEffect(() => {
    if (!mentorId || !memberId) return;
    let cancelled = false;
    setLoading(true);
    setFetchError("");

    api
      .get(`/chat/${mentorId}/${memberId}`)
      .then((response) => {
        if (cancelled) return;
        const conversation = response.data?.conversation;
        if (!conversation) {
          setFetchError("Conversation could not be loaded.");
          return;
        }
        setConversationId(conversation.id);
        setInitialMessages(conversation.messages ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setFetchError("Unable to load chat history.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mentorId, memberId]);

  const activeLabel = label ?? (currentUserRole === "mentor" ? "Mentor chat" : "Mentor chat");
  const subtitle = useMemo(() => statusMessage(status), [status]);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim() || !conversationId) return;

    setIsSending(true);
    setSendError("");
    try {
      await sendMessage(input);
      setInput("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send message.";
      setSendError(message);
    } finally {
      setIsSending(false);
    }
  };

  const displayMessages = !loading ? messages : [];

  return (
    <section className="space-y-3 rounded-[32px] border border-[var(--tm-mauve)]/30 bg-white/90 p-5 shadow-[0_20px_70px_rgba(199,166,199,0.2)]">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.45em] text-[var(--tm-charcoal)]/60">{activeLabel}</p>
        <h3 className="mt-1 text-lg font-semibold text-[var(--tm-charcoal)]">
          {currentUserName ?? (currentUserRole === "mentor" ? "Mentor channel" : "Mentor chat")}
        </h3>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tm-charcoal)]/60">{subtitle}</p>
      </div>

      <div className="h-56 space-y-3 overflow-y-auto rounded-[24px] border border-[var(--tm-charcoal)]/10 bg-[var(--tm-ivory)]/80 p-4 text-sm text-[var(--tm-charcoal)]">
        {loading && (
          <p className="text-sm text-[var(--tm-charcoal)]/70">Loading conversation…</p>
        )}
        {!loading && displayMessages.length === 0 && (
          <p className="text-[0.9rem] text-[var(--tm-charcoal)]/60">No messages yet—start the ritual.</p>
        )}
        {!loading &&
          displayMessages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`space-y-1 rounded-[18px] border border-[var(--tm-charcoal)]/10 px-3 py-2 ${
                  isOwnMessage
                    ? "bg-gradient-to-r from-[#FBE9EE] to-[#F6E9E6]"
                    : "bg-white/60"
                }`}
              >
                <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-charcoal)]/60">
                  {formatLabel(message, currentUserId)}
                </p>
                <p className="text-[0.85rem] text-[var(--tm-charcoal)]/80">{message.content}</p>
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-charcoal)]/50">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })}
      </div>

      {fetchError && (
        <p className="text-xs text-red-600">{fetchError}</p>
      )}
      {socketError && !fetchError && (
        <p className="text-xs text-[var(--tm-charcoal)]/70">{socketError}</p>
      )}
      {sendError && (
        <p className="text-xs text-red-600">{sendError}</p>
      )}

      <form onSubmit={handleSend} className="space-y-2">
        <textarea
          className="w-full rounded-[24px] border border-[var(--tm-mauve)]/40 bg-[var(--tm-ivory)]/80 px-3 py-2 text-sm text-[var(--tm-charcoal)] focus:border-[var(--tm-mauve)] focus:outline-none"
          placeholder="Send a quick mentor note"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={!conversationId || loading}
        />
        <button
          type="submit"
          disabled={!conversationId || !input.trim() || isSending}
          className="w-full rounded-[999px] border border-[var(--tm-mauve)] bg-[var(--tm-mauve)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
        >
          {loading ? "Connecting…" : "Send note"}
        </button>
      </form>
    </section>
  );
}
