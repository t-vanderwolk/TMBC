"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ConversationSummary, ConversationViewer, RoleType } from "@/types/chat";
import ConversationRow from "./ConversationRow";

type ConversationListProps = {
  viewerRole: RoleType;
  selectedId?: string | null;
  onSelect: (summary: ConversationSummary) => void;
  onLoad?: (payload: {
    conversations: ConversationSummary[];
    viewer: ConversationViewer | null;
    assignedMentorId: string | null;
  }) => void;
};

const ConversationList = ({
  viewerRole,
  selectedId,
  onSelect,
  onLoad,
}: ConversationListProps) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignedMentorId, setAssignedMentorId] = useState<string | null>(null);
  const createAttempted = useRef(false);

  useEffect(() => {
    createAttempted.current = false;
  }, [assignedMentorId]);

  const applyOrdering = useMemo(() => {
    return (items: ConversationSummary[]) => {
      if (viewerRole !== "MENTOR") return items;
      return [...items].sort((a, b) => {
        const aUnread = a.lastMessageSenderRole && a.lastMessageSenderRole !== viewerRole;
        const bUnread = b.lastMessageSenderRole && b.lastMessageSenderRole !== viewerRole;
        if (aUnread !== bUnread) {
          return aUnread ? -1 : 1;
        }
        const aTime = new Date(a.lastMessageAt ?? a.updatedAt).getTime();
        const bTime = new Date(b.lastMessageAt ?? b.updatedAt).getTime();
        return bTime - aTime;
      });
    };
  }, [viewerRole]);

  const formatConversationSummary = (conversation: {
    id: string;
    updatedAt?: string | Date;
    participants?: Array<{ id: string; name?: string | null; role: RoleType }>;
  }): ConversationSummary => {
    const participants = conversation.participants ?? [];
    const mentor = participants.find((participant) => participant.role === "MENTOR") ?? null;
    const member = participants.find((participant) => participant.role === "MEMBER") ?? null;
    const updatedAt =
      typeof conversation.updatedAt === "string"
        ? conversation.updatedAt
        : conversation.updatedAt
          ? conversation.updatedAt.toISOString()
          : new Date().toISOString();
    return {
      id: conversation.id,
      mentor,
      member,
      mentorId: mentor?.id ?? null,
      memberId: member?.id ?? null,
      lastMessage: null,
      lastMessageAt: null,
      lastMessageSenderRole: null,
      updatedAt,
    };
  };

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/chat/conversations", {
          signal: controller.signal,
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error ?? "Unable to load conversations.");
        }
        const payload = await response.json().catch(() => null);
        const viewer: ConversationViewer | null = payload?.viewer ?? null;
        const items: ConversationSummary[] = payload?.conversations ?? [];
        const mentorId = viewer?.mentorId ?? null;
        setAssignedMentorId(mentorId);
        let filtered = items;
        if (viewerRole === "MEMBER") {
          if (!mentorId) {
            filtered = [];
          } else {
            filtered = items.filter(
              (conversation) =>
                conversation.mentorId === mentorId || conversation.mentor?.id === mentorId,
            );
            if (!filtered.length && !createAttempted.current && viewer) {
              createAttempted.current = true;
              const createResponse = await fetch("/api/chat/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mentorId, memberId: viewer.id }),
              });
              if (createResponse.ok) {
                const createdPayload = await createResponse.json().catch(() => null);
                const createdConversation = createdPayload?.conversation ?? null;
                if (createdConversation) {
                  filtered = [formatConversationSummary(createdConversation)];
                }
              } else {
                const errorPayload = await createResponse.json().catch(() => null);
                throw new Error(errorPayload?.error ?? "Unable to start your mentor thread.");
              }
            }
          }
        }
        const ordered = applyOrdering(filtered);
        if (!active) return;
        setConversations(ordered);
        onLoad?.({
          conversations: ordered,
          viewer,
          assignedMentorId: mentorId,
        });
        console.log(`Loaded conversations: ${ordered.length}`);
      } catch (err) {
        if ((err as { name: string }).name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Unable to load conversations.";
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [applyOrdering, onLoad, viewerRole]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/60">Conversations</p>
        <h2 className="mt-2 font-serif text-xl text-[#3E2F35]">
          {viewerRole === "MENTOR"
            ? "Stay close to the members who need you most."
            : "Your mentor is here whenever you need support."}
        </h2>
      </div>
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-[20px] bg-[#FFF8F6] p-4">
              <div className="h-4 w-24 rounded-full bg-[#E3C6D4]/60" />
              <div className="mt-3 h-3 w-[70%] rounded-full bg-[#E3C6D4]/60" />
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className="rounded-[18px] border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {!loading && !error && conversations.length === 0 && viewerRole === "MEMBER" && !assignedMentorId && (
        <div className="rounded-[22px] border border-[#E3C6D4] bg-[#FFF8F6] p-4 text-sm text-[#3E2F35]/70">
          Your mentor will be assigned soon. Messaging will unlock automatically.
        </div>
      )}
      {!loading && !error && conversations.length === 0 && viewerRole === "MENTOR" && (
        <div className="rounded-[22px] border border-[#E3C6D4] bg-[#FFF8F6] p-4 text-sm text-[#3E2F35]/70">
          No member conversations yet.
        </div>
      )}
      {!loading && !error && conversations.length === 0 && viewerRole === "MEMBER" && assignedMentorId && (
        <div className="rounded-[22px] border border-[#E3C6D4] bg-[#FFF8F6] p-4 text-sm text-[#3E2F35]/70">
          Setting up your mentor thread.
        </div>
      )}
      <div className="space-y-2">
        {!loading &&
          conversations.map((summary) => (
            <ConversationRow
              key={summary.id}
              summary={summary}
              viewerRole={viewerRole}
              selected={summary.id === selectedId}
              onSelect={onSelect}
            />
          ))}
      </div>
    </div>
  );
};

export default ConversationList;
