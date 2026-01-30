/**
 * MARKETING HERO — SINGLE SOURCE OF TRUTH
 *
 * This component defines the canonical marketing hero.
 * Deviations require explicit design review.
 *
 * It owns the editorial spacing, typography, CTA rhythm, and hero image locks.
 */

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type MarketingHeroCta = {
  label: string;
  href: string;
  className?: string;
};

type MarketingHeroProps = {
  eyebrow?: string;
  headline: ReactNode;
  lead: ReactNode;
  primaryCta: MarketingHeroCta;
  secondaryCta?: MarketingHeroCta;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  imageSizes?: string;
  priority?: boolean;
  className?: string;
};

export default function MarketingHero({
  eyebrow,
  headline,
  lead,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  imageSizes,
  priority = false,
  className = "",
}: MarketingHeroProps) {
  // This component is intentionally presentation-only to remain Turbopack-safe.
  return (
    <section
      className={`relative overflow-hidden bg-[var(--tmbc-ivory)] pt-24 pb-20 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28 min-h-[70vh] ${className}`.trim()}
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes={imageSizes ?? "100vw"}
          className="h-full w-full object-fill object-right"
          priority={priority}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" aria-hidden="true" />
      <div className="relative z-10 max-w-[640px] px-6 text-left">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.36em] text-[var(--tmbc-charcoal)] text-opacity-60">
            {eyebrow}
          </p>
        )}
        <h1 className="font-playfair text-[64px] leading-[1.05] tracking-[-0.02em] text-[var(--tmbc-charcoal)] sm:text-[72px]">
          {headline}
        </h1>
        <p className="text-lg leading-[1.6] text-[var(--tmbc-charcoal)] text-opacity-70">
          {lead}
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <Link
            href={primaryCta.href}
            className={`mkt-btn mkt-btn-primary uppercase tracking-[0.35em] ${primaryCta.className ?? ""}`.trim()}
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={`text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-80 transition hover:text-[var(--tmbc-mauve)] flex items-center gap-1 ${
                secondaryCta.className ?? ""
              }`.trim()}
            >
              <span>{secondaryCta.label}</span>
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
