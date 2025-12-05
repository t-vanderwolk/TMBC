"use client";

type AdminStatCardProps = {
  title: string;
  value: string | number;
  detail?: string;
};

export default function AdminStatCard({ title, value, detail }: AdminStatCardProps) {
  return (
    <div className="admin-card flex flex-col justify-between rounded-[2rem] border border-[var(--tmbc-gold)] bg-[var(--tmbc-blush)] p-6 shadow-pastel">
      <p className="text-sm uppercase tracking-[0.4em] text-[var(--tmbc-mauve)]">{title}</p>
      <p className="mt-3 text-4xl font-semibold text-[var(--tmbc-charcoal)]">{value}</p>
      {detail && <p className="mt-2 text-xs text-[var(--tmbc-charcoal)]/70">{detail}</p>}
    </div>
  );
}
