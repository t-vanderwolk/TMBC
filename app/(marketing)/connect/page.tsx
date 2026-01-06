import Link from "next/link";
import CTARibbon from "@/components/marketing/CTARibbon";
import ContainedFullWidthHero from "@/components/marketing/ContainedFullWidthHero";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";
import RibbonDivider from "@/components/marketing/RibbonDivider";

const benefits = [
  {
    title: "Mentor-moderated rooms",
    description:
      "Focused spaces that stay kind, on-topic, and useful.",
  },
  {
    title: "Monthly mentor circles",
    description:
      "Small gatherings that feel calm and supportive, not performative.",
  },
  {
    title: "Quiet, thoughtful follow-ups",
    description:
      "Mentors summarize insights so the conversation stays clear.",
  },
];

export default function ConnectPage() {
  return (
    <>
      <ContainedFullWidthHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Editorial hero artwork for the Connect pillar."
      >
        <h1 className="hero-headline">
          Connection without the noise
        </h1>
        <p className="hero-supporting">
          Mentor-led connection that stays steady, kind, and centered on shared understanding.
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
            How It Works (quietly)
          </Link>
        </div>
      </ContainedFullWidthHero>

      <div className="mt-20 sm:mt-24">
        <MarketingContainer className="space-y-20 sm:space-y-24 text-[var(--tmbc-charcoal)]">
        <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/90 px-8 pt-6 pb-10 text-center shadow-[0_20px_70px_rgba(199,166,199,0.2)] sm:pt-8 sm:pb-14 lg:pt-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Connect
          </p>
        </div>
      </section>

      <RibbonDivider />

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.2)] marketing-section">
        {/* Structural: move the emotional pause ahead of diagrams to establish warmth before explanation. */}
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A pause that reflects the warmth of being held by a real community.
        </p>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What this is
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Structured community, not social media
          </h2>
        </div>
        <div className="max-w-[680px] space-y-7 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          <p>
            Connection inside TMBC is designed to feel calm and purposeful. Mentors keep conversations warm and
            grounded, so your questions land in the right places.
          </p>
          <p>
            Rooms are organized around real-life topics, not feeds or engagement metrics. You can step in,
            listen, and leave without pressure. (No awkward “introduce yourself” prompts.)
          </p>
          <p>
            The goal is to feel supported, not overstimulated. Every space stays mentor-guided and kind.
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            How it supports parents
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A calm circle you can trust
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

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.2)] marketing-section">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A gentle look at how conversations stay focused and kind.
        </p>
      </section>

      <section className="space-y-4 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-50">
          Relationship to the system
        </p>
        <h2 className="system-language pt-2 text-[0.7rem] sm:text-[0.8rem]">
          Where Connect fits in Learn · Plan · Connect · Reflect
        </h2>
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-60">
          Connection keeps the experience human, weaving learning, planning, and reflection into a steady
          support system.
        </p>
      </section>

      <CTARibbon
        headline="A calm circle is waiting"
        supportingText="Invite-only keeps the community thoughtful and mentor-led. (You can lurk first.)"
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
        tone="medium"
      />
      {/* TODO: Expand Connect pillar with mentor circle previews and room rituals. */}
      </MarketingContainer>
      </div>
    </>
  );
}
