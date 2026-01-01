import Link from "next/link";
import Image from "next/image";

import CTARibbon from "@/components/marketing/CTARibbon";
import nurseryPreview from "../../../assets/images/editorial-about-nursery-corner.png";
import familyPreview from "../../../assets/images/editorial-about-family-bump.jpeg";

const philosophy = [
  {
    title: "Invite-only by design",
    description:
      "A smaller, more attentive community lets mentors stay present and personal.",
  },
  {
    title: "Mentor-first planning",
    description:
      "Human guidance keeps decisions grounded in your life, not a generic list.",
  },
  {
    title: "Fewer decisions, better ones",
    description:
      "We slow the pace so you can choose what fits and skip what does not.",
  },
];

const whoItsFor = [
  {
    title: "Parents seeking clarity",
    description:
      "You want a steady plan and a trusted guide, not another checklist.",
  },
  {
    title: "Parents overwhelmed by options",
    description:
      "Too many lists and opinions have made things feel louder, not clearer.",
  },
  {
    title: "Parents who value guidance",
    description:
      "You want to learn with context and make calm, thoughtful choices.",
  },
];

const whatItsNot = [
  {
    title: "Not a registry",
    description:
      "We do not push products or fill lists on your behalf.",
  },
  {
    title: "Not a marketplace",
    description:
      "There is no shopping feed or urgency to buy.",
  },
  {
    title: "Not social media",
    description:
      "No algorithms, no performance, just focused support.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-12 sm:space-y-16 text-[var(--tmbc-charcoal)]">
      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-10 shadow-[0_30px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            About
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--tmbc-charcoal)]">
            Why Taylor-Made Baby Co.
          </h1>
        </div>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Calm preparation over consumption. Mentor-led guidance that respects your pace and priorities.
        </p>
        <div className="flex flex-col gap-3 text-[0.75rem] uppercase tracking-[0.35em] sm:flex-row sm:gap-4">
          <Link href="/request-invite" className="marketing-btn marketing-btn-primary uppercase tracking-[0.35em]">
            Request Your Invite
          </Link>
          <Link href="/how-it-works" className="marketing-btn marketing-btn-secondary uppercase tracking-[0.35em]">
            How It Works
          </Link>
        </div>
      </section>

      <section className="grid gap-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-br from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-2">
        <div className="relative w-full overflow-hidden rounded-[36px] border border-[var(--tmbc-mauve)]/20 bg-white/80 aspect-[4/3]">
          <Image
            src={nurseryPreview}
            alt="A calm nursery scene"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            The heart of TMBC
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Calm spaces, calm decisions
          </h2>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            The experience is designed to feel like a soft landing: thoughtful guidance, slower pacing, and
            support that meets you where you are. (Even if the nursery isn’t finished yet.)
          </p>
        </div>
      </section>

      <section className="grid gap-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Real life, held gently
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Guidance that fits growing families
          </h2>
          <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
            TMBC supports you through each season — first babies, siblings, and every shift in between.
          </p>
        </div>
        <div className="relative w-full overflow-hidden rounded-[36px] border border-[var(--tmbc-mauve)]/20 bg-white/80 aspect-[4/3]">
          <Image
            src={familyPreview}
            alt="Family moment during pregnancy"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/20 bg-gradient-to-b from-white to-[var(--tmbc-blush)]/60 p-8 shadow-[0_25px_90px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            The philosophy
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            The intention behind the invite
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {philosophy.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[var(--tmbc-charcoal)]/10 bg-white/80 p-5 shadow-[0_12px_40px_rgba(199,166,199,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-50">
                {item.title}
              </p>
              <p className="mt-3 text-base text-[var(--tmbc-charcoal)] text-opacity-70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            Who it is for
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            Parents who want guidance with grace
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {whoItsFor.map((item) => (
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

      <section className="space-y-6 rounded-[48px] border border-[var(--tmbc-mauve)]/30 bg-white/80 p-8 shadow-[0_20px_80px_rgba(199,166,199,0.25)] marketing-section">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
            What makes this different
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl text-[var(--tmbc-charcoal)]">
            A quieter, more human alternative
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {whatItsNot.map((item) => (
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
        headline="Invite-only, with care"
        supportingText="A calm, mentor-led experience for parents who want clarity. (And a little breathing room.)"
        buttonLabel="Request Your Invite"
        buttonHref="/request-invite"
      />
    </div>
  );
}
