"use client";

import Image from "next/image";
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
          py-24
          md:py-32
          flex
          items-center
          bg-[#FBF7F4]
          mb-24 md:mb-28
        "
      >
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="w-full h-full object-contain"
            sizes="100vw"
            priority={priority}
            style={{ objectPosition: "top" }}
          />
        </div>

        <div className="relative z-10 flex w-full min-h-[85vh] flex-col items-center justify-start gap-12 px-6 pt-4 pb-8 text-center md:py-0 md:px-12 md:justify-center">
          <div className="hero-copy space-y-6 max-w-[90%] md:max-w-[560px]">
            <h1 className="hero-headline">{headline}</h1>
            <p className="hero-supporting mt-6">{supportingText}</p>
            <div className="hero-cta hero-cta-group mt-10 hidden md:mt-0 md:flex md:flex-row md:items-center md:gap-4">
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

      <section className="md:hidden px-6 py-0 mt-6 mb-10">
        <div className="hero-cta hero-cta-group flex flex-col gap-4">
          <Link className={primaryCta.className ?? DEFAULT_PRIMARY_CLASSES} href={primaryCta.href}>
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link className={secondaryCta.className ?? DEFAULT_SECONDARY_CLASSES} href={secondaryCta.href}>
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
