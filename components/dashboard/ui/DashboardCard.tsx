"use client";

import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "soft";
};

export default function DashboardCard({ children, className = "", variant }: DashboardCardProps) {
  const variantClass = variant === "soft" ? "bg-[#FFF8F6]" : "bg-white/90";
  return (
    <div
      className={`
        rounded-[2rem] border border-[#EAD4D8] ${variantClass} p-6 shadow-[0_25px_60px_rgba(84,35,52,0.12)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
