"use client";

import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
  accent?: "soft";
};

export default function DashboardCard({ children, className = "", accent }: DashboardCardProps) {
  const accentClass = accent === "soft" ? "bg-[#FFF8F6]" : "bg-white/90";
  return (
    <div
      className={`
        rounded-[28px] border border-[#E3C6D4] ${accentClass} p-6 shadow-[0_25px_60px_rgba(199,166,199,0.15)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
