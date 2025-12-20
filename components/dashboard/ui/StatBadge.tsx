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
        inline-flex items-center gap-2 rounded-full border border-[#E3D0DA] bg-white/80 px-3 py-1 text-[0.65rem]
        uppercase tracking-[0.35em] text-[#B98AA5]
        ${className}
      `}
    >
      {value && <span className="text-sm font-semibold text-[#3E2F35]">{value}</span>}
      <span>{label}</span>
    </span>
  );
}
