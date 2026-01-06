import Link from "next/link";
import CTARibbon from "@/components/marketing/CTARibbon";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import ContainedFullWidthHero from "@/components/marketing/ContainedFullWidthHero";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";

const benefits = [
  {
    title: "Mentor-guided context",
    description:
      "Your mentor highlights what matters most right now and what can wait.",
  },
  {
    title: "Workbook reflections",
    description:
      "Short prompts help you sort priorities without feeling overwhelmed.",
  },
  {
    title: "Confidence through clarity",
    description:
      "Learn the why behind the options so your decisions feel grounded.",
  },
];

export default function LearnPage() {
  return (
    <>
      <ContainedFullWidthHero
        imageSrc="/assets/images/section-background-learning-flow.png"
        imageAlt="Educational hero artwork for the Learn pillar."
      >
        <h1 className="hero-headline">
          Learn with calm, not overwhelm
        </h1>
        <p className="hero-supporting">
          Clear, mentor-led guidance that keeps education steady, useful, and in the right sequence.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/request-invite"
            className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
          >
            Request Your Invite
          </Link>
          <Link
            href="/how-it-works"
            className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]"
          >
            How It Works (gently)
          </Link>
        </div>
      </ContainedFullWidthHero>

      <div className="mt-20 sm:mt-24">
        <MarketingContainer className="space-y-20 sm:space-y-24 text-[var(--tmbc-charcoal)]">
        <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/90 px-8 pt-6 pb-10 text-center shadow-[0_20px_70px_rgba(199,166,199,0.2)] sm:pt-8 sm:pb-14 lg:pt-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Learn
          </p>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
            A gentle divider that keeps the learning rhythm calm and clear.
          </p>
        </div>
      </section>

      <RibbonDivider />

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.2)] marketing-section">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A soft editorial pause before the learning flow begins.
        </p>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What this is
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Education that feels gentle and useful
          </h2>
        </div>
        <div className="max-w-[680px] space-y-7 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          <p>
            Learning inside TMBC is calm, paced, and rooted in real context. We share what matters without
            loading you down with endless lists.
          </p>
          <p>
            Academy modules and workbook prompts help you understand what&apos;s ahead without the noise.
            Everything is shaped around your timing and the questions you actually have.
          </p>
          <p>
            The goal is not to become an expert overnight. It is to feel confident in the next few choices
            you make.
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            How it supports parents
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Clarity that stays with you
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-5 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
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
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-50">
          Relationship to the system
        </p>
        <h2 className="system-language pt-2 text-[0.7rem] sm:text-[0.8rem]">
          Part of the Learn · Plan · Connect · Reflect rhythm
        </h2>
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-60">
          Learning sets the foundation so planning feels clear, connection feels meaningful, and reflection
          feels intentional. You don’t need to learn it all at once.
        </p>
      </section>

      <CTARibbon
        headline="Ready to learn with calm?"
        supportingText="Invite-only keeps the guidance personal and paced for you. (We’ll remind you to take breaks.)"
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
        tone="soft"
      />
      {/* TODO: Expand Learn pillar with stories and mentor-led lesson previews. */}
      </MarketingContainer>
      </div>
    </>
  );
}
