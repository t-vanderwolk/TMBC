import Link from "next/link";
import CTARibbon from "@/components/marketing/CTARibbon";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import { ContainedFullWidthHero } from "@/components/marketing/ContainedFullWidthHero";
import MarketingContent from "@/components/marketing/MarketingContent";

const benefits = [
  {
    title: "Private by default",
    description:
      "Your memories stay yours, with gentle options for keeping them close.",
  },
  {
    title: "Prompt-led journaling",
    description:
      "Thoughtful prompts help you capture moments without pressure.",
  },
  {
    title: "Baby book moments",
    description:
      "Stories, photos, and keepsakes gathered in a calm, meaningful space.",
  },
];

export default function ReflectPage() {
  return (
    <>
      <ContainedFullWidthHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Editorial hero artwork for the Reflect pillar."
        headline="A quiet place for the early days."
        supporting="Capture thoughts, moments, and memories from pregnancy and parenthood — privately, gently, and shared only if you choose. (Some seasons are meant to be held, not optimized.)"
        mobileKey="reflect"
      >
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/request-invite"
            className="marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]"
          >
            Request Your Invite
          </Link>
          <Link
            href="/how-it-works"
            className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]"
          >
            How It Works (softly)
          </Link>
        </div>
      </ContainedFullWidthHero>

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
        <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/90 px-8 pt-6 pb-10 text-center shadow-[0_20px_70px_rgba(199,166,199,0.2)] sm:pt-8 sm:pb-14 lg:pt-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Reflect
          </p>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
            A soft divider that signals privacy and calm.
          </p>
        </div>
      </section>

      <RibbonDivider />

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What this is
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Keepsakes with an heirloom feel
          </h2>
        </div>
        <div className="mx-auto max-w-[680px] space-y-7 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          <p>
            Reflection inside TMBC is designed to feel gentle and personal. It is not a feed, and it is not
            about sharing publicly.
          </p>
          <p>
            Prompt-driven journaling helps you capture the small moments as they happen, without the pressure
            to be perfect. You can write a sentence and call it a day.
          </p>
          <p>
            Over time, this becomes a baby book that feels intentional, private, and meaningful.
          </p>
        </div>
      </section>

      <section className="rounded-[48px] bg-transparent p-8 shadow-none marketing-section">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A keepsake detail that feels intimate and lasting.
        </p>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            How it supports parents
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A quiet place to remember
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-4 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {benefit.title}
              </p>
              <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-65">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-50">
          Relationship to the system
        </p>
        <h2 className="system-language pt-2 text-[0.7rem] sm:text-[0.8rem]">
          How Reflect fits into Learn · Plan · Connect · Reflect
        </h2>
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-60">
          Reflection keeps the experience meaningful, tying the learning, planning, and connection together in
          a way that feels personal. You don&apos;t have to remember it all — this holds it for you.
        </p>
      </section>

      <CTARibbon
        headline="Keep the story with care"
        supportingText="Invite-only keeps this space private and intentional. (No pressure to share.)"
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
        tone="soft"
      />
      {/* TODO: Expand Reflect pillar with journaling rituals and keepsake previews. */}
        </div>
      </MarketingContent>
    </>
  );
}
