import Image from "next/image";
import MarketingHero from "@/components/marketing/MarketingHero";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";
import SectionDivider from "@/components/marketing/SectionDivider";
import { MarketingHeading } from "@/components/marketing/Typography";
import Button from "@/components/ui/Button";
import { HERO_IMAGE_REGISTRY } from "@/lib/heroImages";
import { SectionBand, textCage, cardBase } from "@/components/marketing/MarketingCadence";
import { JournalSpotlight } from "@/components/marketing/JournalSpotlight";

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush
import learnPillar from "@/assets/images/learnpillar.png";
import planPillar from "@/assets/images/planpillar.png";
import connectPillar from "@/assets/images/connectpillar.png";
import reflectPillar from "@/assets/images/reflectpillar.png";
import inviteNarrativeBg from "@/assets/images/inviteonlynarritive.png";
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
          {pillarHighlights.map((pillar) => (
            <article key={pillar.title} className={cardBase("flex flex-col overflow-hidden")}>
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
  // InviteNarrativeSection guardrails:
  // - Background image via CSS only (no next/image)
  // - Single background asset (no stacking)
  // - Left-aligned editorial text only
  // - Soft opacity layer behind text for readability
  // - No CTAs or hero duplication
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="hidden lg:block">
          <div
            className="relative overflow-hidden rounded-2xl bg-[var(--tmbc-ivory)] bg-no-repeat bg-[length:cover] md:bg-[length:contain] bg-[position:center_top] md:bg-[position:right_center]"
            style={{ backgroundImage: `url(${inviteNarrativeBg.src})` }}
          >
            <div
              className="absolute inset-0 bg-[var(--tmbc-ivory)]/58 opacity-[0.18] md:opacity-[0.2] lg:opacity-[0.16]"
              aria-hidden="true"
            />
            <div className="relative z-10 grid grid-cols-12 gap-8 px-6 py-12 md:py-14 lg:py-16">
              <div className="col-span-12 md:col-span-6 md:col-start-3">
                <div className="space-y-6 max-w-[56ch] rounded-2xl bg-gradient-to-r from-white/45 via-white/40 to-white/0 bg-white/42 p-5 md:p-6 backdrop-blur-[1px] text-left">
                  <MarketingHeading level="h2" className="font-serif text-3xl md:text-4xl tracking-tight text-[var(--tmbc-text-primary)]">
                    Why Taylor-Made Is Invite-Only
                  </MarketingHeading>
                  <div className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                    Why access is curated
                  </div>
                  <div className="space-y-6 leading-[1.7] text-[var(--tmbc-text-secondary)]">
                    <p>
                      Because support works best when it’s personal — not scaled, rushed, or automated.
                    </p>
                    <p>
                      We intentionally limit access so every member is thoughtfully matched, properly supported, and guided by a real mentor — not an algorithm.
                    </p>
                  </div>
                  <div className="mt-4 text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                    Mentors guard the pace
                  </div>
                  <p className="leading-[1.7] text-[var(--tmbc-text-secondary)]">
                    Invite-only allows us to move at a human pace: fewer people, better care, and space for real questions without pressure to “keep up.” No feeds. No ranking. No noise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-8 lg:hidden">
          <div className="rounded-2xl bg-[var(--tmbc-ivory)]/80 p-10 text-left">
            <MarketingHeading level="h2" className="font-serif text-3xl tracking-tight text-[var(--tmbc-text-primary)]">
              Why Taylor-Made Is Invite-Only
            </MarketingHeading>
            <div className="text-[11px] tracking-[0.16em] uppercase text-muted-foreground mt-3">
              WHY ACCESS IS CURATED
            </div>
            <div className="mt-6 space-y-4 text-[var(--tmbc-text-secondary)] leading-[1.7] max-w-[38ch]">
              <p>Because support works best when it’s personal — not scaled, rushed, or automated.</p>
              <p>
                We intentionally limit access so every member is thoughtfully matched, properly supported, and guided by a real mentor — not an algorithm.
              </p>
            </div>
            <div className="mt-8 text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
              MENTORS GUARD THE PACE
            </div>
            <div className="mt-4 space-y-2 text-[var(--tmbc-text-secondary)] leading-[1.6]">
              <p>Invite-only allows us to move at a human pace.</p>
              <p>Fewer people. Better care.</p>
              <p>Space for real questions — without pressure to keep up.</p>
            </div>
            <div className="mt-6 space-y-1 text-[var(--tmbc-text-secondary)] leading-[1.6]">
              <p>No feeds.</p>
              <p>No ranking.</p>
              <p>No noise.</p>
            </div>
          </div>
          <div className="-mt-4 overflow-hidden rounded-2xl">
            <Image
              src={inviteNarrativeBg}
              alt="Ribbon and key illustration"
              width={1200}
              height={800}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceIllustrationSection() {
  return (
    <SectionBand bg="white" className="relative py-16 md:py-24 lg:py-28">
      <div className="relative w-full max-w-5xl mx-auto">
        <div className="absolute inset-0 pointer-events-none rounded-[46px] bg-[var(--tmbc-ivory)]/20" aria-hidden="true" />
        <Image
          src={ILLUSTRATIONS.EXPERIENCE}
          alt="Taylor-Made Baby Co. experience flow"
          width={ILLUSTRATIONS.EXPERIENCE.width}
          height={ILLUSTRATIONS.EXPERIENCE.height}
          className="relative z-10 mx-auto h-auto w-full rounded-[42px] object-cover"
          priority
        />
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

function TrustSection() {
  return (
    <SectionBand bg="ivory" className="py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-[840px]">
        <div className={cardBase("mx-auto max-w-[720px] w-full space-y-6 text-center md:text-left")}>
          <p className="text-xs tracking-wide uppercase text-[var(--tmbc-mauve)]/80">How we keep care calm</p>
          <MarketingHeading level="h2" className="tracking-[0.02em]">
            You arrive when you’re ready; we keep the space gentle, patient, and always on your timeline.
          </MarketingHeading>
          <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80 leading-relaxed">
            No hard launches, no rushed timelines—only thoughtful, mentor-led pacing so you feel supported while being invited to take the next calm step when the moment is right.
          </p>
        </div>
      </div>
    </SectionBand>
  );
}

function FinalCTA() {
  return (
      <div className="flex justify-center">
        <div className={`${cardBase("max-w-[720px] text-left")} mx-auto`}>
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
      {/* Hero copy intent:
          - Calm authority, not defensive
          - Mentor-led empathy without over-explaining
          - Headline states credibility; subtitle carries emotional reassurance
        */}
      <MarketingHero
        eyebrow="Invitation-only · Mentor-led"
        headline="Baby prep, with someone who’s already done it"
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
      <div className="my-20 md:my-24">
        <SectionDivider />
      </div>
      <WhyInviteOnlySection />
      <PillarHighlightsSection />
      <TrustSection />
      <JournalSpotlight />
      <ExperienceIllustrationSection />
      <div className="my-20 md:my-24">
        <SectionDivider />
      </div>
      <SectionBand bg="white" className="border-t border-black/5 py-20 md:py-24">
        <PartnerLogoCarousel />
      </SectionBand>
      <SectionBand bg="ivory" className="py-24 md:py-28">
        <FinalCTA />
      </SectionBand>
    </div>
  );
}
