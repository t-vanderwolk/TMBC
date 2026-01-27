/**
 * MARKETING HERO — SINGLE SOURCE OF TRUTH
 *
 * This is the ONLY marketing hero component.
 * It owns:
 * - Editorial spacing & rhythm
 * - Typography hierarchy
 * - Navbar adjacency behavior
 * - Image containment rules (desktop/mobile)
 *
 * Do not recreate hero layouts elsewhere.
 * Do not wrap this component.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from "react";

import Section from "@/components/marketing/Section";
import ImageFrame from "@/components/marketing/ImageFrame";

type MarketingHeroCta = {
  label: string;
  href: string;
  className?: string;
};

type MarketingHeroProps = {
  eyebrow?: string;
  headline: ReactNode;
  subheading: ReactNode;
  body?: ReactNode;
  microcopy?: ReactNode;
  primaryCta: MarketingHeroCta;
  secondaryCta?: MarketingHeroCta;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  priority?: boolean;
  motion?: boolean;
  className?: string;
};

export default function MarketingHero({
  eyebrow,
  headline,
  subheading,
  body,
  microcopy,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  priority = false,
  className = "",
}: MarketingHeroProps) {
  const bodyParagraphClass = "text-[16px] sm:text-[18px] leading-relaxed text-neutral-600";
  const bodyContent = body ? (
    <div className="mt-6 space-y-5">
      {Children.map(body, (child, index) => {
        if (typeof child === "string" || typeof child === "number") {
          return (
            <p key={`${index}-${child}`} className={bodyParagraphClass}>
              {child}
            </p>
          );
        }

        if (isValidElement(child)) {
          if (typeof child.type === "string" && child.type === "p") {
            const paragraph = child as ReactElement;
            return cloneElement(paragraph, {
              className: `${bodyParagraphClass} ${paragraph.props.className ?? ""}`.trim(),
            });
          }
          return child;
        }

        return child;
      })}
    </div>
  ) : null;

  // Section wraps hero copy so layout/padding stays aligned with the rest of the marketing content.
  return (
    <Section className={`bg-[var(--tmbc-ivory)] ${className}`.trim()}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Mobile spacing refinement — do not affect desktop */}
        <div className="order-2 lg:order-1 max-w-[560px] space-y-6 pt-6 sm:pt-8">
          {eyebrow && (
            <p className="text-[11px] tracking-[0.18em] sm:tracking-[0.34em] uppercase text-neutral-500 mb-3">
              {eyebrow}
            </p>
          )}
          <h1
            className="font-playfair text-[80px] leading-[1.05] sm:text-[110px] sm:leading-[1] tracking-[-0.02em] mb-4 sm:mb-5"
          >
            {headline}
          </h1>
          <p className="mkt-h2 mt-3 sm:mt-4 leading-[1.5]">{subheading}</p>
          {bodyContent}
          {/* CTA separation on tight screens */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 pb-8 sm:pb-10">
            <Link
              href={primaryCta.href}
              className={`mkt-btn-primary h-12 rounded-full px-6 text-sm font-semibold ${
                primaryCta.className ?? ""
              }`.trim()}
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={`mkt-link-secondary h-12 rounded-full px-6 text-sm font-semibold ${
                  secondaryCta.className ?? ""
                }`.trim()}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
          {microcopy && (
            <p className="mt-8 text-[12px] tracking-[0.22em] uppercase text-neutral-500">{microcopy}</p>
          )}
        </div>
        <div className="order-1 lg:order-2 flex items-center justify-center">
          <ImageFrame
            className="w-full rounded-[32px] overflow-hidden bg-white/60 ring-1 ring-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
          >
            <div className="aspect-[16/10] sm:aspect-[4/5] w-full">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="h-full w-full object-contain"
                priority={priority}
              />
            </div>
          </ImageFrame>
        </div>
      </div>
    </Section>
  );
}
