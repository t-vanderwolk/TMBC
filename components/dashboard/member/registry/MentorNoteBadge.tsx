"use client";

type MentorNoteBadgeProps = {
  note?: string | null;
  mentorName?: string | null;
  className?: string;
};

export default function MentorNoteBadge({
  note,
  mentorName,
  className = "",
}: MentorNoteBadgeProps) {
  if (!note) {
    return null;
  }
  return (
    <div
      className={`space-y-1 rounded-2xl border border-[#E3C6D4] bg-[#FFF8F6] p-3 text-sm text-[#3E2F35]/80 shadow-inner ${className}`}
    >
      <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Mentor note</p>
      <p className="leading-relaxed text-[#3E2F35]/90">{note}</p>
      <p className="text-[0.65rem] text-[#3E2F35]/60">
        {mentorName ? `— ${mentorName}` : "— Mentor"}
      </p>
    </div>
  );
}
