"use client";

import { useState } from "react";

import ConversationList from "./ConversationList";
import ChatThread from "./ChatThread";
import type { ConversationSummary, ConversationViewer, RoleType } from "@/types/chat";

type MessagesWorkspaceProps = {
  viewerRole: RoleType;
  title: string;
  description: string;
};

const MessagesWorkspace = ({ viewerRole, title, description }: MessagesWorkspaceProps) => {
  const [selected, setSelected] = useState<ConversationSummary | null>(null);
  const [assignedMentorId, setAssignedMentorId] = useState<string | null>(null);

  const handleLoad = ({
    conversations,
    assignedMentorId: mentorId,
    viewer: _viewer,
  }: {
    conversations: ConversationSummary[];
    assignedMentorId: string | null;
    viewer: ConversationViewer | null;
  }) => {
    setAssignedMentorId(mentorId);
    if (!conversations.length) {
      setSelected(null);
      return;
    }

    setSelected((previous) => {
      if (previous && conversations.some((conversation) => conversation.id === previous.id)) {
        return previous;
      }
      return conversations[0] ?? null;
    });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2 rounded-[2.5rem] border border-[#E3C6D4] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/70">Messages</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">{title}</h1>
        <p className="text-sm text-[#3E2F35]/70">{description}</p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full lg:w-[32rem]">
          <ConversationList
            viewerRole={viewerRole}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
            onLoad={handleLoad}
          />
        </aside>
        <div className="flex-1">
          {viewerRole === "MEMBER" && assignedMentorId === null ? (
            <div className="flex flex-1 flex-col justify-center rounded-[28px] border border-[#E3C6D4] bg-white/80 p-6 text-center shadow-[0_16px_50px_rgba(180,143,164,0.2)]">
              <p className="text-sm text-[#3E2F35]/70">
                Your mentor will be assigned soon. Messaging will unlock automatically.
              </p>
            </div>
          ) : viewerRole === "MEMBER" && !selected ? (
            <div className="flex flex-1 flex-col justify-center rounded-[28px] border border-[#E3C6D4] bg-white/80 p-6 text-center shadow-[0_16px_50px_rgba(180,143,164,0.2)]">
              <p className="text-sm text-[#3E2F35]/70">Setting up your mentor thread.</p>
            </div>
          ) : (
            <ChatThread conversationId={selected?.id ?? undefined} viewerRole={viewerRole} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesWorkspace;
