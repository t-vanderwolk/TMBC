"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getClientUser, getSessionToken, type StoredUser } from "@/lib/auth";
import { PUBLIC_LOGIN_ROUTE, routeForRole } from "@/lib/auth/routeForRole";
import { getCurrentConversation, type ChatConversation } from "@/lib/api/chat";
import { useChat, type ChatStatus } from "@/hooks/useChat";

const STATUS_HINTS: Record<ChatStatus | "idle", string> = {
  connecting: "Connecting…",
  connected: "Live · TMBC whisper channel",
  disconnected: "Disconnected · messages will queue",
  errored: "Connection paused · messages will catch up soon",
  idle: "Preparing your studio",
};

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [sendError, setSendError] = useState("");
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUser = getClientUser();
    const storedToken = getSessionToken();

    if (!storedUser || !storedToken) {
      router.replace(PUBLIC_LOGIN_ROUTE);
      return;
    }

    const normalizedRole = (storedUser.role ?? "member").toUpperCase();
    if (normalizedRole !== "MEMBER") {
      router.replace(routeForRole(normalizedRole));
      return;
    }

    setUser(storedUser);
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setFetchError("");
    setConversation(null);

    getCurrentConversation()
      .then((response) => {
        const payload = response?.data?.conversation;
        if (!payload) {
          setConversation(null);
          return;
        }
        setConversation(payload);
      })
      .catch(() => {
        setFetchError("Unable to load your conversation right now.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const { messages, status, error: socketError, sendMessage } = useChat({
    conversationId: conversation?.id ?? "",
    initialMessages: conversation?.messages ?? [],
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const connectionHint = useMemo(() => STATUS_HINTS[status] ?? STATUS_HINTS.idle, [status]);

  const mentorName = conversation?.mentor?.name ?? "Your mentor";

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim() || !conversation) return;
    setSendError("");
    setIsSending(true);

    try {
      await sendMessage(draft);
      setDraft("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send your message right now.";
      setSendError(message);
    } finally {
      setIsSending(false);
    }
  };

  const activeMessages = loading ? [] : messages;
  const showEmptyState = !loading && !fetchError && !conversation;

  return (
    <div className="space-y-8">
      <header className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-8 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/70">Messages</p>
        <h1 className="mt-3 font-serif text-3xl text-[#3E2F35]">Private mentor chat</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Touch base with {mentorName.toLowerCase()} whenever you need calm clarity.
        </p>
      </header>

      {fetchError && (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.4fr,1fr]">
        <aside className="space-y-5 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
          <p className="text-xs uppercase tracking-[0.45em] text-[#3E2F35]/60">Conversation</p>
          <div className="space-y-1">
            <p className="text-sm font-serif text-[#3E2F35]">{mentorName}</p>
            <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/70">{connectionHint}</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#EAD4D8] bg-[#FFF8F6] p-4 text-sm text-[#3E2F35]/70">
            <p>Messages stay private between you and your mentor.</p>
            <p className="mt-1 text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Calm · Safe · Ready</p>
          </div>
        </aside>

        {showEmptyState ? (
          <div className="flex h-full items-center justify-center px-6">
            <div className="max-w-md rounded-[2.5rem] border border-[#E3C6D4] bg-[var(--tmbc-ivory)] p-8 text-center shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
              <h2 className="font-serif text-xl text-[var(--tmbc-charcoal)]">
                Your mentor conversation will live here
              </h2>
              <p className="mt-3 text-sm text-[var(--tmbc-charcoal)]/70">
                Ask a question or send a note to begin.
              </p>
              <div className="mt-6 space-y-3 rounded-[1.5rem] border border-[#E3C6D4] bg-white/70 p-4 text-sm text-[var(--tmbc-charcoal)]/70">
                <p>We’ll keep this space calm until you share the first message.</p>
                <p className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">Calm · Safe · Ready</p>
              </div>
            </div>
          </div>
        ) : (
          <section className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
            <div className="space-y-3">
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-[#3E2F35]/60">Mentor chat</p>
                <h3 className="mt-1 text-2xl font-serif text-[#3E2F35]">{mentorName}</h3>
                <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">{connectionHint}</p>
              </div>

              <div
                ref={scrollRef}
                className="min-h-[20rem] space-y-3 overflow-y-auto rounded-[1.5rem] border border-[#EAD4D8] bg-[#FFFAF8] p-4 text-sm text-[#3E2F35]"
              >
                {loading && (
                  <p className="text-[0.85rem] text-[#3E2F35]/70">Loading conversation…</p>
                )}

                {!loading && activeMessages.length === 0 && (
                  <p className="text-[0.9rem] text-[#3E2F35]/60">
                    No messages yet—share a quick update when you're ready.
                  </p>
                )}

                {!loading &&
                  activeMessages.map((message) => (
                    <div
                      key={message.id}
                      className="space-y-1 rounded-[18px] border border-[#E3C6D4] bg-white/80 px-3 py-2"
                    >
                      <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
                        {message.senderId === user?.id ? "You" : message.senderName ?? "Mentor"}
                      </p>
                      <p className="text-[0.85rem] text-[#3E2F35]/80">{message.content}</p>
                      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/50">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
              </div>

              {socketError && !fetchError && (
                <p className="text-xs text-[#3E2F35]/70">{socketError}</p>
              )}
              {sendError && (
                <p className="text-xs text-red-600">{sendError}</p>
              )}

              <form onSubmit={handleSend} className="space-y-2">
                <textarea
                  className="w-full rounded-[24px] border border-[#C8A1B4]/40 bg-[#FFFAF8] px-3 py-2 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none"
                  placeholder="Send a quick whisper"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={!conversation || loading}
                />
                <button
                  type="submit"
                  disabled={!conversation || !draft.trim() || isSending}
                  className="w-full rounded-[999px] border border-[#C8A1B4] bg-[#C8A1B4] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
                >
                  {isSending ? "Sending…" : "Send message"}
                </button>
              </form>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
