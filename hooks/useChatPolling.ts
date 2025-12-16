"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  ChatConversationResponse,
  ChatMessagePayload,
} from "@/types/chat";

type UseChatPollingOptions = {
  conversationId?: string;
  interval?: number;
};

export const useChatPolling = ({
  conversationId,
  interval = 4000,
}: UseChatPollingOptions) => {
  const [conversation, setConversation] = useState<ChatConversationResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<globalThis.AbortController | null>(null);

  const fetchMessages = useCallback(
    async (signal?: AbortSignal) => {
      if (!conversationId) {
        setConversation(null);
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      abortRef.current?.abort();
      const controller = signal ? null : new globalThis.AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(
          `/api/chat/conversations/${conversationId}/messages`,
          {
            signal: signal ?? controller?.signal ?? undefined,
          },
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error ?? "Unable to load messages.");
        }

        const payload = (await response.json()) as {
          conversation: ChatConversationResponse | null;
        };

        const conversationPayload = payload.conversation;
        if (conversationPayload) {
          setConversation(conversationPayload);
          setMessages(conversationPayload.messages ?? []);
          console.log(
            `Loaded messages for conversation ${conversationId}: ${
              conversationPayload.messages?.length ?? 0
            }`,
          );
        }
      } catch (err) {
        if ((err as { name: string }).name === "AbortError") {
          return;
        }
        const message =
          err instanceof Error ? err.message : "Unable to load messages.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [conversationId],
  );

  useEffect(() => {
    fetchMessages();
    if (!conversationId) return;

    const intervalId = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      fetchMessages();
    }, interval);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchMessages();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
      abortRef.current?.abort();
    };
  }, [conversationId, fetchMessages, interval]);

  const refresh = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  return useMemo(
    () => ({
      conversation,
      messages,
      loading,
      error,
      refresh,
    }),
    [conversation, messages, loading, error, refresh],
  );
};
