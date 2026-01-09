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
  blush: "bg-[var(--tmbc-blush)]/20",
  mauve: "bg-[var(--tmbc-mauve)]/15",
  ivory: "bg-[var(--tmbc-ivory)]/90",
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
const sectionClass = `${backgroundMap[background]} rounded-[34px] border border-[rgba(62,47,53,0.12)]`;

  return (
    <section className={`${sectionClass} px-6 py-12 marketing-section`}>
      <div
        className={`grid gap-10 lg:grid-cols-[0.55fr,0.45fr] ${
          reverse ? "lg:grid-flow-col-dense" : ""
        } lg:items-center`}
      >
        <Reveal variant={reverse ? "slide-right" : "slide-left"}>
        <div className="overflow-hidden rounded-[28px] border border-[rgba(62,47,53,0.12)] bg-white/90 p-6">
            {image ?? (
              <div className="h-64 w-full rounded-[24px] bg-[var(--tmbc-ivory)]/80">
                {/* Placeholder imagery */}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal variant="slide-up" className="space-y-6">
          <div>
            {tagline && (
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">{tagline}</p>
            )}
            <h2 className="font-serif text-3xl leading-tight text-[var(--tmbc-charcoal)]">{title}</h2>
          </div>
          <p className="text-lg leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-80 md:text-xl">{copy}</p>
          {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="marketing-btn marketing-btn-secondary uppercase tracking-[0.3em]"
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
