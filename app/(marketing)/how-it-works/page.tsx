import Link from "next/link";
import Image from "next/image";

import CTARibbon from "@/components/marketing/CTARibbon";
import howItWorksVisual from "../../../assets/images/diagram-how-it-works-process.png";

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
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="grid gap-8 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            How it works
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
            A guided journey, not a noisy checklist
          </h1>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            Taylor-Made Baby Co. pairs you with a mentor and a calm system that keeps decisions clear and
            supportive from start to finish.
          </p>
          <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
            <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
              Request Your Invite
            </Link>
            <Link href="/experience" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
              The Experience
            </Link>
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-[32px] border border-[var(--tmbc-mauve)]/20 bg-white/80 aspect-[4/5] md:aspect-[3/4]">
          <Image
            src={howItWorksVisual}
            alt="Taylor-Made Baby Co. process overview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </section>

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
              <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{step.summary}</p>
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
              <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CTARibbon
        headline="Ready for a calmer path?"
        supportingText="Invite-only keeps the guidance personal and steady."
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
      />
    </div>
  );
}
