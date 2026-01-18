"use client";

type StatBadgeProps = {
  label: string;
  value?: string | number;
  className?: string;
};

export default function StatBadge({ label, value, className = "" }: StatBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-2 rounded-full border border-member-border-soft bg-member-background-card px-3 py-1 text-[0.65rem]
        uppercase tracking-[0.35em] text-member-accent-primary
        ${className}
      `}
    >
      {value && (
        <span className="text-sm font-semibold text-member-text-primary">{value}</span>
      )}
      <span>{label}</span>
    </span>
  );
}
