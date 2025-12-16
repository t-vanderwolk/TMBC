"use client";

import { useEffect, useMemo, useState } from "react";

import { loadStoredUser } from "@/lib/auth/userStore";

type MemberWelcomeHeaderProps = {
  userName?: string | null;
  tone?: string;
  intention?: string;
  highlight?: string;
};

export default function MemberWelcomeHeader({
  userName,
  tone,
  intention,
  highlight,
}: MemberWelcomeHeaderProps) {
  const [clientName, setClientName] = useState<string | null>(null);
  const toneLine =
    tone ?? "A calm check-in, speaking softly to whatever feels tender today.";
  const intentionLine =
    intention ?? "We're honoring the pace you set, not a checklist.";
  const highlightMessage =
    highlight ?? "Taylor-Made Baby Co. is holding space for your bloom.";

  useEffect(() => {
    const stored = loadStoredUser();
    if (stored?.firstName || stored?.name) {
      setClientName(stored?.firstName ?? stored?.name ?? null);
    }
  }, []);

  const safeName = useMemo(() => {
    const sourceName = clientName ?? userName;
    if (!sourceName) return "Friend";
    return sourceName.trim() || "Friend";
  }, [clientName, userName]);

  return (
    <section className="rounded-2xl border border-[#F3DDE4] bg-gradient-to-br from-[#FFF8F6] via-[#FCEAF0] to-[#F6E0E6] px-6 py-8 shadow-sm md:px-8 md:py-10">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Daily check-in</p>
      <h1 className="mt-3 text-3xl font-serif text-[#3E2F35] md:text-4xl">
        Good morning,{" "}
        <span suppressHydrationWarning className="font-semibold text-[#3E2F35]">
          {safeName}
        </span>
        .
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#3E2F35]/70 md:text-base">
        {toneLine} {intentionLine}
      </p>
      <div className="mt-6 rounded-2xl bg-[#fffaf7]/90 px-5 py-4 text-[#3E2F35] shadow-inner shadow-white/60">
        <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]">Studio mantra</p>
        <p className="mt-2 text-lg font-semibold md:text-xl">{highlightMessage}</p>
      </div>
    </section>
  );
}
