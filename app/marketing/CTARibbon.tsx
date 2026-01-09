"use client";

import Link from "next/link";

type CTARibbonProps = {
  headline: string;
  supportingText: string;
  buttonLabel: string;
  buttonHref: string;
};

export default function CTARibbon({ headline, supportingText, buttonLabel, buttonHref }: CTARibbonProps) {
  return (
    <section className="marketing-card text-center">
      <div className="space-y-5">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Rest when it feels right
        </p>
        <p className="font-serif text-3xl leading-tight text-[var(--tmbc-charcoal)]">{headline}</p>
        <p className="mx-auto max-w-3xl text-sm text-[var(--tmbc-charcoal)] text-opacity-75">{supportingText}</p>
        <Link
          href={buttonHref}
          className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
