"use client";

const VARIANT_STYLES: Record<string, string> = {
  default: "bg-[#F5E8EA] text-[#5C3A44]",
  success: "bg-[#D5E9E7] text-[#2C4D48]",
  conflict: "bg-[#F9E0E1] text-[#7D3C4C]",
};

type StatusBadgeProps = {
  label: string;
  variant?: "default" | "success" | "conflict";
};

export default function StatusBadge({ label, variant = "default" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${VARIANT_STYLES[variant]}`}
    >
      {label}
    </span>
  );
}
