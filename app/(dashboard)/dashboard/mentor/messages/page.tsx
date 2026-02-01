"use client";

import MessagesWorkspace from "@/components/chat/MessagesWorkspace";

export const dynamic = "force-dynamic";

export default function MentorMessagesPage() {
  return (
    <div className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <MessagesWorkspace
        viewerRole="MENTOR"
        title="Messages with members"
        description="Guide your members with calm, considered replies."
      />
    </div>
  );
}
