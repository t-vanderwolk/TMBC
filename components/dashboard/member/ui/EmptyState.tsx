"use client";

type EmptyStateProps = {
  title: string;
  message: string;
  className?: string;
};

export default function EmptyState({ title, message, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`rounded-[24px] border border-dashed border-[#E3C6D4] bg-[#FFF8F6] p-5 text-sm text-[#3E2F35]/70 ${className}`}
    >
      <p className="text-lg font-semibold text-[#3E2F35]">{title}</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}
