import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
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
import requestInviteIcon from "@/assets/logos/requestinviteicon.png";
import conciergeIntakeIcon from "@/assets/logos/conciergeintakelogo.png";
import matchIcon from "@/assets/logos/matchicon.png";
import startExperienceIcon from "@/assets/logos/startexperienceicon.png";

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

// TMBC Pillar Copy Guardrails:
// - Clear, human language (no jargon)
// - Learn → Plan → Connect → Reflect always in this order
// - Reflect = virtual baby book / keepsake (not journaling fluff)
// - Calm, mentor-led, non-salesy tone
const pillarHighlights = [
  {
    title: "Learn",
    headline: "Insightful lessons steer you toward choices that feel steady and thoughtful.",
    copy:
      "Understand what you’re being told to buy — and why.\n\nLearn what baby gear actually does, when it’s typically used, and what truly matters for your life.\nNo pressure. No brand bias. Just calm, clear explanations so you can make confident choices.",
    image: learnPillar,
    alt: "Illustrated open book with soft colors representing careful learning",
  },
  {
    title: "Plan",
    headline: "Deliberate planning gives you a registry that matches your life.",
    copy:
      "Build your registry with intention — not panic.\n\nPlan as you learn, alongside a trusted mentor who’s been exactly where you are.\nDecide what you need now, what can wait, what to skip entirely — and what actually fits your home, lifestyle, and values.",
    image: planPillar,
    alt: "Notebook and ribbon representing deliberate planning",
  },
  {
    title: "Connect",
    headline: "Connection happens slowly, gently, without comparison.",
    copy:
      "You’re not the only one asking these questions.\n\nConnect with other parents in the same season and mentors who guide the conversation.\nShare questions, trade perspective, and get clarity — without the chaos of crowdsourced advice.",
    image: connectPillar,
    alt: "Soft conversation bubbles illustrating intentional connection",
  },
  {
    title: "Reflect",
    headline: "Reflection keeps your season tangible and meaningful.",
    copy:
      "Turn this season into a keepsake you’ll treasure later.\n\nReflect as you prepare and create a virtual baby book along the way.\nCapture what you learned, the choices you made, and how you felt — so one day, you can look back on this season with clarity and care.",
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
            <article
              key={pillar.title}
              className={cardBase(
                "flex flex-col overflow-hidden transition-all duration-300 ease-out motion-safe:hover:-translate-y-[2px] motion-safe:hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
              )}
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
  // InviteNarrativeSection guardrails:
  // - Background image via CSS only (no next/image)
  // - Single background asset (no stacking)
  // - Left-aligned editorial text only
  // - Soft opacity layer behind text for readability
  // - No CTAs or hero duplication
  return (
    <section className="relative mt-8 pt-10 pb-24 md:mt-20 md:pt-20 md:pb-24">
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
                    <span className="sr-only">
                      A mentor gently notes, “You can slow down whenever you need to.”
                    </span>
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
          <div className="relative overflow-hidden rounded-2xl bg-[var(--tmbc-ivory)]/80 p-10 text-left">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[length:cover] bg-no-repeat"
              style={{
                backgroundImage: `url(${inviteNarrativeBg.src})`,
                backgroundPosition: "65% center",
              }}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-[var(--tmbc-ivory)]/70" />
            <div className="relative z-10 space-y-6">
              <div className="mb-3 text-[11px] tracking-[0.28em] uppercase text-muted-foreground md:hidden">
                WHY ACCESS IS CURATED
              </div>
              <MarketingHeading level="h2" className="font-serif text-3xl tracking-tight text-[var(--tmbc-text-primary)]">
                Why Taylor-Made Is Invite-Only
              </MarketingHeading>
              <div className="md:hidden my-4 h-px w-16 bg-[var(--tmbc-charcoal)]/20" />
              <div className="mt-6 space-y-4 text-[var(--tmbc-text-secondary)] leading-[1.7] max-w-[38ch]">
                <p>Because support works best when it’s personal — not scaled, rushed, or automated.</p>
                <p>
                  We intentionally limit access so every member is thoughtfully matched, properly supported, and guided by a real mentor — not an algorithm.
                </p>
                <span className="sr-only">
                  A mentor whispers, “You are allowed to set the pace that feels right.”
                </span>
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
  const inviteSteps = [
    {
      icon: requestInviteIcon,
      alt: "Request an invite",
      label: "Request Invite",
    },
    {
      icon: conciergeIntakeIcon,
      alt: "Concierge intake",
      label: "Concierge Intake",
    },
    {
      icon: matchIcon,
      alt: "Mentor match",
      label: "Match",
    },
    {
      icon: startExperienceIcon,
      alt: "Start experience",
      label: "Start Experience",
    },
  ];

  const iconWidthClass = (label: string) => {
    switch (label) {
      case "Request Invite":
        return "w-[54px] md:w-[66px]";
      case "Match":
        return "w-[64px] md:w-[74px]";
      case "Start Experience":
        return "w-[44px] md:w-[56px]";
      default:
        return "w-12 md:w-16";
    }
  };

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="rounded-[36px] bg-gradient-to-br from-[var(--tmbc-ivory)] via-[var(--tmbc-blush-soft)] to-[var(--tmbc-blush-soft)] px-6 py-12">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:gap-0 md:text-center">
            {inviteSteps.map((step, index) => (
              <Fragment key={step.label}>
                <div className="flex flex-col items-center gap-1 px-3 md:flex-1">
                  <div className="flex items-end justify-center h-[76px] md:h-[88px] lg:scale-[0.92] lg:[transform-origin:center_bottom]">
                    <Image
                      src={step.icon}
                      alt={step.alt}
                      width={64}
                      height={64}
                      priority
                      unoptimized
                      style={{ height: "auto" }}
                      className={`mx-auto h-auto object-contain ${iconWidthClass(
                        step.label
                      )}`}
                    />
                  </div>
                  <p className="font-serif italic text-[0.85rem] leading-[1.5] tracking-[0.04em] text-[var(--tmbc-charcoal)]/90">
                    {step.label}
                  </p>
                </div>
                {index < inviteSteps.length - 1 && (
                  <div className="hidden md:flex md:items-center md:px-4">
                    <span
                      className="h-2 w-2 rounded-full bg-[var(--tmbc-charcoal)]/15"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section
      aria-label="TMBC pacing philosophy"
      className="bg-[#faf7f5] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[680px] px-6 md:px-0 text-left space-y-6">
        <div className="mb-6 text-[11px] tracking-[0.28em] uppercase text-muted-foreground">
          How we keep care calm
        </div>
        <h2 className="font-serif text-[32px] leading-[1.15] md:text-[40px] text-foreground">
          You arrive when you’re ready;<br />
          we keep the space gentle,<br />
          patient, and always<br />
          on your timeline.
        </h2>
        <div className="mt-8 mb-8 h-px w-16 bg-muted-foreground/30" />
        <p className="text-[16px] leading-relaxed text-muted-foreground max-w-[56ch]">
          No hard launches, no rushed timelines—only thoughtful,
          mentor-led pacing so you feel supported while being
          invited to take the next calm step when the moment is right.
        </p>
      </div>
    </section>
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
        primaryAction={
          <Button href="/request-invite" variant="primary" className="px-8 py-3 uppercase tracking-[0.35em]">
            Request an Invite
          </Button>
        }
        secondaryAction={
          <Link
            href="/how-it-works"
            className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] underline"
          >
            See how it works
          </Link>
        }
        heroImage={HERO_IMAGE_REGISTRY.heroMarketingSignature}
      />
      {/* Invite Code Entry */}
      <div className="mt-12 flex w-full justify-center px-4">
        <div className="w-full max-w-md text-center">
          <p className="mb-3 text-xs uppercase tracking-widest text-[var(--tmbc-charcoal)]/60">
            Already invited?
          </p>

          <form action="/verify" method="GET" className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <input
              type="text"
              name="code"
              required
              placeholder="Enter invite code"
              className="w-full rounded-full border border-[var(--tmbc-blush)]/40 bg-white px-5 py-3 text-sm focus:border-[var(--tmbc-blush)] focus:outline-none sm:w-64"
            />

            <button
              type="submit"
              className="rounded-full bg-[var(--tmbc-blush)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--tmbc-blush)]/90"
            >
              Continue
            </button>
          </form>

          <p className="mt-3 text-xs text-[var(--tmbc-charcoal)]/60">
            Don’t have a code?{" "}
            <Link
              href="/request-invite"
              className="underline underline-offset-4 hover:text-[var(--tmbc-charcoal)]"
            >
              Request an invite
            </Link>
          </p>
        </div>
      </div>
      {/* FLOW RULE: Experience invitation imagery must stay above partner proof and below the hero. */}
      <InviteFlowSection />
      <div className="my-10 md:my-24">
        <SectionDivider />
      </div>
      <WhyInviteOnlySection />
      <PillarHighlightsSection />
      <TrustSection />
      <div className="mb-8 md:mb-20">
        <JournalSpotlight />
      </div>
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
