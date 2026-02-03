/**
 * MARKETING HERO — SINGLE SOURCE OF TRUTH
 *
 * This component defines the canonical marketing hero.
 * Deviations require explicit design review.
 *
 * It owns the editorial spacing, typography, CTA rhythm, and hero layout guardrails.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { MarketingBody, MarketingHeading, MarketingSupport } from "./Typography";

type MarketingHeroCta = {
  label: string;
  href: string;
  className?: string;
};

/**
 * TMBC HERO LAYOUT RULE — ENFORCEMENT (DO NOT OVERRIDE)
 *
 * Marketing heroes rely on the shared typography, rhythm, and CTAs defined here.
 * Do not add hero ribbon imagery, overlays, or background gradients inside this component.
 * Visual accents belong in surrounding sections or dedicated ribbon components only.
 */

type MarketingHeroProps = {
  eyebrow?: string;
  headline: ReactNode;
  lead: ReactNode;
  primaryCta: MarketingHeroCta;
  secondaryCta?: MarketingHeroCta;
  className?: string;
  textContainerClassName?: string;
  headlineClassName?: string;
  leadClassName?: string;
  ctaContainerClassName?: string;
  microSubhead?: ReactNode;
  microSubheadClassName?: string;
  postLeadMicroLine?: ReactNode;
  postLeadMicroLineClassName?: string;
  heroImage: StaticImageData;
};

// MarketingHero guardrails:
// - Canonical hero height across all marketing pages
// - Single ribbon background (CSS only)
// - Centered hero text + CTA cluster
// - Editorial max-width preserved
export default function MarketingHero({
  eyebrow,
  headline,
  lead,
  primaryCta,
  secondaryCta,
  className = "",
  textContainerClassName = "max-w-[640px]",
  headlineClassName = "",
  leadClassName = "",
  ctaContainerClassName = "mt-10 md:flex-row md:items-center md:gap-6",
  microSubhead,
  microSubheadClassName = "",
  postLeadMicroLine,
  postLeadMicroLineClassName = "",
  heroImage,
}: MarketingHeroProps) {
  const backgroundImageStyle = {
    backgroundImage: `url(${heroImage.src})`,
  };
  return (
    /**
     * MARKETING HERO HEIGHT — LOCKED
     * All marketing heroes must render at identical height
     * to preserve editorial rhythm and prevent layout shift.
     *
     * Do not override height per page.
     * Adjust only here if the system changes.
     */
    <section
      className={`
        relative
        w-full
        min-h-[82vh]
        max-h-[82vh]
        sm:min-h-[86vh]
        sm:max-h-[86vh]
        lg:min-h-[88vh]
        lg:max-h-[88vh]
        bg-[var(--tmbc-ivory)]
        overflow-hidden
        flex
        items-center
        ${className}
      `.trim()}
    >
      {/*
        HERO IMAGE RULES — DO NOT CHANGE:
        1. Only one hero image may render.
        2. Adjacent marketing routes must not recycle the same registry asset.
        3. All hero images must be sourced from the shared `lib/heroImages.ts` registry.
      */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 h-full w-full bg-[length:100%_100%] bg-center bg-no-repeat"
          style={backgroundImageStyle}
        />
      </div>
      <div className="relative z-10 w-full px-6 md:px-10">
        <div
          className={`mx-auto max-w-3xl text-center flex flex-col items-center ${textContainerClassName}`.trim()}
        >
          {eyebrow && (
            <p className="mb-4 text-xs tracking-[0.18em] uppercase text-muted-foreground text-center">
              {eyebrow}
            </p>
          )}
          <MarketingHeading level="h1" className={headlineClassName}>
            {headline}
          </MarketingHeading>
          {microSubhead && <MarketingSupport className={microSubheadClassName}>{microSubhead}</MarketingSupport>}
          <MarketingBody className={`${leadClassName} text-center`.trim()}>{lead}</MarketingBody>
          {postLeadMicroLine && <MarketingSupport className={postLeadMicroLineClassName}>{postLeadMicroLine}</MarketingSupport>}
          <div className={`flex flex-col items-center gap-6 ${ctaContainerClassName}`.trim()}>
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
    </section>
  );
}
