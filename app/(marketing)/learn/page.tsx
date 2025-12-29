import Link from "next/link";

import CTARibbon from "@/components/marketing/CTARibbon";
import VisualPlaceholder from "@/components/marketing/VisualPlaceholder";

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
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="grid gap-8 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Learn
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
            Learn with calm, not overwhelm
          </h1>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            We translate the noise into clear, mentor-led guidance so you can feel steady and informed.
          </p>
          <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
            <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
              Request Your Invite
            </Link>
            <Link href="/how-it-works" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
              How It Works
            </Link>
          </div>
        </div>
        <VisualPlaceholder
          label="Learning moment or mentor notes"
          className="h-full"
          minHeightClassName="min-h-[260px]"
        />
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What this is
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Education that feels gentle and useful
          </h2>
        </div>
        <div className="space-y-4 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          <p>
            Learning inside TMBC is calm, paced, and rooted in real context. We share what matters without
            loading you down with endless lists.
          </p>
          <p>
            Academy modules and workbook prompts help you understand the decisions ahead without the noise.
            Everything is shaped around your timing and the questions you actually have.
          </p>
          <p>
            The goal is not to become an expert overnight. It is to feel confident in the choices you make
            next.
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
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
              className="rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-5 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {benefit.title}
              </p>
              <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
          Relationship to the system
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
          Part of the Learn · Plan · Connect · Reflect rhythm
        </h2>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Learning sets the foundation so planning feels clear, connection feels meaningful, and reflection
          feels intentional.
        </p>
      </section>

      <CTARibbon
        headline="Ready to learn with calm?"
        supportingText="Invite-only keeps the guidance personal and paced for you."
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
      />
      {/* TODO: Expand Learn pillar with stories and mentor-led lesson previews. */}
    </div>
  );
}
