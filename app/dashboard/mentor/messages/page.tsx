"use client";

import { useEffect, useMemo, useState } from "react";

import { ConversationSummary, getConversations } from "@/lib/api/chat";
import { requireMentor } from "@/lib/auth/requireMentor";
import ChatPanel from "@/components/chat/ChatPanel";
import ConversationList from "@/components/messaging/ConversationList";

const MentorMessagesPage = () => {
  const { user: guardUser, loading: guardLoading } = requireMentor();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [currentMentor, setCurrentMentor] = useState<{ id: string; name?: string } | null>(null);

  useEffect(() => {
    if (!guardUser) return;
    setToken(guardUser.token ?? null);
    setCurrentMentor({ id: guardUser.id, name: guardUser.name });
  }, [guardUser]);

  useEffect(() => {
    if (!token) return;
    setThreadsLoading(true);
    setThreadsError("");
    getConversations(token)
      .then((response) => {
        const list = response.data ?? [];
        setConversations(list);
        const firstThread = list[0];
        if (firstThread) {
          setActiveConversationId(firstThread.threadId);
        }
      })
      .catch(() => {
        setThreadsError("Unable to load conversation threads.");
      })
      .finally(() => {
        setThreadsLoading(false);
      });
  }, [token]);

  const threadItems = useMemo(
    () =>
      conversations.map((thread, index) => ({
        id: thread.threadId,
        mentorId: thread.mentorId,
        memberId: thread.memberId,
        name: `Mentee ${index + 1}`,
        detail: thread.lastMessage,
        lastMessage: thread.lastMessage,
        time: new Date(thread.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unread: true,
      })),
    [conversations],
  );

  const activeThread = useMemo(
    () => conversations.find((thread) => thread.threadId === activeConversationId),
    [conversations, activeConversationId],
  );

  if (guardLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm uppercase tracking-[0.5em] text-[#C8A1B4]">
        Curating your mentor concierge…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-8 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/70">Mentor messages</p>
        <h1 className="mt-3 font-serif text-3xl text-[#3E2F35]">Mentor concierge</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Keep mentee threads warm from wherever you are. Select a mentee to open the whisper channel.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.4fr,1fr]">
        <aside className="space-y-5 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
          {threadsLoading ? (
            <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Loading…</p>
          ) : threadsError ? (
            <p className="text-sm text-[#3E2F35]/70">{threadsError}</p>
          ) : (
            <ConversationList
              conversations={threadItems}
              activeId={activeConversationId}
              onSelect={(conversation) => setActiveConversationId(conversation.id)}
            />
          )}
        </aside>

        <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
          {activeThread ? (
            <ChatPanel
              mentorId={activeThread.mentorId}
              memberId={activeThread.memberId}
              currentUserId={currentMentor?.id ?? ""}
              currentUserRole="mentor"
              currentUserName={currentMentor?.name}
              label="Mentor concierge"
            />
          ) : (
            <p className="text-sm uppercase tracking-[0.45em] text-[#C8A1B4]">
              Select a conversation to begin chatting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorMessagesPage;
