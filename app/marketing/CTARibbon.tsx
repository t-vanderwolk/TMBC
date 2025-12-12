"use client";

import Link from "next/link";

import { greatVibes } from "@/app/fonts";

type CTARibbonProps = {
  headline: string;
  supportingText: string;
  buttonLabel: string;
  buttonHref: string;
};

const CTARibbon = ({ headline, supportingText, buttonLabel, buttonHref }: CTARibbonProps) => {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-mauve)]/80 via-[var(--tmbc-blush)]/80 to-[var(--tmbc-mauve)]/80 p-8 shadow-[0_40px_90px_rgba(199,166,199,0.4)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)] opacity-70" />
      <div className="relative mx-auto flex max-w-screen-xl flex-col items-center gap-4 text-center text-[var(--tmbc-ivory)]">
        <p className={`${greatVibes.className} shimmer text-4xl tracking-[0.4em]`}>{headline}</p>
        <p className="max-w-3xl text-sm uppercase tracking-[0.4em] text-[var(--tmbc-ivory)]/80">{supportingText}</p>
        <Link
          href={buttonHref}
          className="rounded-[32px] border border-[var(--tmbc-gold)] bg-[var(--tmbc-ivory)]/90 px-8 py-3 text-xs font-semibold uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] transition hover:bg-white"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
};

export default CTARibbon;
