"use client";

import Link from "next/link";
import ModuleMetaRow from "./ModuleMetaRow";

type ModuleCardProps = {
  href: string;
  title: string;
  subtitle?: string;
  estimatedMinutes?: number | null;
  stage: string;
  status: string;
  className?: string;
  disabled?: boolean;
};

export default function ModuleCard({
  href,
  title,
  subtitle,
  estimatedMinutes,
  stage,
  status,
  className = "",
  disabled = false,
}: ModuleCardProps) {
  const statusIcon = status.toLowerCase().includes("lock") ? "🔒" : "●";
  const statusLower = status.toLowerCase();
  const actionLabel = statusLower.includes("lock")
    ? "Coming next"
    : statusLower.includes("completed")
      ? "Review"
      : statusLower.includes("progress")
        ? "Continue"
        : "Enter";
  const card = (
    <article
      className={`flex min-h-[140px] max-h-[160px] flex-col gap-3 overflow-hidden rounded-2xl bg-white/95 p-5 shadow-[0_15px_40px_rgba(199,166,199,0.18)] transition sm:min-h-0 sm:max-h-none sm:rounded-3xl ${
        disabled ? "opacity-60" : "hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-[#3E2F35]">{title}</h3>
        <span className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.35em] text-[#B98AA5]">
          <span aria-hidden>{statusIcon}</span>
          {status}
        </span>
      </div>
      {subtitle && (
        <p className="max-h-12 overflow-hidden text-sm text-[#3E2F35]/70 sm:max-h-none">
          {subtitle}
        </p>
      )}
      <ModuleMetaRow stage={stage} estimatedMinutes={estimatedMinutes} />
      <div className="text-right text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">
        {actionLabel}
      </div>
    </article>
  );

  if (disabled) {
    return (
      <div className={`block ${className}`} aria-disabled="true">
        {card}
      </div>
    );
  }

  return (
    <Link href={href} className={`block ${className}`}>
      {card}
    </Link>
  );
}
