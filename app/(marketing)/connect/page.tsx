import Link from "next/link";
import Image from "next/image";

import CTARibbon from "@/components/marketing/CTARibbon";
import connectPreview from "../../../assets/images/ui-connect-hero-community-preview.png";

const benefits = [
  {
    title: "Mentor-moderated rooms",
    description:
      "Focused spaces that stay kind, on-topic, and useful.",
  },
  {
    title: "Monthly mentor circles",
    description:
      "Small gatherings that feel calm and supportive, not performative.",
  },
  {
    title: "Quiet, thoughtful follow-ups",
    description:
      "Mentors summarize insights so the conversation stays clear.",
  },
];

export default function ConnectPage() {
  return (
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="grid gap-8 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Connect
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
            Connection without the noise
          </h1>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            A mentor-led community that feels steady, safe, and structured around what you actually need.
          </p>
          <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
            <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
              Request Your Invite
            </Link>
            <Link href="/how-it-works" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
              How It Works (quietly)
            </Link>
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-[32px] border border-[var(--tmbc-mauve)]/20 bg-white/80 aspect-[4/5] md:aspect-[3/4]">
          <Image
            src={connectPreview}
            alt="Community chat room preview"
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
            Structured community, not social media
          </h2>
        </div>
        <div className="space-y-4 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          <p>
            Connection inside TMBC is designed to feel calm and purposeful. Mentors keep conversations warm and
            grounded, so your questions land in the right places.
          </p>
          <p>
            Rooms are organized around real-life topics, not feeds or engagement metrics. You can step in,
            listen, and leave without pressure. (No awkward “introduce yourself” prompts.)
          </p>
          <p>
            The goal is to feel supported, not overstimulated. Every space stays mentor-guided and kind.
          </p>
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            How it supports parents
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A calm circle you can trust
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
          Where Connect fits in Learn · Plan · Connect · Reflect
        </h2>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Connection keeps the experience human, weaving learning, planning, and reflection into a steady
          support system.
        </p>
      </section>

      <CTARibbon
        headline="A calm circle is waiting"
        supportingText="Invite-only keeps the community thoughtful and mentor-led. (You can lurk first.)"
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
      />
      {/* TODO: Expand Connect pillar with mentor circle previews and room rituals. */}
    </div>
  );
}
