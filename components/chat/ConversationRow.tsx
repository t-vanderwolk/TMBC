"use client";

import type { RoleType } from "@/types/chat";
import type { ConversationSummary } from "@/types/chat";

type ConversationRowProps = {
  summary: ConversationSummary;
  viewerRole: RoleType;
  selected?: boolean;
  onSelect: (summary: ConversationSummary) => void;
};

const formatTimestamp = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  });
};

const getDisplayName = (summary: ConversationSummary, viewerRole: RoleType) => {
  if (viewerRole === "MEMBER") {
    return summary.mentor?.name ?? "Your mentor";
  }
  return summary.member?.name ?? "Member";
};

const ConversationRow = ({
  summary,
  viewerRole,
  selected = false,
  onSelect,
}: ConversationRowProps) => {
  const otherName = getDisplayName(summary, viewerRole);
  const preview = summary.lastMessage ?? "Touch base with your mentor when you're ready.";
  const timestamp = summary.lastMessageAt ?? null;
  const unread = Boolean(
    summary.lastMessageSenderRole && summary.lastMessageSenderRole !== viewerRole,
  );
  const mentorHighlight =
    viewerRole === "MEMBER" && summary.lastMessageSenderRole === "MENTOR";

  return (
    <button
      type="button"
      onClick={() => onSelect(summary)}
      className={`flex w-full items-start justify-between gap-3 rounded-[22px] px-4 py-3 text-left transition ${
        selected
          ? "bg-[#FBE9EE]"
          : mentorHighlight
            ? "border border-[#E3C6D4] bg-[#FFF8F6]"
            : "bg-white hover:bg-[#FFF8F6]"
      }`}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-serif text-[#3E2F35]">{otherName}</span>
        <p className="max-w-[240px] text-[0.9rem] text-[#3E2F35]/70">{preview}</p>
      </div>
      <div className="flex flex-col items-end gap-1 text-right">
        <span className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/60">
          {formatTimestamp(timestamp)}
        </span>
        {unread && (
          <span
            className={`h-2 w-2 rounded-full ${mentorHighlight ? "bg-[#B98AA5]" : "bg-[#C8A1B4]"}`}
            aria-hidden
          />
        )}
      </div>
    </button>
  );
};

export default ConversationRow;
