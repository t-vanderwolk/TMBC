import Link from 'next/link';
import type { ReactNode } from 'react';

import PlaceholderImageCard from '@/components/marketing/PlaceholderImageCard';

type MarketingHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  supportingText: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const MarketingHero = ({
  eyebrow,
  title,
  description,
  supportingText,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: MarketingHeroProps) => {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-[var(--tmbc-mauve)] bg-gradient-to-br from-[var(--tmbc-ivory)] via-[var(--tmbc-blush)] to-[var(--tmbc-mauve)/60] p-8 shadow-soft md:p-12">
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--tmbc-mauve)/30] to-transparent" aria-hidden />
      <div className="relative space-y-6 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/70">{eyebrow}</p>
        <div>
          <h1 className="font-serif text-4xl leading-tight text-[var(--tmbc-charcoal)] md:text-5xl">
            {title}
          </h1>
          <div className="mt-3 h-1 w-32 rounded-full bg-[var(--tmbc-gold)]" />
        </div>
        <p className="text-lg text-[var(--tmbc-charcoal)]/80">{description}</p>
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:justify-start">
          <Link
            href={ctaHref}
            className="rounded-full bg-[var(--tmbc-charcoal)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-black/80"
          >
            {ctaLabel}
          </Link>
          {secondaryCtaLabel && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className="rounded-full border border-[var(--tmbc-charcoal)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)] hover:text-[var(--tmbc-mauve)]"
            >
              {secondaryCtaLabel}
            </Link>
          )}
        </div>
        <p className="text-sm uppercase tracking-[0.15em] text-[var(--tmbc-charcoal)]/70">{supportingText}</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <PlaceholderImageCard className="md:col-span-2" />
        <div className="grid gap-5">
          <PlaceholderImageCard />
          <PlaceholderImageCard />
        </div>
      </div>
    </section>
  );
};

export default MarketingHero;
