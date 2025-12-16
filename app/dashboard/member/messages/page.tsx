"use client";

import MessagesWorkspace from "@/components/chat/MessagesWorkspace";

export default function MemberMessagesPage() {
  return (
    <div className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <MessagesWorkspace
        viewerRole="MEMBER"
        title="Private mentor chat"
        description="Touch base with your mentor whenever you need calm clarity."
      />
    </div>
  );
}
