import Link from "next/link";
import CTARibbon from "@/components/marketing/CTARibbon";
import ContainedFullWidthHero from "@/components/marketing/ContainedFullWidthHero";
import { MarketingContainer } from "@/components/marketing/MarketingContainer";
import RibbonDivider from "@/components/marketing/RibbonDivider";

const steps = [
  {
    title: "Share your context",
    summary: "A short intake that captures your rhythm, support, and priorities.",
  },
  {
    title: "Meet your mentor",
    summary: "A real human who listens, guides, and stays in your corner.",
  },
  {
    title: "Plan with intention",
    summary: "A shared map of decisions that keeps the pace calm and clear.",
  },
  {
    title: "Reflect and refine",
    summary: "A gentle place to revisit choices and capture the story as it unfolds.",
  },
];

const expectations = [
  {
    title: "Calm guidance",
    description: "Mentors help you understand what matters and why.",
  },
  {
    title: "Steady pacing",
    description: "No countdowns or pressure, just support when you need it.",
  },
  {
    title: "A connected journey",
    description: "Learn, plan, connect, and reflect in one continuous flow.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <ContainedFullWidthHero
        imageSrc="/assets/images/section-background-soft-ribbon.png"
        imageAlt="Primary Taylor-Made Baby Co. hero artwork."
      >
        <h1 className="hero-headline">
          A guided journey, not a noisy checklist
        </h1>
        <p className="hero-supporting">
          Taylor-Made Baby Co. pairs you with a mentor and a calm system that keeps decisions clear and supportive from
          start to finish.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/request-invite"
            className="marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]"
          >
            Request Your Invite
          </Link>
          <Link
            href="/experience"
            className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]"
          >
            The Experience
          </Link>
        </div>
      </ContainedFullWidthHero>

      <div className="mt-20 sm:mt-24">
        <MarketingContainer className="space-y-20 sm:space-y-24 text-[var(--tmbc-charcoal)]">
        <section className="rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/90 px-8 pt-6 pb-10 text-center shadow-[0_20px_70px_rgba(199,166,199,0.2)] sm:pt-8 sm:pb-14 lg:pt-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            How it works
          </p>
        </div>
      </section>

      <RibbonDivider />

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            The rhythm
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Four steps, held together with care
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-6 shadow-[0_18px_60px_rgba(199,166,199,0.2)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {step.title}
              </p>
              <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-65">{step.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What to expect
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Calm, mentor-led support at every step
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {expectations.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-5 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {item.title}
              </p>
              <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-65">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CTARibbon
        headline="Ready for a calmer path?"
        supportingText="Invite-only keeps the guidance personal and steady."
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
        tone="medium"
      />
      </MarketingContainer>
      </div>
    </>
  );
}
