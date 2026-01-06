import Link from "next/link";
import CTARibbon from "@/components/marketing/CTARibbon";
import ContainedFullWidthHero from "@/components/marketing/ContainedFullWidthHero";
import MarketingContent from "@/components/marketing/MarketingContent";
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
        <div className="hero-copy md:contents">
          <h1 className="hero-headline">
            You’re not meant to do this alone.
          </h1>
          <p className="hero-supporting mt-6">
            A supportive community of parents, mentors, and professionals navigating pregnancy and early parenthood
            together — honestly, kindly, and without comparison. (No one’s keeping score.)
          </p>
        </div>
        <div className="hero-cta mt-10 hidden flex-col gap-4 justify-center md:flex md:flex-row">
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
            How It Works (quietly)
          </Link>
        </div>
      </ContainedFullWidthHero>

      <div className="hero-cta mt-10 flex flex-col gap-4 justify-center px-6 md:hidden">
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
          How It Works (quietly)
        </Link>
      </div>

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)] text-base md:text-lg">
      <section className="marketing-section marketing-card mb-24 md:mb-28 bg-[var(--tmbc-ivory)]/90 px-8 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Connect
          </p>
        </div>
      </section>

      <RibbonDivider />

      <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-32">
        {/* Structural: move the emotional pause ahead of diagrams to establish warmth before explanation. */}
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A pause that reflects the warmth of being held by a real community.
        </p>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32">
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

      <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8 py-20 md:py-32">
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
              className="marketing-card bg-[var(--tmbc-ivory)]/80 p-5"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {benefit.title}
              </p>
              <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-65">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-32">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A gentle look at how conversations stay focused and kind.
        </p>
      </section>

      <section className="marketing-section marketing-card space-y-4 bg-white/80 px-8 py-20 md:py-32">
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
        </div>
      </MarketingContent>
    </>
  );
}
