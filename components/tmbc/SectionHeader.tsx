"use client";

import type { ReactNode } from "react";

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function SectionHeader({ title, subtitle, actions }: SectionHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#C7A6C9]">{title}</p>
        {subtitle && <p className="text-sm text-[#3E2F35]/70">{subtitle}</p>}
      </div>
      {actions}
    </header>
  );
}
