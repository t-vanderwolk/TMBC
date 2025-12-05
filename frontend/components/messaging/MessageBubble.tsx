"use client";

type MessageBubbleProps = {
  sender: "self" | "mentor";
  text: string;
  time: string;
};

const MessageBubble = ({ sender, text, time }: MessageBubbleProps) => {
  const isSelf = sender === "self";
  return (
    <div
      className={`flex flex-col gap-1 ${isSelf ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-[28px] px-5 py-3 text-sm leading-relaxed transition-all duration-150 ${
          isSelf
            ? "bg-[var(--tmbc-mauve)]/80 text-[var(--tmbc-ivory)]"
            : "bg-white border border-[var(--tmbc-mauve)]/40 text-[var(--tmbc-charcoal)]"
        }`}
      >
        {text}
      </div>
      <span className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/50">
        {time}
      </span>
    </div>
  );
};

export default MessageBubble;
