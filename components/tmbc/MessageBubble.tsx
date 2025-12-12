import type { ReactNode } from "react";

export type MessageBubbleProps = {
  author: string;
  content: string;
  onRight?: boolean;
  timestamp?: string;
  attachments?: ReactNode[];
};

export default function MessageBubble({ author, content, onRight, timestamp, attachments }: MessageBubbleProps) {
  return (
    <div className={`max-w-[70%] rounded-2xl border border-[#E3C6D4] bg-white p-4 text-sm text-[#3E2F35] ${
      onRight ? "self-end" : "self-start"
    }`}> 
      <div className="text-[0.6rem] uppercase tracking-[0.35em] text-[#C7A6C9]">{author}</div>
      <p className="mt-1 text-sm text-[#3E2F35]/80">{content}</p>
      {attachments && attachments.length > 0 && (
        <div className="mt-2 space-y-1 text-xs">
          {attachments.map((attachment, index) => (
            <div key={index}>{attachment}</div>
          ))}
        </div>
      )}
      {timestamp && <p className="mt-2 text-[0.6rem] text-[#3E2F35]/50">{timestamp}</p>}
    </div>
  );
}
