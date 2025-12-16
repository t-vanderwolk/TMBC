"use client";

import MentorNoteBadge from "./MentorNoteBadge";
import RegistryActionMenu from "./RegistryActionMenu";

type RegistryItemCardProps = {
  image?: string | null;
  name: string;
  category?: string | null;
  reason?: string | null;
  statusLabel?: string;
  mentorNote?: string | null;
  mentorName?: string | null;
  className?: string;
};

const STATUS_DISPLAY: Record<string, string> = {
  ADDED: "Added",
  ACTIVE: "Added",
  PENDING: "Considering",
  CONSIDERING: "Considering",
  PURCHASED: "Purchased",
};

export default function RegistryItemCard({
  image,
  name,
  category,
  reason,
  statusLabel,
  mentorNote,
  mentorName,
  className = "",
}: RegistryItemCardProps) {
  const status = statusLabel ? STATUS_DISPLAY[statusLabel] ?? statusLabel : "Considering";

  return (
    <article
      className={`space-y-4 rounded-[28px] border border-[#E3C6D4] bg-white/95 p-4 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-[#FFF8F6]">
            {image ? (
              <img src={image} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">
                Photo
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-[#3E2F35]">{name}</p>
            {category && (
              <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">{category}</p>
            )}
          </div>
        </div>
        <RegistryActionMenu />
      </div>
      {reason && (
        <p className="text-sm leading-relaxed text-[#3E2F35]/75">{reason}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="rounded-2xl border border-[#E3C6D4] px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-[#B98AA5]">
          {status}
        </span>
        <MentorNoteBadge note={mentorNote} mentorName={mentorName} />
      </div>
    </article>
  );
}
