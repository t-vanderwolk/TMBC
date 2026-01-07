import CTARibbon from "@/components/marketing/CTARibbon";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";

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
      <MarketingHero
        imageSrc="/assets/images/section-background-learning-flow.png"
        imageAlt="Educational hero artwork for the Learn pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="Learn what matters for pregnancy and baby."
        supportingText="Clear, practical guidance on baby gear, safety, routines, and real-life decisions — without the pressure to master everything at once. (Nobody does.)"
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (gently)",
          href: "/how-it-works",
        }}
      />
      <RibbonDivider />

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
        <section className="marketing-section marketing-card mb-24 md:mb-28 bg-[var(--tmbc-ivory)]/90 px-8 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Learn
          </p>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
            A gentle divider that keeps the learning rhythm calm and clear.
          </p>
        </div>
      </section>

      <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-32">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A soft editorial pause before the learning flow begins.
        </p>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32">
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

      <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8 py-20 md:py-32">
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

      <section className="marketing-section marketing-card space-y-4 bg-white/80 px-8 py-20 md:py-32">
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
        </div>
      </MarketingContent>
    </>
  );
}
