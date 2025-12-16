"use client";

import { FormEvent, KeyboardEvent, useCallback, useEffect, useState } from "react";

import type { ChatMessagePayload } from "@/types/chat";

type ChatComposerProps = {
  conversationId?: string;
  disabled?: boolean;
  onMessageSent?: (payload: ChatMessagePayload) => void;
};

const ChatComposer = ({ conversationId, disabled, onMessageSent }: ChatComposerProps) => {
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    if (!rateLimited) return;
    const timeout = window.setTimeout(() => {
      setRateLimited(false);
      setError(null);
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [rateLimited]);

  const handleSend = useCallback(
    async (event?: FormEvent) => {
      if (event) {
        event.preventDefault();
      }
      if (!draft.trim() || !conversationId || disabled || isSending || rateLimited) return;
      setIsSending(true);
      setError(null);
      try {
        const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: draft.trim() }),
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          if (response.status === 429) {
            setRateLimited(true);
            setError("Let’s pause for a moment before sending another message.");
          } else {
            setError(payload?.error ?? "Let’s pause for a moment before sending another message.");
          }
          return;
        }
        const payload = await response.json();
        const message: ChatMessagePayload = payload?.message;
        if (message) {
          onMessageSent?.(message);
        }
        setDraft("");
      } catch (error) {
        setError("Let’s pause for a moment before sending another message.");
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, disabled, draft, isSending, onMessageSent, rateLimited],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 rounded-[28px] border border-[#E3C6D4] bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(227,198,212,0.35)] backdrop-blur">
      <form onSubmit={handleSend} className="space-y-2">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share a moment—or just say hello."
          className="w-full rounded-[24px] border border-[#E3C6D4] bg-[#FFFAF8] px-4 py-3 text-sm text-[#3E2F35] focus:border-[#B98AA5] focus:outline-none focus:ring-2 focus:ring-[#B98AA5]/30"
          rows={2}
          disabled={disabled || rateLimited}
        />
        <div className="flex items-center justify-between text-xs text-[#3E2F35]/70">
          <p className="min-h-[1rem]">{error || (rateLimited ? "Let’s pause for a moment before sending another message." : "\u00A0")}</p>
          <button
            type="submit"
            disabled={disabled || isSending || rateLimited || !conversationId}
            className="rounded-[20px] bg-[#B98AA5] px-4 py-2 font-semibold uppercase tracking-[0.35em] text-white transition disabled:bg-[#E3C6D4]"
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComposer;
