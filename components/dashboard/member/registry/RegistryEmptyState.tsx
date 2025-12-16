"use client";

type RegistryEmptyStateProps = {
  title?: string;
  message?: string;
  className?: string;
};

export default function RegistryEmptyState({
  title = "Your registry starts with intention — not urgency.",
  message = "Start with one thoughtful item and we’ll surround it with guidance.",
  className = "",
}: RegistryEmptyStateProps) {
  return (
    <div
      className={`rounded-[26px] border border-dashed border-[#E3C6D4] bg-white/90 p-6 text-center text-sm text-[#3E2F35]/70 shadow-sm ${className}`}
    >
      <p className="text-lg font-semibold text-[#3E2F35]">{title}</p>
      <p className="mt-2">{message}</p>
    </div>
  );
}
