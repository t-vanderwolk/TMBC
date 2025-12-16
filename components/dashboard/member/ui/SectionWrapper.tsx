"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type SectionWrapperProps = {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    subtle?: boolean;
  };
  children: ReactNode;
  className?: string;
};

export default function SectionWrapper({
  title,
  description,
  action,
  children,
  className = "",
}: SectionWrapperProps) {
  return (
    <section
      className={`space-y-4 rounded-[28px] border border-[#E3C6D4] bg-white/90 p-5 shadow-sm ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#3E2F35]">{title}</h2>
          {description && <p className="text-sm text-[#3E2F35]/70">{description}</p>}
        </div>
        {action && (
          <Link
            href={action.href}
            className={`text-xs font-semibold uppercase tracking-[0.35em] transition ${
              action.subtle
                ? "text-[#3E2F35]/70 hover:text-[#3E2F35]"
                : "text-[#B98AA5] hover:text-[#3E2F35]"
            }`}
          >
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
