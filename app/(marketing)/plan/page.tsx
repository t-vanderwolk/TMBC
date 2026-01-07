import CTARibbon from "@/components/marketing/CTARibbon";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";

const benefits = [
  {
    title: "Mentor notes, not noise",
    description:
      "Clear guidance from someone who knows your priorities and your pace.",
  },
  {
    title: "Registry clarity",
    description:
      "Thoughtful decisions about what fits your life, without pressure to buy.",
  },
  {
    title: "Timing awareness",
    description:
      "Steady pacing around what matters now, what can wait, and what can skip.",
  },
  {
    title: "Existing registry support",
    description:
      "Bring what you already have and refine it with calm guidance.",
  },
];

export default function PlanPage() {
  return (
    <>
      <MarketingHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Editorial hero artwork for the Plan pillar."
        imageWidth={1536}
        imageHeight={1024}
        headline="Plan for baby — with someone in your corner."
        supportingText="From registries to real-life logistics, your mentor helps you plan for pregnancy, birth, and early parenthood step by step. (We’ll hold the map. You set the pace.)"
        primaryCta={{
          label: "Request Your Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        secondaryCta={{
          label: "How It Works (no rush)",
          href: "/how-it-works",
        }}
      />
      <RibbonDivider />

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
      <section className="marketing-section marketing-card mb-24 md:mb-28 bg-[var(--tmbc-ivory)]/90 px-8 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Plan
          </p>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
            A gentle divider that reinforces calm pacing and clarity.
          </p>
        </div>
      </section>

      <section className="marketing-section marketing-card bg-white/80 px-8 py-20 md:py-32">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A visual moment that centers calm, human guidance.
        </p>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8 py-20 md:py-32">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            How it supports parents
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A plan that stays yours
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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

      <CTARibbon
        headline="Plan with a steady guide"
        supportingText="Invite-only keeps the planning support personal and unhurried."
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
        tone="medium"
      />
      {/* TODO: Expand Plan pillar with decision stories and registry flow previews. */}
        </div>
      </MarketingContent>
    </>
  );
}
