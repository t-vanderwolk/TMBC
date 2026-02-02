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
import { MarketingBody, MarketingHeading, MarketingSupport } from "./Typography";

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
  textContainerClassName?: string;
  headlineClassName?: string;
  leadClassName?: string;
  ctaContainerClassName?: string;
  microSubhead?: ReactNode;
  microSubheadClassName?: string;
  postLeadMicroLine?: ReactNode;
  postLeadMicroLineClassName?: string;
  imageClassName?: string;
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
  textContainerClassName = "max-w-[640px] px-6 md:px-8",
  headlineClassName = "",
  leadClassName = "",
  ctaContainerClassName = "mt-6 md:mt-8",
  microSubhead,
  microSubheadClassName = "",
  postLeadMicroLine,
  postLeadMicroLineClassName = "",
  imageClassName = "",
}: MarketingHeroProps) {
  return (
    <section
      className={`relative overflow-hidden bg-[var(--tmbc-ivory)] pt-28 md:pt-32 pb-24 md:pb-28 min-h-[70vh] flex items-center ${className}`.trim()}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes={imageSizes ?? "100vw"}
        className={`absolute inset-0 h-full w-full object-fill object-right ${imageClassName}`.trim()}
        priority={priority}
      />
      <div className="relative z-10 w-full">
        <div className="mkt-container">
          <div className={`relative z-10 text-left ${textContainerClassName}`.trim()}>
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.36em] text-[var(--tmbc-charcoal)] text-opacity-60">
                {eyebrow}
              </p>
            )}
            <MarketingHeading level="h1" className={headlineClassName}>
              {headline}
            </MarketingHeading>
            {microSubhead && <MarketingSupport className={microSubheadClassName}>{microSubhead}</MarketingSupport>}
            <MarketingBody className={leadClassName}>{lead}</MarketingBody>
            {postLeadMicroLine && <MarketingSupport className={postLeadMicroLineClassName}>{postLeadMicroLine}</MarketingSupport>}
            <div className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-6 ${ctaContainerClassName}`.trim()}>
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
        </div>
      </div>
    </section>
  );
}
