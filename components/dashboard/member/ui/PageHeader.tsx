"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: {
    label: string;
    href: string;
  };
  children?: ReactNode;
  className?: string;
};

export default function PageHeader({
  title,
  subtitle,
  description,
  cta,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={`space-y-3 rounded-[28px] border border-[#EAD4D8] bg-white/90 p-5 shadow-sm transition ${className}`}
    >
      <div className="space-y-1">
        {subtitle && (
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">{subtitle}</p>
        )}
        <h1 className="font-serif text-3xl text-[#3E2F35] md:text-4xl tracking-tight">{title}</h1>
        {description && <p className="text-sm text-[#3E2F35]/75">{description}</p>}
      </div>
      {cta && (
        <Link href={cta.href}>
          <div className="flex w-full items-center justify-center rounded-2xl border border-[#C8A1B4] bg-[#FEF8F5] px-4 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#3E2F35] transition hover:border-[#B98AA5]">
            {cta.label}
          </div>
        </Link>
      )}
      {children}
    </header>
  );
}
