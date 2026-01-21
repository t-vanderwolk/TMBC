"use client";

import Link from "next/link";

type CTARibbonProps = {
  headline: string;
  supportingText: string;
  buttonLabel: string;
  buttonHref: string;
  tone?: "strong" | "medium" | "soft";
};

const toneStyles: Record<NonNullable<CTARibbonProps["tone"]>, string> = {
  strong: "ring-1 ring-[var(--tmbc-charcoal)]/10",
  medium: "ring-1 ring-[var(--tmbc-mauve)]/20",
  soft: "ring-1 ring-[var(--tmbc-mauve)]/30",
};

const CTARibbon = ({ headline, supportingText, buttonLabel, buttonHref, tone = "strong" }: CTARibbonProps) => {
  const variantClass = toneStyles[tone];
  return (
    <section className={`mkt-card ${variantClass} text-center`}>
      <div className="space-y-5">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Rest when it feels right
        </p>
        <p className="font-serif text-3xl leading-tight text-[var(--tmbc-charcoal)]">{headline}</p>
        <p className="mx-auto max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-75">{supportingText}</p>
        <Link href={buttonHref} className="mkt-btn-primary">
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
};

export default CTARibbon;
