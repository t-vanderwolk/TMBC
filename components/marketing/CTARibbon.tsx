"use client";

import Link from "next/link";

import { greatVibes } from "@/lib/fonts";

type CTARibbonProps = {
  headline: string;
  supportingText: string;
  buttonLabel: string;
  buttonHref: string;
  tone?: "strong" | "medium" | "soft";
};

const toneStyles: Record<
  NonNullable<CTARibbonProps["tone"]>,
  { section: string; overlay: string; headline: string; supporting: string; button: string }
> = {
  strong: {
    section:
      "relative overflow-hidden rounded-[40px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-mauve)]/80 via-[var(--tmbc-blush)]/80 to-[var(--tmbc-mauve)]/80 p-8 shadow-[0_40px_90px_rgba(199,166,199,0.4)]",
    overlay:
      "absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)] opacity-70",
    headline: "text-[var(--tmbc-ivory)]",
    supporting: "text-[var(--tmbc-ivory)]/80",
    button:
      "rounded-[32px] border border-[var(--tmbc-gold)] bg-[var(--tmbc-ivory)]/90 px-8 py-3 text-xs font-semibold uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] transition hover:bg-white",
  },
  medium: {
    section:
      "relative overflow-hidden rounded-[40px] border border-[var(--tmbc-mauve)]/40 bg-[var(--tmbc-ivory)]/90 p-7 shadow-[0_24px_55px_rgba(199,166,199,0.2)]",
    overlay:
      "absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)] opacity-40",
    headline: "text-[var(--tmbc-charcoal)]",
    supporting: "text-[var(--tmbc-charcoal)]/70",
    button:
      "rounded-[32px] border border-[var(--tmbc-mauve)]/50 bg-white/90 px-8 py-3 text-xs font-semibold uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] transition hover:bg-white",
  },
  soft: {
    section:
      "relative overflow-hidden rounded-[40px] border border-[var(--tmbc-mauve)]/30 bg-[var(--tmbc-ivory)]/85 p-6 shadow-[0_18px_40px_rgba(199,166,199,0.18)]",
    overlay:
      "absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_65%)] opacity-30",
    headline: "text-[var(--tmbc-charcoal)]",
    supporting: "text-[var(--tmbc-charcoal)]/60",
    button:
      "rounded-[32px] border border-[var(--tmbc-mauve)]/40 bg-white/80 px-8 py-3 text-xs font-semibold uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] transition hover:bg-white",
  },
};

const CTARibbon = ({ headline, supportingText, buttonLabel, buttonHref, tone = "strong" }: CTARibbonProps) => {
  const styles = toneStyles[tone];
  return (
    <section className={styles.section}>
      <div className={styles.overlay} />
      <div className={`relative mx-auto flex max-w-screen-xl flex-col items-center gap-4 text-center ${styles.headline}`}>
        <p className={`${greatVibes.className} shimmer text-3xl tracking-[0.4em] sm:text-4xl`}>{headline}</p>
        <p className={`max-w-3xl text-sm uppercase tracking-[0.4em] ${styles.supporting}`}>{supportingText}</p>
        <Link
          href={buttonHref}
          className={styles.button}
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
};

export default CTARibbon;
