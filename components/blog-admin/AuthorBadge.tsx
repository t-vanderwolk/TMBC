"use client";

type AuthorBadgeProps = {
  authorName: string;
  authorRole?: "ADMIN" | "MENTOR";
};

export default function AuthorBadge({ authorName, authorRole }: AuthorBadgeProps) {
  const roleLabel = authorRole ? authorRole.toLowerCase() : "mentor";
  return (
    <div className="flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-[#A4556A]">
      <span className="font-semibold text-[#3E2F35]">{authorName}</span>
      <span className="rounded-full border border-[#E3C6D4] px-3 py-1 text-xs tracking-[0.4em] text-[#A4556A]">
        {roleLabel}
      </span>
    </div>
  );
}
