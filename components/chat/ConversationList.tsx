"use client";

import { useEffect, useState } from "react";

import type { ConversationSummary, RoleType } from "@/types/chat";
import ConversationRow from "./ConversationRow";

type ConversationListProps = {
  viewerRole: RoleType;
  selectedId?: string | null;
  onSelect: (summary: ConversationSummary) => void;
  onLoad?: (conversations: ConversationSummary[]) => void;
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
        const items: ConversationSummary[] = payload?.conversations ?? [];
        if (!active) return;
        setConversations(items);
        onLoad?.(items);
        console.log(`Loaded conversations: ${items.length}`);
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
  }, [onLoad]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/60">Conversations</p>
        <h2 className="mt-2 font-serif text-xl text-[#3E2F35]">
          Your mentor is here whenever you need support.
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
      {!loading && !error && conversations.length === 0 && (
        <div className="rounded-[22px] border border-[#E3C6D4] bg-[#FFF8F6] p-4 text-sm text-[#3E2F35]/70">
          Your mentor is here whenever you need support.
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
