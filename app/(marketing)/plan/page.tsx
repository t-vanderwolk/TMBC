import Link from "next/link";
import CTARibbon from "@/components/marketing/CTARibbon";
import RibbonDivider from "@/components/marketing/RibbonDivider";
import HeroSection from "@/components/marketing/HeroSection";

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
    <div className="space-y-20 sm:space-y-24 text-[var(--tmbc-charcoal)]">
      <HeroSection
        backgroundImage="standard"
        imageAlt="Editorial hero artwork for the Plan pillar."
        title="Plan with steady, human guidance"
        supporting="A shared workspace for calm decisions, steady pacing, and mentor context."
      />

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/90 px-8 pt-6 pb-10 text-center shadow-[0_20px_70px_rgba(199,166,199,0.2)] sm:pt-8 sm:pb-14 lg:pt-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            Plan
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/request-invite"
              className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
            >
              Request Your Invite
            </Link>
            <Link href="/how-it-works" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
              How It Works (no rush)
            </Link>
          </div>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
            A gentle divider that reinforces calm pacing and clarity.
          </p>
        </div>
      </section>

      <div className="w-screen left-1/2 right-1/2 -translate-x-1/2">
        <RibbonDivider variant="full" />
      </div>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What this is
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Decision support without the pressure
          </h2>
        </div>
        <div className="max-w-[680px] space-y-7 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          <p>
            Planning inside TMBC means you never have to decide alone. Your mentor helps you sort priorities and
            define what fits your life.
          </p>
          <p>
            Registry guidance is shaped around context, timing, and budget awareness — without the loud push to
            buy everything now. We decide one meaningful thing at a time.
          </p>
          <p>
            If you already started a registry elsewhere, we help you refine it with clarity and calm.
          </p>
        </div>
      </section>

      <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.2)] marketing-section">
        <p className="max-w-[680px] text-sm text-[var(--tmbc-charcoal)] text-opacity-65">
          A visual moment that centers calm, human guidance.
        </p>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
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
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Relationship to the system
        </p>
        <h2 className="system-language pt-2 text-[0.7rem] sm:text-[0.8rem]">
          How Plan fits into Learn · Plan · Connect · Reflect
        </h2>
        <p className="max-w-[680px] text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Planning turns learning into calm next steps, while connection and reflection keep the plan aligned
          with your life. (We’ll help you pause before buying “just in case.”)
        </p>
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
  );
}
