import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Button = {
  label: string;
  href: string;
};

type HeroProps = {
  eyebrow?: string;
  heading: ReactNode;
  subheading: ReactNode;
  body?: ReactNode;
  primaryCta: Button;
  secondaryCta: Button;
  microcopy: ReactNode;
  imageSrc: string;
  imageAlt: string;
};

export default function Hero({
  eyebrow,
  heading,
  subheading,
  body,
  primaryCta,
  secondaryCta,
  microcopy,
  imageSrc,
  imageAlt,
}: HeroProps) {
  return (
    <div className="relative w-full">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8">
          {eyebrow && (
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-[18ch] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--tmbc-charcoal)] sm:text-5xl lg:text-[56px]">
            {heading}
          </h1>
          <p className="max-w-[52ch] text-lg text-[var(--tmbc-charcoal)]/80">{subheading}</p>
          {body && (
            <p className="max-w-[60ch] text-base leading-relaxed text-[var(--tmbc-charcoal)]/70">{body}</p>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href={primaryCta.href}
              className="rounded-full bg-[var(--tmbc-blush)]/70 px-7 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-[var(--tmbc-charcoal)] shadow-sm transition hover:bg-[var(--tmbc-blush)]/80 hover:shadow-lg"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/70 transition hover:text-[var(--tmbc-charcoal)] hover:underline underline-offset-4"
            >
              {secondaryCta.label}
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--tmbc-charcoal)]/55">{microcopy}</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex h-[520px] w-full items-center justify-center rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)] p-6 lg:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.06)]">
            <div className="h-full w-full">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={1536}
                height={1024}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
