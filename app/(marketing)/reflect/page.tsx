import CTARibbon from "@/components/marketing/CTARibbon";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import MarketingHero from "@/components/marketing/MarketingHero";
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
      <MarketingHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Editorial hero artwork for the Reflect pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="A quiet place for the early days."
        supportingText="Capture thoughts, moments, and memories from pregnancy and parenthood — privately, gently, and shared only if you choose. (Some seasons are meant to be held, not optimized.)"
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (softly)",
          href: "/how-it-works",
        }}
      />
      <RibbonDivider />

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
      <section className="marketing-section marketing-card mb-24 md:mb-28 bg-[var(--tmbc-ivory)]/90 px-8 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Reflect
          </p>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
            A soft divider that signals privacy and calm.
          </p>
        </div>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32">
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

      <section className="marketing-section bg-transparent px-8 py-20 md:py-32">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A keepsake detail that feels intimate and lasting.
        </p>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8 py-20 md:py-32">
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
              className="marketing-card bg-[var(--tmbc-ivory)]/80 p-4"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {benefit.title}
              </p>
              <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-65">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="marketing-section marketing-card space-y-4 bg-white/80 px-8 py-20 md:py-32">
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
