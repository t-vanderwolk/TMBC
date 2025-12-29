import Link from "next/link";

import CTARibbon from "@/components/marketing/CTARibbon";
import VisualPlaceholder from "@/components/marketing/VisualPlaceholder";

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
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="grid gap-8 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Reflect
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
            Reflect with meaning and care
          </h1>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            A private, gentle space to capture memories, moments, and the story you want to keep.
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
          label="Keepsake journal or baby book moment"
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
            Keepsakes with an heirloom feel
          </h2>
        </div>
        <div className="space-y-4 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          <p>
            Reflection inside TMBC is designed to feel gentle and personal. It is not a feed, and it is not
            about sharing publicly.
          </p>
          <p>
            Prompt-driven journaling helps you capture the small moments as they happen, without the pressure
            to be perfect.
          </p>
          <p>
            Over time, this becomes a baby book that feels intentional, private, and meaningful.
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            How it supports parents
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A quiet place to remember
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
          How Reflect fits into Learn · Plan · Connect · Reflect
        </h2>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Reflection keeps the experience meaningful, tying the learning, planning, and connection together in
          a way that feels personal.
        </p>
      </section>

      <CTARibbon
        headline="Keep the story with care"
        supportingText="Invite-only keeps this space private and intentional."
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
      />
      {/* TODO: Expand Reflect pillar with journaling rituals and keepsake previews. */}
    </div>
  );
}
