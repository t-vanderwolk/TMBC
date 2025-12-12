"use client";

interface RegistrySummaryProps {
  totalItems: number;
  essentials: number;
  niceToHave: number;
}

export default function RegistrySummary({ totalItems, essentials, niceToHave }: RegistrySummaryProps) {
  return (
    <section className="rounded-[32px] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.2)]">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]/70">Registry snapshot</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[26px] border border-[#E3C6D4] bg-[#FFFAF8]/70 p-4 text-sm">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">Total items</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{totalItems}</p>
        </div>
        <div className="rounded-[26px] border border-[#E3C6D4] bg-white p-4 text-sm">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">Essentials</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{essentials}</p>
        </div>
        <div className="rounded-[26px] border border-[#E3C6D4] bg-white p-4 text-sm">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">Nice-to-haves</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{niceToHave}</p>
        </div>
      </div>
    </section>
  );
}
