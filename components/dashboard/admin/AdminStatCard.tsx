"use client";

type AdminStatCardProps = {
  title: string;
  value: string | number;
  detail?: string;
  className?: string;
};

export default function AdminStatCard({ title, value, detail, className = "" }: AdminStatCardProps) {
  return (
    <article
      className={`flex flex-col gap-3 rounded-2xl border border-[var(--tmbc-gold)] bg-[var(--tmbc-blush)] p-6 shadow-sm ${className}`}
    >
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-mauve)]">{title}</p>
      <p className="text-3xl font-semibold text-[var(--tmbc-charcoal)] md:text-4xl">{value}</p>
      {detail && (
        <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70 md:text-base">{detail}</p>
      )}
    </article>
  );
}
