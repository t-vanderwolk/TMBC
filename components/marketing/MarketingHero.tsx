"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { greatVibes } from "@/lib/fonts";
import Reveal from "@/components/marketing/Reveal";
import VisualPlaceholder from "@/components/marketing/VisualPlaceholder";

type CTA = {
  label: string;
  href: string;
};

type MarketingHeroProps = {
  eyebrow?: string;
  scriptLine: string;
  title: string;
  subtitle: string;
  description?: string;
  primaryCTA: CTA;
  secondaryCTA?: CTA;
  supportingCopy?: string;
  backgroundImage?: string;
  backgroundLabel?: string;
  backgroundAssetPath?: string;
  backgroundPage?: string;
  backgroundSection?: string;
  backgroundPriority?: "low" | "med" | "high";
};

const heroVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

// TMBC Canon:
// Marketing reflects mentor-led planning.
// We do not promise automation the app does not deliver.
const MarketingHero = ({
  eyebrow = "Taylor-Made Baby Co.",
  scriptLine,
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  supportingCopy,
  backgroundImage,
  backgroundLabel,
  backgroundAssetPath,
  backgroundPage,
  backgroundSection,
  backgroundPriority,
}: MarketingHeroProps) => {
  const resolvedLabel = backgroundLabel ?? `${title} - hero background`;
  const resolvedAssetPath = backgroundAssetPath ?? backgroundImage ?? "TBD";
  const resolvedSection = backgroundSection ?? "Hero Background";

  return (
    <section
      className="relative overflow-hidden rounded-[48px] border border-[var(--tmbc-gold)/60] bg-[var(--tmbc-ivory)] p-6 shadow-[0_40px_120px_rgba(199,165,196,0.35)] marketing-section"
    >
      <VisualPlaceholder
        label={resolvedLabel}
        page={backgroundPage}
        section={resolvedSection}
        assetPath={resolvedAssetPath}
        priority={backgroundPriority}
        className="absolute inset-0 -z-10 pointer-events-none"
      />
      <div className="absolute inset-y-12 left-6 w-px rounded-full bg-gradient-to-b from-transparent via-[var(--tmbc-gold)] to-transparent" />

      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-6 py-12 text-[var(--tmbc-charcoal)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70">{eyebrow}</p>

        <Reveal className={`${greatVibes.className} floating-script text-3xl sm:text-4xl`}>
          {scriptLine}
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={heroVariant}
          transition={{ duration: 0.9 }}
          className="space-y-4"
        >
          <Reveal variant="slide-right">
            <h1 className="font-serif text-4xl leading-tight tracking-tight text-[var(--tmbc-charcoal)] md:text-5xl">
              {title}
            </h1>
          </Reveal>
          <Reveal variant="slide-up">
            <p className="max-w-3xl text-lg text-[var(--tmbc-charcoal)] text-opacity-80">{subtitle}</p>
          </Reveal>
          {description && (
            <Reveal variant="fade-up">
              <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">{description}</p>
            </Reveal>
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={heroVariant}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <Reveal variant="fade-up">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={primaryCTA.href}
                className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em] shadow-[0_25px_60px_rgba(211,183,149,0.5)]"
              >
                {primaryCTA.label}
              </Link>
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="marketing-btn marketing-btn-secondary uppercase tracking-[0.3em]"
                >
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          </Reveal>
        </motion.div>

        {supportingCopy && (
          <Reveal className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            {supportingCopy}
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default MarketingHero;
