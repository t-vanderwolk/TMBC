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
      <p className="text-xs uppercase tracking-[0.4em] text-member-accent-secondary">{title}</p>
      <p className="text-3xl font-semibold text-member-text-primary md:text-4xl">{value}</p>
      {detail && (
        <p className="text-sm text-member-text-secondary md:text-base">{detail}</p>
      )}
    </DashboardCard>
  );
}
