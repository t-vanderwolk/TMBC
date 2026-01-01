import Link from "next/link";
import Image from "next/image";

import CTARibbon from "@/components/marketing/CTARibbon";
import planPreview from "../../../assets/images/ui-home-hero-platform-preview.png";

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
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="grid gap-8 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Plan
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
            Plan with steady, human guidance
          </h1>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            Decision support that keeps the pace calm and the priorities clear, without turning planning into shopping.
          </p>
          <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
            <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
              Request Your Invite
            </Link>
            <Link href="/how-it-works" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
              How It Works (no rush)
            </Link>
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-[32px] border border-[var(--tmbc-mauve)]/20 bg-white/80 aspect-[4/5] md:aspect-[3/4]">
          <Image
            src={planPreview}
            alt="Guided planning preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What this is
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Decision support without the pressure
          </h2>
        </div>
        <div className="space-y-4 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
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
          How Plan fits into Learn · Plan · Connect · Reflect
        </h2>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Planning turns learning into calm next steps, while connection and reflection keep the plan aligned
          with your life. (We’ll help you pause before buying “just in case.”)
        </p>
      </section>

      <CTARibbon
        headline="Plan with a steady guide"
        supportingText="Invite-only keeps the planning support personal and unhurried."
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
      />
      {/* TODO: Expand Plan pillar with decision stories and registry flow previews. */}
    </div>
  );
}
