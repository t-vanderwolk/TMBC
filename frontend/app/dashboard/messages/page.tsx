"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ChatPanel from "@/components/chat/ChatPanel";
import ConversationList from "@/components/messaging/ConversationList";
import { getCurrentConversation } from "@/lib/api/chat";
import { getClientUser } from "@/lib/auth";
import { getRoleRedirectPath } from "@/lib/auth/userStore";

type ConversationSummary = {
  id: string;
  mentorId: string;
  memberId: string;
  name: string;
  detail: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
};

export default function MessagesPage() {
  const router = useRouter();
  const [conversation, setConversation] = useState<ConversationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; name?: string; role?: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUser = getClientUser();
    const storedToken = localStorage.getItem("tm_token") || localStorage.getItem("tmbc_token");
    if (!storedUser || !storedToken) {
      router.replace("/login");
      return;
    }

    const normalizedRole = (storedUser.role ?? "member").toUpperCase();
    if (normalizedRole !== "MEMBER") {
      router.replace(getRoleRedirectPath(normalizedRole));
      return;
    }

    setUser(storedUser);
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!token || !user) return;
    setLoading(true);
    setFetchError("");

    getCurrentConversation(token)
      .then((response) => {
        const data = response.data;
        const lastMessage = data.messages?.[data.messages.length - 1];
        setConversation({
          id: `${data.mentorId}:${data.memberId}`,
          mentorId: data.mentorId,
          memberId: data.memberId,
          name: "Your mentor",
          detail: "Private mentor thread",
          lastMessage: lastMessage?.content ?? "Share a quick update.",
          time: lastMessage
            ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "now",
          unread: true,
        });
      })
      .catch(() => {
        setFetchError("Unable to load your conversation right now.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, user]);

  const activeConversationId = useMemo(() => conversation?.id ?? "", [conversation]);

  const handleSelect = (selected: ConversationSummary) => {
    setConversation(selected);
  };

  return (
    <div className="space-y-8">
      <header className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-8 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/70">Messages</p>
        <h1 className="mt-3 font-serif text-3xl text-[#3E2F35]">Private mentor chat</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Conversations stay private, calm, and ready for your next check-in.
        </p>
      </header>

      {fetchError && (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          {fetchError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.4fr,1fr]">
        <aside className="space-y-5 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
          <p className="text-xs uppercase tracking-[0.45em] text-[#3E2F35]/60">Conversations</p>
          {loading ? (
            <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Loading…</p>
          ) : conversation ? (
            <ConversationList
              conversations={[conversation]}
              activeId={activeConversationId}
              onSelect={handleSelect}
            />
          ) : (
            <p className="text-sm text-[#3E2F35]/70">No conversations yet. Say hello to your mentor.</p>
          )}
        </aside>

        <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
          {loading || !conversation ? (
            <p className="text-sm uppercase tracking-[0.45em] text-[#C8A1B4]">Connecting…</p>
          ) : (
            <ChatPanel
              mentorId={conversation.mentorId}
              memberId={conversation.memberId}
              token={token ?? undefined}
              currentUserId={user?.id ?? ""}
              currentUserRole="member"
              currentUserName={user?.name ?? "You"}
              label="Mentor chat"
            />
          )}
        </div>
      </div>
    </div>
  );
}
