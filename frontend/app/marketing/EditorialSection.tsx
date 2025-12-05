"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import Reveal from "@/components/marketing/Reveal";

type EditorialSectionProps = {
  title: string;
  tagline?: string;
  copy: string;
  image?: ReactNode;
  reverse?: boolean;
  background?: "blush" | "mauve" | "ivory";
  ctaLabel?: string;
  ctaHref?: string;
};

const backgroundMap: Record<NonNullable<EditorialSectionProps["background"]>, string> = {
  blush: "bg-[var(--tmbc-blush)]/40",
  mauve: "bg-[var(--tmbc-mauve)]/20",
  ivory: "bg-[var(--tmbc-ivory)]/80",
};

const EditorialSection = ({
  title,
  tagline,
  copy,
  image,
  reverse = false,
  background = "ivory",
  ctaLabel,
  ctaHref,
}: EditorialSectionProps) => {
  const sectionClass = `${backgroundMap[background]} rounded-[40px] border border-[var(--tmbc-blush)]`;

  return (
    <section className={`${sectionClass} px-6 py-12 shadow-[0_25px_60px_rgba(199,166,199,0.25)]`}>
      <div
        className={`grid gap-10 lg:grid-cols-[0.55fr,0.45fr] ${
          reverse ? "lg:grid-flow-col-dense" : ""
        } lg:items-center`}
      >
        <Reveal variant={reverse ? "slide-right" : "slide-left"}>
          <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[var(--tmbc-blush)]/80 to-[var(--tmbc-mauve)]/40 p-8 shadow-[0_25px_60px_rgba(199,166,199,0.35)]">
            {image ?? (
              <div className="h-64 w-full rounded-[28px] bg-gradient-to-br from-white/80 via-[var(--tmbc-ivory)] to-[var(--tmbc-mauve)]">
                {/* Placeholder imagery */}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal variant="slide-up" className="space-y-6">
          <div>
            {tagline && (
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">{tagline}</p>
            )}
            <h2 className="font-serif text-3xl leading-tight text-[var(--tmbc-charcoal)]">{title}</h2>
          </div>
          <p className="text-lg leading-relaxed text-[var(--tmbc-charcoal)]/80 md:text-xl">{copy}</p>
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-[32px] border border-[var(--tmbc-gold)] bg-white/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] shadow-[0_20px_50px_rgba(199,166,199,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              {ctaLabel}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
};

export default EditorialSection;
