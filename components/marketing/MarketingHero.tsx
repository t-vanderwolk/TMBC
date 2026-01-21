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

  return (
    <Section className={`bg-[var(--tmbc-ivory)] ${className}`.trim()}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-[560px] space-y-6">
          {eyebrow && (
            <p className="text-[11px] tracking-[0.34em] uppercase text-neutral-500 mb-6">{eyebrow}</p>
          )}
          <h1 className="text-[48px] leading-[0.95] sm:text-[64px] sm:leading-[0.92] tracking-[-0.02em]">
            {headline}
          </h1>
          <p className="mkt-h2">{subheading}</p>
          {bodyContent}
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
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
        <div className="flex items-center justify-center">
          <ImageFrame
            className="w-full rounded-[32px] overflow-hidden bg-white/60 ring-1 ring-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
          >
            <div className="aspect-[16/10] sm:aspect-[4/5] w-full">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="h-full w-full object-cover"
              />
            </div>
          </ImageFrame>
        </div>
      </div>
    </Section>
  );
}
