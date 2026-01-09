"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";

interface MarketingHeroCta {
  label: string;
  href: string;
  className?: string;
}

interface MarketingHeroProps {
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  headline: string;
  supportingText: ReactNode;
  primaryCta: MarketingHeroCta;
  secondaryCta?: MarketingHeroCta;
  priority?: boolean;
}

const DEFAULT_PRIMARY_CLASSES =
  "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]";
const DEFAULT_SECONDARY_CLASSES =
  "marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]";

const MOBILE_HERO_SOURCES: Record<string, string> = {
  "/": "/assets/images/hero-marketing-signature-mobile.png",
  "/how-it-works": "/assets/images/hero-marketing-signature-mobile.png",
  "/learn": "/assets/images/section-background-learning-flow-mobile.png",
  "/plan": "/assets/images/section-background-soft-ribbon-mobile.png",
  "/connect": "/assets/images/section-background-soft-ribbon-mobile.png",
  "/reflect": "/assets/images/section-background-soft-ribbon-mobile.png",
  "/membership": "/assets/images/section-background-soft-ribbon-mobile.png",
  "/blog": "/assets/images/section-background-soft-ribbon-mobile.png",
  "/about": "/assets/images/hero-marketing-signature-mobile.png",
  "/contact": "/assets/images/hero-marketing-signature-mobile.png",
  "/faq": "/assets/images/hero-marketing-signature-mobile.png",
};

export default function MarketingHero({
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  headline,
  supportingText,
  primaryCta,
  secondaryCta,
  priority = false,
}: MarketingHeroProps) {
  const pathname = usePathname();
  const normalizedPathname =
    pathname && pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  const mobileHeroSrc = normalizedPathname ? MOBILE_HERO_SOURCES[normalizedPathname] : undefined;

  return (
    <>
      <section
        className="
          relative overflow-hidden
          w-screen left-1/2 right-1/2
          -ml-[50vw]
          -mr-[50vw]
          min-h-[85vh]
          md:min-h-[72vh]
          pt-24
          md:pt-32
          pb-16
          md:pb-20
          mb-16
          md:mb-20
        "
      >
        <div className="absolute inset-0">
          <picture className="h-full w-full">
            {mobileHeroSrc && (
              <source media="(max-width: 768px)" srcSet={mobileHeroSrc} />
            )}
            <img
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              className="h-full w-full object-cover"
              style={{ objectPosition: "top" }}
            />
          </picture>
        </div>
        <div className="absolute inset-0 bg-[var(--tmbc-ivory)]/70" aria-hidden />

        <div className="relative z-10 flex w-full min-h-[85vh] flex-col items-center justify-center gap-12 px-6 pt-4 pb-8 text-center md:py-0 md:px-12">
          <div className="hero-copy space-y-6">
            <h1 className="hero-headline">{headline}</h1>
            <p className="hero-supporting mt-6">{supportingText}</p>
            <div className="hero-cta hero-cta-group">
              <Link className={primaryCta.className ?? DEFAULT_PRIMARY_CLASSES} href={primaryCta.href}>
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <Link className={secondaryCta.className ?? DEFAULT_SECONDARY_CLASSES} href={secondaryCta.href}>
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
