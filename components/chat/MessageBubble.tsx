"use client";

import type { ChatMessagePayload, RoleType } from "@/types/chat";

type MessageBubbleProps = {
  message: ChatMessagePayload;
  viewerRole: RoleType;
  isOwn: boolean;
};

const MessageBubble = ({ message, viewerRole, isOwn }: MessageBubbleProps) => {
  if (message.isSystem) {
    return (
      <div className="flex justify-center">
        <div className="rounded-[20px] bg-[#E3C6D4] px-4 py-2 text-center text-[0.75rem] uppercase tracking-[0.45em] text-[#3E2F35]/70">
          {message.content}
        </div>
      </div>
    );
  }

  const isMentorMessage = message.senderRole === "MENTOR" && !isOwn;
  const bubbleAlignment = isOwn ? "items-end" : "items-start";
  const bubbleColor = isOwn ? "bg-[#F0D4D9]" : isMentorMessage ? "bg-[#FFFAF8]" : "bg-white";

  return (
    <div className={`flex w-full ${bubbleAlignment}`}>
      <div
        className={`max-w-[80%] rounded-[24px] px-4 py-3 text-sm font-medium leading-relaxed text-[#3E2F35] shadow-[0_10px_30px_rgba(192,153,170,0.2)] ${bubbleColor}`}
      >
        <p className="text-[0.8rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
          {message.senderRole === viewerRole ? "You" : message.senderName ?? "Mentor"}
        </p>
        <p className="mt-1 whitespace-pre-line">{message.content}</p>
        <span className="mt-2 inline-flex text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/50">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
