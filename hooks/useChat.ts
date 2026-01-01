"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getSessionToken } from "@/lib/auth";

export type ChatMessage = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  senderName: string | null;
  senderRole: string | null;
  createdAt: string;
};

export type ChatStatus = "idle" | "connecting" | "connected" | "disconnected" | "errored";

type UseChatOptions = {
  conversationId: string;
  initialMessages?: ChatMessage[];
  token?: string | null;
};

const buildWebSocketUrl = (conversationId: string, token: string) => {
  if (typeof window === "undefined") return "";
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.host;
  const url = new URL(`${protocol}://${host}/api/chat/ws`);
  url.searchParams.set("conversationId", conversationId);
  url.searchParams.set("token", token);
  return url.toString();
};

export const useChat = ({
  conversationId,
  initialMessages = [],
  token,
}: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const initialMessagesRef = useRef<ChatMessage[]>(initialMessages);

  useEffect(() => {
    initialMessagesRef.current = initialMessages;
  }, [initialMessages]);

  useEffect(() => {
    if (!conversationId || typeof window === "undefined") {
      setStatus(() => "idle");
      setMessages(() => []);
      return;
    }

    setMessages(() => initialMessagesRef.current);

    let active = true;

    fetch(`/api/chat/conversations/${conversationId}/messages`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load the chat.");
        }
        const payload = await response.json().catch(() => null);
        const convo = payload?.conversation;
        if (!active || !convo || convo.id !== conversationId) return;
        setMessages(() => convo.messages ?? []);
      })
      .catch(() => {
        if (!active) return;
        setError(() => "Unable to load the chat.");
      });

    return () => {
      active = false;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId || typeof window === "undefined") {
      setStatus(() => "idle");
      return;
    }

    const effectiveToken = token ?? getSessionToken();
    if (!effectiveToken) {
      setError(() => "Authentication required for chat.");
      setStatus(() => "errored");
      return;
    }

    const wsUrl = buildWebSocketUrl(conversationId, effectiveToken);
    if (!wsUrl) {
      setError(() => "Unable to prepare chat connection.");
      setStatus(() => "errored");
      return;
    }

    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;
    setStatus(() => "connecting");
    setError(() => null);

    const handleMessage = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type === "message" && payload?.data) {
          setMessages((current) => {
            if (current.some((message) => message.id === payload.data.id)) {
              return current;
            }
            return [...current, payload.data];
          });
        } else if (payload?.type === "error") {
          setError(() => payload.data?.message ?? "Chat error.");
        }
      } catch {
        // ignore bad payload
      }
    };

    const handleOpen = () => {
      setStatus(() => "connected");
    };

    const handleClose = () => {
      setStatus(() => "disconnected");
    };

    const handleError = () => {
      setStatus(() => "errored");
      setError(() => "Unable to connect to chat.");
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("message", handleMessage);
      socket.close();
      wsRef.current = null;
    };
  }, [conversationId, token]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) {
        throw new Error("Missing conversation or content.");
      }

      const payload = JSON.stringify({
        type: "send-message",
        data: { content: content.trim() },
      });

      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(payload);
        return;
      }

      const resolvedToken = token ?? getSessionToken();
      if (!resolvedToken) {
        throw new Error("Session expired.");
      }

      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error ?? "Unable to send message");
      }
    },
    [conversationId, token],
  );

  return {
    messages,
    status,
    error,
    sendMessage,
  };
};
