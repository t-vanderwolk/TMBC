import Link from "next/link";
import CTARibbon from "@/components/marketing/CTARibbon";
import ContainedFullWidthHero from "@/components/marketing/ContainedFullWidthHero";
import MarketingContent from "@/components/marketing/MarketingContent";
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
        imageSrc="/assets/images/hero-founding-circle.png"
        imageAlt="Primary Taylor-Made Baby Co. hero artwork."
      >
        <div className="hero-copy md:contents">
          <h1 className="hero-headline">
            Baby prep, minus the spiral.
          </h1>
          <p className="hero-supporting mt-6">
            We guide you through pregnancy and early parenting in the right order — with context when it’s helpful and
            support when it’s needed. (And yes, you can ask the same question twice.)
          </p>
        </div>
        <div className="hero-cta mt-10 hidden flex-col gap-4 justify-center md:flex md:flex-row">
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

      <div className="hero-cta mt-10 flex flex-col gap-4 justify-center px-6 md:hidden">
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

      <MarketingContent>
        <div className="marketing-content space-y-24 md:space-y-32 text-[var(--tmbc-charcoal)]">
      <section className="marketing-section marketing-card mb-24 md:mb-28 bg-[var(--tmbc-ivory)]/90 px-8 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-70">
            How it works
          </p>
        </div>
      </section>

      <RibbonDivider />

      <section className="marketing-section marketing-card space-y-6 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 px-8 py-20 md:py-32">
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
              className="marketing-card bg-white/80 p-6"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {step.title}
              </p>
              <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-65">{step.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="marketing-section marketing-card space-y-6 bg-white/80 px-8 py-20 md:py-32">
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
              className="marketing-card bg-[var(--tmbc-ivory)]/80 p-5"
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
        </div>
      </MarketingContent>
    </>
  );
}
