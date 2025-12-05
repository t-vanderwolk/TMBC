"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { greatVibes } from "@/app/fonts";
import Reveal from "@/components/marketing/Reveal";

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
};

const heroVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

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
}: MarketingHeroProps) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setParallaxOffset(rect.top * 0.12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden rounded-[48px] border border-[var(--tmbc-gold)/60] bg-[var(--tmbc-ivory)] p-6 shadow-[0_40px_120px_rgba(199,165,196,0.35)]"
    >
      <div
        className="absolute inset-0 -z-10 transition-transform duration-700"
        style={{
          backgroundImage: backgroundImage
            ? `linear-gradient(180deg, rgba(250,247,244,0.9), rgba(199,167,187,0.65)), url(${backgroundImage})`
            : "radial-gradient(circle at top, rgba(247,236,233,0.9), rgba(199,167,187,0.5), rgba(64,44,56,0.4))",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${parallaxOffset}px)`,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-y-12 left-6 w-px rounded-full bg-gradient-to-b from-transparent via-[var(--tmbc-gold)] to-transparent" />

      <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-6 py-12 text-[var(--tmbc-charcoal)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/70">{eyebrow}</p>

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
            <p className="max-w-3xl text-lg text-[var(--tmbc-charcoal)]/80">{subtitle}</p>
          </Reveal>
          {description && (
            <Reveal variant="fade-up">
              <p className="text-sm text-[var(--tmbc-charcoal)]/70">{description}</p>
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
                className="rounded-[32px] border border-[var(--tmbc-gold)] bg-gradient-to-r from-[var(--tmbc-blush)] to-[var(--tmbc-mauve)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] transition hover:shadow-[0_25px_60px_rgba(211,183,149,0.5)]"
              >
                {primaryCTA.label}
              </Link>
              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="rounded-[32px] border border-[var(--tmbc-mauve)/70] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-gold)] hover:text-[var(--tmbc-mauve)]"
                >
                  {secondaryCTA.label}
                </Link>
              )}
            </div>
          </Reveal>
        </motion.div>

        {supportingCopy && (
          <Reveal className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/70">
            {supportingCopy}
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default MarketingHero;
