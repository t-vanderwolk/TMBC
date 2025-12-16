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
};

export default function ModuleCard({
  href,
  title,
  subtitle,
  estimatedMinutes,
  stage,
  status,
  className = "",
}: ModuleCardProps) {
  return (
    <Link href={href} className={`block ${className}`}>
      <article className="flex flex-col gap-3 rounded-2xl border border-[#E3C6D4] bg-white/95 p-5 shadow-[0_15px_40px_rgba(199,166,199,0.25)] transition hover:-translate-y-0.5 hover:border-[#C8A1B4]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#3E2F35]">{title}</h3>
          <span className="rounded-full border border-[#E3C6D4] px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-[#B98AA5]">
            {status}
          </span>
        </div>
        {subtitle && <p className="text-sm text-[#3E2F35]/70">{subtitle}</p>}
        <ModuleMetaRow stage={stage} estimatedMinutes={estimatedMinutes} />
      </article>
    </Link>
  );
}
