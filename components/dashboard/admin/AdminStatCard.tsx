"use client";

import DashboardCard from "@/components/dashboard/ui/DashboardCard";

type AdminStatCardProps = {
  title: string;
  value: string | number;
  detail?: string;
  className?: string;
};

export default function AdminStatCard({ title, value, detail, className = "" }: AdminStatCardProps) {
  return (
    <DashboardCard className={`space-y-3 p-6 ${className}`}>
      <p className="text-xs uppercase tracking-[0.4em] text-[#B98AA5]">{title}</p>
      <p className="text-3xl font-semibold text-[#3E2F35] md:text-4xl">{value}</p>
      {detail && (
        <p className="text-sm text-[#3E2F35]/70 md:text-base">{detail}</p>
      )}
    </DashboardCard>
  );
}
