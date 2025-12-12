import type { ReactNode } from "react";

export type CapsuleCardProps = {
  title: string;
  type: string;
  preview: string;
  scheduledFor?: string;
  isPrivate?: boolean;
  actions?: ReactNode;
};

export default function CapsuleCard({
  title,
  type,
  preview,
  scheduledFor,
  isPrivate = true,
  actions,
}: CapsuleCardProps) {
  return (
    <article className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#C7A6C9]">
        <span>{type}</span>
        <span>{isPrivate ? "Private" : "Shared"}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-[#3E2F35]">{title}</h3>
      <p className="mt-2 text-sm text-[#3E2F35]/70">{preview}</p>
      {scheduledFor && (
        <p className="mt-2 text-xs text-[#3E2F35]/60">Scheduled for {scheduledFor}</p>
      )}
      {actions && <div className="mt-4 flex flex-wrap gap-3">{actions}</div>}
    </article>
  );
}
