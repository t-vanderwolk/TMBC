"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AttachmentBar from "@/components/tmbc/AttachmentBar";
import MessageList from "@/components/tmbc/MessageList";
import MessageThread from "@/components/tmbc/MessageThread";
import StyledButton from "@/components/tmbc/StyledButton";
import { fetchMessages, sendMessage } from "@/lib/api/placeholders";

export default function MessageThreadPage() {
  const { threadId } = useParams();
  const router = useRouter();
  const [threads, setThreads] = useState<Array<{ id: string; title: string; preview: string; updatedAt: string }>>([]);
  const [messages, setMessages] = useState([
    { id: "msg-1", author: "Mentor Celeste", content: "We can review your registry today.", align: "left" as const, at: new Date().toLocaleTimeString() },
    { id: "msg-2", author: "You", content: "I’d love that.", align: "right" as const, at: new Date().toLocaleTimeString() },
  ]);

  useEffect(() => {
    fetchMessages().then((data) => {
      setThreads(data);
    });
  }, []);

  const activeThread = useMemo(() => threads.find((thread) => thread.id === threadId) ?? threads[0], [threads, threadId]);

  const handleSend = async () => {
    const newMessage = { id: `msg-${Date.now()}`, author: "You", content: "I’m following up!", align: "right" as const, at: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, newMessage]);
    await sendMessage(activeThread?.id ?? "thread-1", newMessage.content);
  };

  const handleSelectThread = (id: string) => {
    void router.push(`/dashboard/messages/${id}`);
  };

  return (
      <div className="space-y-6">
      <h1 className="font-serif text-3xl text-[#3E2F35]">Mentor messages</h1>
      <div className="grid gap-6 md:grid-cols-[0.4fr,1fr]">
        <aside className="space-y-4">
          <MessageList
            threads={threads}
            activeId={activeThread?.id}
            onSelect={handleSelectThread}
          />
          <StyledButton variant="secondary" fullWidth>
            Request follow-up session
          </StyledButton>
        </aside>
        <section className="space-y-4">
          <MessageThread messages={messages} />
          <AttachmentBar />
          <StyledButton onClick={handleSend}>Send reply</StyledButton>
        </section>
      </div>
    </div>
  );
}
