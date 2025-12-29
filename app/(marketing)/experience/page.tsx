import Link from "next/link";

import CTARibbon from "@/components/marketing/CTARibbon";
import VisualPlaceholder from "@/components/marketing/VisualPlaceholder";

const pillars = [
  {
    title: "Learn",
    description:
      "Understanding replaces overwhelm, so confidence grows with each thoughtful step.",
    visual: "Quiet learning moment",
  },
  {
    title: "Plan",
    description:
      "Decisions are guided, never rushed, and your registry becomes intentional.",
    visual: "Shared planning rhythm",
  },
  {
    title: "Connect",
    description:
      "Support is structured, mentor-led, and calm, without the noise of social feeds.",
    visual: "Mentor-led circle",
  },
  {
    title: "Reflect",
    description:
      "Your journey is captured, preserved, and honored with care.",
    visual: "Keepsake reflection",
  },
];

const philosophyPoints = [
  {
    title: "Mentors over algorithms",
    description:
      "Human guidance replaces automation so you feel heard, not processed.",
  },
  {
    title: "Steady pacing",
    description:
      "Presence matters more than pressure. We move with your season.",
  },
  {
    title: "Clarity over consumption",
    description:
      "Fewer decisions, better decisions, guided with context and care.",
  },
];

export default function ExperiencePage() {
  return (
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Experience
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
            The Taylor-Made Experience
          </h1>
        </div>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          A calm, guided journey through pregnancy, planning, and early parenthood, designed to support you at every step.
        </p>
        <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
          <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
            Request Your Invite
          </Link>
          <Link href="/experience" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
            The Experience
          </Link>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Learn · Plan · Connect · Reflect
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            One continuous experience, shaped with care
          </h2>
        </div>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          This is not an app you use. It is a relationship you move through, where each chapter connects to the
          next with intention, guidance, and steady support.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-6 shadow-[0_18px_60px_rgba(199,166,199,0.2)]"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-60">
                    {pillar.title}
                  </p>
                  <p className="mt-2 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
                    {pillar.description}
                  </p>
                </div>
                <VisualPlaceholder
                  label={pillar.visual}
                  className="rounded-[28px]"
                  minHeightClassName="min-h-[160px]"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Mentor-led philosophy
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Guidance that feels calm, not loud
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {philosophyPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-5 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {point.title}
              </p>
              <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{point.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CTARibbon
        headline="A calmer way to prepare"
        supportingText="Memberships are limited to ensure personalized care."
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
      />
    </div>
  );
}
