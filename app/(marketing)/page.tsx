import Image from "next/image";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";
import SectionDivider from "@/components/marketing/SectionDivider";
import { MarketingHeading } from "@/components/marketing/Typography";
import Button from "@/components/ui/Button";
import { HERO_IMAGE_REGISTRY } from "@/lib/heroImages";
import { SectionBand, textCage, cardBase, dividerRhythm } from "@/components/marketing/MarketingCadence";
// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush
import learnPillar from "@/assets/images/learnpillar.png";
import planPillar from "@/assets/images/planpillar.png";
import connectPillar from "@/assets/images/connectpillar.png";
import reflectPillar from "@/assets/images/reflectpillar.png";
import ribbonKeyImage from "@/assets/images/ribbon-key.png";
import { ILLUSTRATIONS } from "@/lib/images";

/**
 * TMBC Homepage Background Rules:
 * - Ivory is the default.
 * - Blush is used sparingly for sectional cadence.
 * - Never place blush directly under the hero.
 * - Never stack blush sections back-to-back.
 * - Apply .section-transition only on the blush section that resolves back to ivory.
 */

// Hero ribbon: heroes/home-hero.png
// Do not replace or duplicate per TMBC hero rules

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


function PillarHighlightsSection() {
  return (
    <SectionBand bg="white" className="py-16 md:py-24 lg:py-28">
      <div className="space-y-10">
        <div className="max-w-full md:max-w-[720px] leading-relaxed space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">Pillars that shape the experience</p>
          <MarketingHeading level="h2" className="tracking-[0.02em]">
            Learn · Plan · Connect · Reflect—
          </MarketingHeading>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {pillarHighlights.map((pillar, index) => (
            <article
              key={pillar.title}
              className={`${cardBase("flex flex-col overflow-hidden p-8 md:p-10")} ${index % 2 === 1 ? "md:translate-y-3" : ""}`}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={pillar.image}
                  alt={pillar.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 90vw"
                  className="object-cover scale-110"
                  priority={pillar.title === "Learn"}
                />
              </div>
              <div className="space-y-3 px-6 py-6 text-[var(--tmbc-charcoal)]">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">{pillar.title}</p>
                <MarketingHeading level="h3">{pillar.headline}</MarketingHeading>
                <p className="text-sm leading-[1.6] text-[var(--tmbc-charcoal)] text-opacity-80 max-w-[280px] mx-auto">
                  {pillar.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionBand>
  );
}

function WhyInviteOnlySection() {
  return (
    <SectionBand bg="ivory" className="py-20 md:py-24 lg:py-28">
        <div className="grid gap-10 md:gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-[var(--tmbc-text-primary)]">
              Why Taylor-Made Is Invite-Only
            </h2>
            <div className="space-y-5 md:space-y-6 text-[var(--tmbc-text-secondary)] leading-relaxed">
              <p className="text-base md:text-lg max-w-[42ch]">
                Because support works best when it’s personal — not scaled, rushed, or automated.
              </p>
              <p className="text-base md:text-lg max-w-[42ch]">
                We intentionally limit access so every member is thoughtfully matched, properly supported, and guided by a real mentor — not an algorithm.
              </p>
              <p className="text-base md:text-lg max-w-[42ch]">
                Invite-only allows us to move at a human pace: fewer people, better care, and space for real questions without pressure to “keep up.” No feeds. No ranking. No noise.
              </p>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[420px] md:max-w-[460px] rounded-2xl bg-white/70 shadow-[0_12px_32px_rgba(0,0,0,0.06)] ring-1 ring-black/5 p-8 md:p-10 backdrop-blur-[2px] lg:ml-6 xl:ml-10 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/40 before:to-transparent before:pointer-events-none">
            <Image
              src={ribbonKeyImage}
              alt="Invitation-only access"
              width={520}
              height={520}
              className="mx-auto w-full max-w-[320px] object-contain"
              priority
            />
          </div>
        </div>
    </SectionBand>
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
    <SectionBand bg="white" className="relative py-16 md:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-6xl space-y-6 text-center">
        <div className={`${textCage("intro")} text-center`}>
          <MarketingHeading level="h2" className="mx-auto leading-snug tracking-tight">
            How the Taylor-Made Experience Begins
          </MarketingHeading>
          <p className="mx-auto max-w-[640px] text-center text-base md:text-lg text-[var(--tmbc-charcoal)] text-opacity-80">
            We keep access intentional — so every family is supported with care, not algorithms.
          </p>
        </div>
        {/* DO NOT convert this section into cards or steps. This image is the canonical invite flow representation. */}
        <div className="relative w-full max-w-5xl mx-auto mt-12">
          <div className="absolute inset-0 pointer-events-none rounded-[46px] bg-[var(--tmbc-ivory)]/20" aria-hidden="true" />
          <Image
            src={ILLUSTRATIONS.INVITE_ICONS}
            alt="Invite flow: Request invite, concierge intake, mentor match, start experience"
            width={ILLUSTRATIONS.INVITE_ICONS.width}
            height={ILLUSTRATIONS.INVITE_ICONS.height}
            className="relative z-10 mx-auto h-auto w-full rounded-[42px]"
            priority
          />
        </div>
      </div>
    </SectionBand>
  );
}

function WhyWeExistSection() {
  const coreBeliefs = [
    "Early planning deserves someone who notices the quiet excitement and keeps it steady.",
    "Our mentors set the pace, not the platform, so every conversation feels grounded in experience.",
    "We protect the gentle space for questions so clarity can arrive before any decision feels urgent.",
  ];

  return (
    <SectionBand bg="blush" className="py-16 md:py-24 lg:py-28">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="max-w-full md:max-w-[720px] leading-relaxed space-y-6 text-left">
          <MarketingHeading level="h2" className="text-left">
            Why We Exist
          </MarketingHeading>
          <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed">
            Those slow, early hours—scrolling through yet another careful checklist while the house stays still—feel like a murmured question asking whether the next decision will be kinder.
          </p>
          <div className="space-y-4">
            {coreBeliefs.map((belief) => (
              <p key={belief} className="text-base text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed">
                {belief}
              </p>
            ))}
          </div>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-70">
            Most parents just need someone to say, “You can skip that,” so we stay small and keep the care calm.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Image
            src={ILLUSTRATIONS.BLOCKS}
            alt="Taylor-Made Baby Co. wooden blocks representing intentional foundations"
            width={520}
            height={720}
            className="rounded-2xl object-contain"
            priority
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>
    </SectionBand>
  );
}

function TrustSection() {
  return (
    <SectionBand bg="ivory" className="py-16 md:py-24 lg:py-28">
      <div className="space-y-10">
        <div className={`${cardBase("mx-auto max-w-[640px] p-8 md:p-10")} text-center md:text-left space-y-6`}>
          <p className="text-xs tracking-wide uppercase text-[var(--tmbc-mauve)]/80">How we keep care calm</p>
          <MarketingHeading level="h2" className="tracking-[0.02em]">
            You arrive when you’re ready; we keep the space gentle, patient, and always on your timeline.
          </MarketingHeading>
          <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed">
            No hard launches, no rushed timelines—only thoughtful, mentor-led pacing so you feel supported while being invited to take the next calm step when the moment is right.
          </p>
        </div>
        <div className={`${dividerRhythm()} w-24 mx-auto`} aria-hidden="true" />
        <article className={`${cardBase("mx-auto max-w-[720px] p-8 md:p-10 w-full")} space-y-6 text-center md:text-left`}>
          <p className="text-xs tracking-wide uppercase text-[var(--tmbc-mauve)] text-[var(--tmbc-mauve)]/80">
            Journal spotlight
          </p>
          <MarketingHeading level="h3">Thoughtful guidance, shared gently.</MarketingHeading>
          <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-75 leading-relaxed">
            Reflections, planning support, and calm perspectives for modern parents—arrive when you are ready and explore the journal whenever curiosity calls.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]">
            <Link href="/blog" className="text-[var(--tmbc-charcoal)] transition hover:text-[var(--tmbc-mauve)]">
              Read more
            </Link>
            <span className="h-px w-8 bg-[var(--tmbc-charcoal)]/30" aria-hidden />
            <Link href="/blog" className="text-[0.75rem] tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Explore the journal
            </Link>
          </div>
        </article>
      </div>
    </SectionBand>
  );
}

function FinalCTA() {
  return (
    <div className="flex justify-center">
      <div className={`${cardBase("max-w-[720px] p-8 md:p-10 text-left")} mx-auto`}>
        <div className="space-y-8 text-left">
          <MarketingHeading level="h2" className="tracking-[0.35em] max-w-[640px]">
            Ready when you are—no rush, just thoughtful care.
          </MarketingHeading>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
            <Button href="/request-invite" variant="primary" className="px-8 py-3">
              Request an Invite
            </Button>
            <p className="text-sm tracking-[0.25em] text-[var(--tmbc-charcoal)]/60">
              We’ll keep the conversation calm while you decide the next gentle step.
            </p>
          </div>
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
        headline="Baby prep, with someone who's actually done it."
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
        className="pt-24 pb-20 md:pt-32 md:pb-28"
        textContainerClassName="max-w-full md:max-w-[720px] px-6 md:px-8 p-6 space-y-6 md:space-y-8 leading-relaxed"
        headlineClassName="hero-line-clamp leading-snug"
        leadClassName="mt-6"
        ctaContainerClassName="mt-8 flex flex-col gap-6 sm:flex-row sm:gap-5"
        heroImage={HERO_IMAGE_REGISTRY.heroMarketingSignature}
      />
      {/* FLOW RULE: Experience invitation imagery must stay above partner proof and below the hero. */}
      <InviteFlowSection />
      <WhyInviteOnlySection />
      <WhyWeExistSection />
      <PillarHighlightsSection />
      <TrustSection />
      <div className="my-20 md:my-24">
        <SectionDivider />
      </div>
      <SectionBand bg="white" className="border-t border-black/5 py-20 md:py-24">
        <PartnerLogoCarousel />
      </SectionBand>
      <SectionBand bg="blush" className="relative py-16 md:py-24 lg:py-28">
        <div className="w-full max-w-[900px] mx-auto">
          <Image
            src={ILLUSTRATIONS.EXPERIENCE}
            alt="The Taylor-Made Baby Co. experience flow"
            width={880}
            height={220}
            className="w-full rounded-xl object-contain"
            priority
          />
        </div>
      </SectionBand>
      <SectionBand bg="ivory" className="py-24 md:py-28">
        <FinalCTA />
      </SectionBand>
    </div>
  );
}
