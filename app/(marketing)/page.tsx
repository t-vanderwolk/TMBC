import Image from "next/image";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";
import { MarketingHeading } from "@/components/marketing/Typography";
import Button from "@/components/ui/Button";
// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush
import learnPillar from "@/assets/images/learnpillar.png";
import planPillar from "@/assets/images/planpillar.png";
import connectPillar from "@/assets/images/connectpillar.png";
import reflectPillar from "@/assets/images/reflectpillar.png";
import homepageHero from "@/assets/images/homepagehero.png";
import inviteIcons from "@/assets/images/inviteicons.png";

/**
 * TMBC Homepage Background Rules:
 * - Ivory is the default.
 * - Blush is used sparingly for sectional cadence.
 * - Never place blush directly under the hero.
 * - Never stack blush sections back-to-back.
 * - Apply .section-transition only on the blush section that resolves back to ivory.
 */

const pillarHighlights = [
  {
    title: "Learn",
    headline: "Insightful lessons steer you toward choices that feel steady and thoughtful.",
    copy:
      "Quiet guided sessions and mentor prompts surface trade-offs, safety cues, and your instincts before anything feels urgent—so every appointment feels calm instead of checklist-driven.",
    image: learnPillar,
    alt: "Illustrated open book with soft colors representing careful learning",
  },
  {
    title: "Plan",
    headline: "Deliberate planning gives you a registry that matches your life.",
    copy:
      "One-on-one conversations place your home, habits, and support network first so the plan stays practical, intentional, and free from pressure.",
    image: planPillar,
    alt: "Notebook and ribbon representing deliberate planning",
  },
  {
    title: "Connect",
    headline: "Connection happens slowly, gently, without comparison.",
    copy:
      "Mentors pair you with a circle that listens, shares stories, and keeps the pacing private so questions stay honest and human.",
    image: connectPillar,
    alt: "Soft conversation bubbles illustrating intentional connection",
  },
  {
    title: "Reflect",
    headline: "Reflection keeps your season tangible and meaningful.",
    copy:
      "Prompted journaling, keepsake spaces, and mentor check-ins help you notice what matters without adding busyness.",
    image: reflectPillar,
    alt: "Ribboned journal symbolizing reflection and keepsakes",
  },
];

const reassuranceLines = [
  "Taylor-Made Baby Co. feels like arriving somewhere thoughtful—no hard selling, no timelines.",
  "Mentors lean in gently, meet you where you are, and keep the experience private and paced.",
  "Every request is read by a human so care stays calm, responsive, and deeply personal.",
];

function ReassuranceBand() {
  return (
    <section className="marketing-section bg-[--tmbc-bg-white] py-28 sm:py-32">
      <MarketingContent>
        <div className="marketing-text-panel max-w-[640px] space-y-4 text-[var(--tmbc-charcoal)] text-opacity-80">
          {reassuranceLines.map((line) => (
            <p key={line} className="mkt-body">
              {line}
            </p>
          ))}
        </div>
      </MarketingContent>
    </section>
  );
}

