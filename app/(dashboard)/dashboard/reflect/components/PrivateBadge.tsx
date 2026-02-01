"use client";

export default function PrivateBadge() {
  // TODO: Surface collaborator statuses when privacy settings are part of the shared data model.
  return (
    <span className="rounded-full border border-[#E3C6D4] bg-[#FFFAF8]/80 px-3 py-1 text-[0.6rem] uppercase tracking-[0.4em] text-[#A4556A]">
      Private by default
    </span>
  );
}
