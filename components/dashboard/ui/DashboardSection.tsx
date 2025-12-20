"use client";

import type { ReactNode } from "react";

type DashboardSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export default function DashboardSection({
  eyebrow,
  title,
  description,
  action,
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          {eyebrow && (
            <p className="text-[0.6rem] uppercase tracking-[0.45em] text-[#C8A1B4]">{eyebrow}</p>
          )}
          <h2 className="text-xl font-semibold text-[#3E2F35]">{title}</h2>
          {description && (
            <p className="text-sm text-[#3E2F35]/70">{description}</p>
          )}
        </div>
        {action && <div className="flex items-center">{action}</div>}
      </div>
      {children}
    </section>
  );
}