function PillarHighlightsSection() {
  return (
    <section className="marketing-section bg-[--tmbc-bg-white] py-28 sm:py-32">
      <MarketingContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">Pillars that shape the experience</p>
            <MarketingHeading level="h2" className="tracking-[0.02em]">
              Learn · Plan · Connect · Reflect—
            </MarketingHeading>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {pillarHighlights.map((pillar, index) => (
              <article
                key={pillar.title}
                className="pillar-card flex flex-col overflow-hidden"
                style={{ transform: `translateY(${index * 2}px)` }}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={pillar.image}
                    alt={pillar.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 90vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
                <div className="space-y-3 px-6 py-6 text-[var(--tmbc-charcoal)]">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">{pillar.title}</p>
                  <MarketingHeading level="h3">{pillar.headline}</MarketingHeading>
                  <p className="text-sm leading-[1.6] text-[var(--tmbc-charcoal)] text-opacity-80 max-w-[240px]">{pillar.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </MarketingContent>
    </section>
  );
}

function WhyInviteOnlySection() {
  return (
    // Invite-only explanation must stay simple, human, and reassuring.
    // Avoid exclusivity language, urgency, or feature lists here.
    <section className="bg-[--tmbc-bg-ivory] py-20 md:py-28">
      <MarketingContent>
        <div className="space-y-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
            <div className="space-y-6 text-left text-[var(--tmbc-charcoal)] text-opacity-90">
              <MarketingHeading level="h2" className="mb-0 tracking-[0.02em]">
                Why Taylor-Made Is Invite-Only
              </MarketingHeading>
              <p className="text-base md:text-lg text-[var(--tmbc-charcoal)] text-opacity-80">
                Because support works best when it’s personal — not scaled, rushed, or automated.
              </p>
              <div className="space-y-5 text-sm md:text-base leading-relaxed">
                <p>
                  We intentionally limit access so every member is{" "}
                  <strong className="font-semibold text-[var(--tmbc-charcoal)] text-opacity-100">
                    thoughtfully matched, properly supported
                  </strong>{" "}
                  and guided by a real mentor — not an algorithm.
                </p>
                <p>
                  <strong className="font-semibold text-[var(--tmbc-charcoal)] text-opacity-100">
                    Invite-only allows us to move at a human pace
                  </strong>
                  : fewer people, better care, and space for real questions without pressure to “keep up.”
                </p>
                <p>
                  No feeds. No ranking. No noise.
                  <br />
                  <strong className="font-semibold text-[var(--tmbc-charcoal)] text-opacity-100">
                    Just steady guidance, when you actually need it.
                  </strong>
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div
                className="flex h-full w-full max-w-[280px] flex-col gap-6 rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-white/70 p-8 shadow-sm ring-1 ring-black/5"
                aria-hidden="true"
              >
                <div className="h-12 w-12 rounded-full border border-[var(--tmbc-blush)]/70 bg-[var(--tmbc-blush)]/30" />
                <div className="h-24 w-full rounded-[28px] border border-dashed border-[var(--tmbc-charcoal)]/15 bg-[var(--tmbc-ivory)]" />
                <div className="h-20 w-20 self-end rounded-[24px] border border-[var(--tmbc-mauve)]/40 bg-gradient-to-br from-white/60 to-[var(--tmbc-blush)]/30" />
              </div>
            </div>
          </div>
          <WhyWeExistSection />
        </div>
      </MarketingContent>
    </section>
  );
}

function InviteFlowSection() {
  return (
    // Invite Flow Guardrails:
    // - Single static image (no cards, no icons recreated in JSX)
    // - No animations or hover effects
    // - Always centered
    // - Never stacked as individual steps on desktop
    // - Mobile: image scales down, never breaks into columns
    <section className="relative w-full bg-[--tmbc-bg-white] pt-16 pb-24 md:pt-20 md:pb-28 lg:pt-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <MarketingHeading level="h2">
          How the Taylor-Made Experience Begins
        </MarketingHeading>
        <p className="mx-auto max-w-2xl text-base md:text-lg text-[var(--tmbc-charcoal)] text-opacity-80 mb-12">
          We keep access intentional — so every family is supported with care, not algorithms.
        </p>
        {/* DO NOT convert this section into cards or steps. This image is the canonical invite flow representation. */}
        <div className="relative w-full max-w-5xl mx-auto pt-16 lg:pt-20">
          <div className="absolute inset-0 pointer-events-none rounded-[42px] bg-[var(--tmbc-bg-ivory)]/10" aria-hidden="true" />
          <Image
            src={inviteIcons}
            alt="Invite flow: Request invite, concierge intake, mentor match, start experience"
            className="relative z-10 mx-auto h-auto w-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function WhyWeExistSection() {
  const coreBeliefs = [
    "Early planning deserves someone who notices the quiet excitement and keeps it steady.",
    "Our mentors set the pace, not the platform, so every conversation feels grounded in experience.",
    "We protect the gentle space for questions so clarity can arrive before any decision feels urgent.",
  ];

  return (
    <div className="space-y-12">
      <div className="space-y-4 max-w-3xl">
        <MarketingHeading level="h2" className="tracking-[0.02em]">
          Why We Exist
        </MarketingHeading>
        <p className="mkt-body mt-0 text-[var(--tmbc-charcoal)] text-opacity-80">
          <strong className="font-semibold text-[var(--tmbc-charcoal)] text-opacity-90">
            Those slow, early hours—scrolling through yet another careful checklist while the house stays still—
          </strong>{" "}
          feel like a murmured question asking whether the next decision will be kinder.
        </p>
      </div>
      {/* Emotional-first structure: story, then three beliefs, then a calm closing keeps this section grounded. */}
      <div className="space-y-4">
        <ul className="space-y-4 list-disc list-inside text-lg leading-relaxed text-[var(--tmbc-charcoal)] text-opacity-80 max-w-[640px]">
          {coreBeliefs.map((belief) => (
            <li key={belief}>{belief}</li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70 mt-6 max-w-prose-sm">
        <strong className="font-semibold text-[var(--tmbc-charcoal)] text-opacity-90">
          Most parents just need someone to say, “You can skip that,”
        </strong>{" "}
        so we stay small and keep the care calm.
      </p>
    </div>
  );
}

function TrustSection() {
  return (
    <section className="bg-[--tmbc-bg-blush] py-28 sm:py-32">
      <MarketingContent>
        <div className="space-y-10">
          <div className="marketing-text-panel max-w-[680px] space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">How we keep care calm</p>
            <MarketingHeading level="h2" className="tracking-[0.02em]">
              You arrive when you’re ready; we keep the space gentle, patient, and always on your timeline.
            </MarketingHeading>
            <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
              No hard launches, no rushed timelines—only thoughtful, mentor-led pacing so you feel supported while
              being invited to take the next calm step when the moment is right.
            </p>
          </div>
          <article className="rounded-[34px] border border-[rgba(62,47,53,0.15)] bg-[var(--tmbc-bg-ivory)]/80 px-6 py-10 shadow-sm ring-1 ring-black/5 lg:px-8 lg:py-12">
            <p className="text-[0.65rem] uppercase tracking-[0.55em] text-[var(--tmbc-charcoal)]/60">Journal spotlight</p>
            <MarketingHeading level="h3" className="mt-3">
              Thoughtful guidance, shared gently.
            </MarketingHeading>
            <p className="mt-3 mkt-body text-[var(--tmbc-charcoal)] text-opacity-75 max-w-[520px]">
              Reflections, planning support, and calm perspectives for modern parents—arrive when you are ready and
              explore the journal whenever curiosity calls.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]">
              <Link href="/blog" className="text-[var(--tmbc-charcoal)] transition hover:text-[var(--tmbc-mauve)]">
                Read more
              </Link>
              <span className="h-px w-8 bg-[var(--tmbc-charcoal)]/20" aria-hidden />
              <Link href="/blog" className="text-[0.75rem] tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
                Explore the journal
              </Link>
            </div>
          </article>
        </div>
      </MarketingContent>
    </section>
  );
}

function FinalCTA() {
  return (
    <div className="mt-16 rounded-[32px] border border-[var(--member-border-soft)] bg-white/90 px-6 py-10 shadow-[0_25px_60px_rgba(62,47,53,0.2)]">
      <div className="flex flex-col items-start gap-6">
        <MarketingHeading level="h2" className="tracking-[0.02em]">
          Ready when you are—no rush, just thoughtful care.
        </MarketingHeading>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/request-invite" variant="primary">
            Request an Invite
          </Button>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            We’ll keep the conversation calm while you decide the next gentle step.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      {/* Mobile spacing rule:
          Marketing sections should breathe on mobile.
          Prefer py-20+ over dense stacking. */}
      {/* Hero must render instantly and avoid additional entrance wrappers. */}
      {/* MARKETING HERO PARITY RULE:
          Homepage hero must match all other marketing hero sections.
          Do not add animation, parallax, or custom spacing here.
          Changes should be made in the shared hero system only.
        */}
      <MarketingHero
        eyebrow="Invitation-only · Mentor-led"
        headline={
          <>
            Baby prep,
            <br className="hidden lg:block" />
            with someone who's actually done it before.
          </>
        }
        lead="A calm, guided approach to preparing for baby—without pressure or guesswork."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        secondaryCta={{
          label: "Explore how it works",
          href: "/how-it-works",
          className: "mt-2 md:mt-0",
        }}
        imageSrc={homepageHero}
        imageAlt="Taylor-Made Baby Co. marketing hero"
        priority
        headlineClassName="hero-line-clamp"
      />
      {/* FLOW RULE: Experience invitation imagery must stay above partner proof and below the hero. */}
      <InviteFlowSection />
      <ReassuranceBand />
      <WhyInviteOnlySection />
      <PillarHighlightsSection />
      <TrustSection />
      <section className="marketing-section bg-[--tmbc-bg-white] py-28 sm:py-32 pb-36">
        <MarketingContent>
          <PartnerLogoCarousel />
        </MarketingContent>
      </section>
      <section className="marketing-section bg-[--tmbc-bg-ivory] py-28 sm:py-32">
        <MarketingContent>
          <FinalCTA />
        </MarketingContent>
      </section>
    </div>
  );
}
