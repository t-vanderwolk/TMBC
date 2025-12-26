"use client";

type RegistryHeaderProps = {
  title?: string;
  subtitle?: string;
  status?: string;
  className?: string;
};

export default function RegistryHeader({
  title = "Your Registry",
  subtitle = "Suggested by your mentor after reviewing your onboarding answers.",
  status,
  className = "",
}: RegistryHeaderProps) {
  return (
    <header
      className={`space-y-2 rounded-[28px] border border-[#E3C6D4] bg-[#FFF9F5] p-5 shadow-sm ${className}`}
    >
      <div className="space-y-1">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">{title}</p>
        <p className="text-sm leading-relaxed text-[#3E2F35]/75">{subtitle}</p>
      </div>
      {status ? (
        <p className="text-[0.75rem] rounded-2xl border border-[#EAD4D8] bg-white/80 px-4 py-2 text-[#3E2F35]/70 shadow-inner">
          {status}
        </p>
      ) : null}
    </header>
  );
}
