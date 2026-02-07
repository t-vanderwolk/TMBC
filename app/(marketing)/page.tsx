import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import MarketingHero from "@/components/marketing/MarketingHero";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";
import SectionDivider from "@/components/marketing/SectionDivider";
import { MarketingHeading } from "@/components/marketing/Typography";
import Button from "@/components/ui/Button";
import { HERO_IMAGE_REGISTRY } from "@/lib/heroImages";
import { SectionBand, cardBase } from "@/components/marketing/MarketingCadence";
import { JournalSpotlight } from "@/components/marketing/JournalSpotlight";
import PillarHighlightsSection from "@/components/marketing/PillarHighlightsSection";
import ExpandableCopy from "@/components/marketing/ExpandableCopy";

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush
import inviteNarrativeBg from "@/assets/images/inviteonlynarritive.png";
import requestInviteIcon from "@/assets/logos/requestinviteicon.png";
import robellogo from "@/assets/logos/robellogo.png";
import conciergeIntakeIcon from "@/assets/logos/conciergeintakelogo.png";
import matchIcon from "@/assets/logos/matchicon.png";
import startExperienceIcon from "@/assets/logos/startexperienceicon.png";
import expertIcon from "@/assets/logos/experticon.png";
import partnerIcon from "@/assets/logos/partnericon.png";
import mentorLedIcon from "@/assets/logos/mentorledicon.png";
import personallyMatchedIcon from "@/assets/logos/personallymatachedicon.png";
import silverCrossLogo from "@/assets/logos/silver-cross-logo-1.webp";
import albeeLogo from "@/assets/logos/albeebabylogo2.png";
import macroBabyLogo from "@/assets/logos/macrologo.png";
import babyQuipLogo from "@/assets/logos/baby-quip-logo.png";
import dadadadaLogo from "@/assets/logos/dadadadalogo.png";
import ergoBabyLogo from "@/assets/logos/ergobabylogo.png";
import earthMamaLogo from "@/assets/logos/earthmama.png";
import happiestBabyLogo from "@/assets/logos/happiestbaby-logo.png";
import inglesinaLogo from "@/assets/logos/inglesinalogo.png";
import kyteBabyLogo from "@/assets/logos/kytebaby-logo.png";
import momCozyLogo from "@/assets/logos/momcozy.png";
import newtonBabyLogo from "@/assets/logos/newtonbaby-logo.png";
import owletLogo from "@/assets/logos/owlet-logo.png";
import tommeeTippeeLogo from "@/assets/logos/tommee-tippee-logo.png";
import waybLogo from "@/assets/logos/wayblogo.png";

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
const experienceHighlights = [
  {
    icon: expertIcon,
    label: "Expert care",
  },
  {
    icon: personallyMatchedIcon,
    label: "Personally matched",
  },
  {
    icon: partnerIcon,
    label: "Partner support",
  },
  {
    icon: mentorLedIcon,
    label: "Mentor-led guidance",
  },
];

const partnerLogos = [
  { id: "silver-cross", name: "silver-cross", src: silverCrossLogo, alt: "Silver Cross" },
  { id: "albee", name: "albee", src: albeeLogo, alt: "Albee" },
  { id: "macro-baby", name: "macro-baby", src: macroBabyLogo, alt: "MacroBaby" },
  { id: "baby-quip", name: "baby-quip", src: babyQuipLogo, alt: "Baby Quip" },
  { id: "dadadada", name: "dadadada", src: dadadadaLogo, alt: "Dadadada" },
  { id: "ergobaby", name: "ergobaby", src: ergoBabyLogo, alt: "Ergobaby" },
  { id: "earth-mama", name: "earth-mama", src: earthMamaLogo, alt: "Earth Mama" },
  { id: "happiest-baby", name: "happiest-baby", src: happiestBabyLogo, alt: "Happiest Baby" },
  { id: "inglesina", name: "inglesina", src: inglesinaLogo, alt: "Inglesina" },
  { id: "kyte-baby", name: "kyte-baby", src: kyteBabyLogo, alt: "Kyte Baby" },
  { id: "robel", name: "robel", src: robellogo, alt: "Robel" },
  { id: "momcozy", name: "momcozy", src: momCozyLogo, alt: "MomCozy" },
  { id: "newton-baby", name: "newton-baby", src: newtonBabyLogo, alt: "Newton Baby" },
  { id: "owlet", name: "owlet", src: owletLogo, alt: "Owlet" },
  { id: "tommee-tippee", name: "tommee-tippee", src: tommeeTippeeLogo, alt: "Tommee Tippee" },
  { id: "wayb", name: "wayb", src: waybLogo, alt: "Wayb" },
];

function ExperienceIllustrationSection() {
  return (
    <SectionBand bg="white" className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-neutral-500">
          WHY PARENTS LOVE TMBC
        </p>
        <h2 className="text-center font-serif text-4xl mb-6 max-w-4xl mx-auto text-[var(--tmbc-charcoal)]">
          What makes the Taylor-Made experience different
        </h2>
        <div className="rounded-[36px] bg-gradient-to-br from-[var(--tmbc-ivory)] via-[var(--tmbc-blush-soft)] to-[var(--tmbc-blush-soft)] px-6 py-12 md:py-16">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:gap-0 md:text-center">
            {experienceHighlights.map((highlight, index) => (
              <Fragment key={highlight.label}>
                <div className="flex flex-col items-center gap-1 px-3 md:flex-1">
                  <div className="flex items-end justify-center h-[76px] md:h-[88px] lg:scale-[0.92] lg:[transform-origin:center_bottom]">
                    <Image
                      src={highlight.icon}
                      alt={highlight.label}
                      width={64}
                      height={64}
                      priority
                      unoptimized
                      style={{ width: "auto", height: "auto" }}
                      className="mx-auto h-auto max-w-[58px] md:max-w-[68px] lg:max-w-[78px] object-contain opacity-95 pointer-events-none"
                    />
                  </div>
                  <p className="font-serif italic text-[0.85rem] leading-[1.5] tracking-[0.04em] text-[var(--tmbc-charcoal)]/90">
                    {highlight.label}
                  </p>
                </div>
                {index < experienceHighlights.length - 1 && (
                  <div className="hidden md:flex md:items-center md:px-4">
                    <span className="text-[28px] leading-none text-[var(--tmbc-charcoal)]/30" aria-hidden="true">
                      →
                    </span>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
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
      description: "Share basic details so we can hold you an invite window.",
    },
    {
      icon: conciergeIntakeIcon,
      alt: "Concierge intake",
      label: "Concierge Intake",
      description: "A mentor-led concierge reviews your story and answers questions calmly.",
    },
    {
      icon: matchIcon,
      alt: "Mentor match",
      label: "Match",
      description: "We match you with a mentor who’s been there and can guide the whole season.",
    },
    {
      icon: startExperienceIcon,
      alt: "Start experience",
      label: "Start Experience",
      description: "Begin planning together with clarity, one thoughtful decision at a time.",
    },
  ];

  const iconWidthClass = (label: string) => {
    switch (label) {
      case "Request Invite":
        return "max-w-[58px] md:max-w-[66px]";
      case "Match":
        return "max-w-[64px] md:max-w-[74px]";
      case "Start Experience":
        return "max-w-[56px] md:max-w-[66px]";
      default:
        return "max-w-[58px] md:max-w-[68px]";
    }
  };

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="mb-12 text-center text-3xl md:text-4xl font-serif">
          How the Taylor-Made experience begins
        </h2>
        <div className="rounded-[36px] bg-gradient-to-br from-[var(--tmbc-ivory)] via-[var(--tmbc-blush-soft)] to-[var(--tmbc-blush-soft)] px-6 py-12">
          <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:gap-0 md:text-center">
            {inviteSteps.map((step, index) => (
              <Fragment key={step.label}>
                <div className="flex flex-col items-center gap-3 px-3 md:flex-1">
                  <span className="text-[10px] tracking-[0.35em] uppercase text-[var(--tmbc-charcoal)]/60">
                    Step {index + 1}
                  </span>
                  <div className="flex items-end justify-center h-[76px] md:h-[88px] lg:scale-[0.92] lg:[transform-origin:center_bottom]">
                    <Image
                      src={step.icon}
                      alt={step.alt}
                      width={64}
                      height={64}
                      priority
                      unoptimized
                      style={{ width: "auto", height: "auto" }}
                      className={`mx-auto h-auto object-contain opacity-90 pointer-events-none ${iconWidthClass(
                        step.label
                      )}`}
                    />
                  </div>
                  <p className="font-serif italic text-[0.95rem] leading-[1.4] tracking-[0.04em] text-[var(--tmbc-charcoal)]/90">
                    {step.label}
                  </p>
                  <ExpandableCopy className="text-[0.75rem] leading-[1.4] text-[var(--tmbc-charcoal)]/80 max-w-[220px]">
                    <p>{step.description}</p>
                  </ExpandableCopy>
                </div>
                {index < inviteSteps.length - 1 && (
                  <>
                    <div className="mt-3 md:hidden text-[20px] text-[var(--tmbc-charcoal)]/30 text-center">
                      ↓
                    </div>
                    <div className="hidden md:flex md:items-center md:px-4">
                      <span
                        className="text-[28px] leading-none text-[var(--tmbc-charcoal)]/30"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  </>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
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

function TrustSection() {
  const promiseLines = [
    "We believe baby prep should feel calm, supported, and intentional — not rushed or overwhelming.",
    "Understand first — before you buy anything.",
    "Decide intentionally, with guidance from someone who’s been there.",
    "Stay connected with parents who are right where you are.",
    "And turn the process into something worth keeping.",
    "That’s the Taylor-Made promise.",
  ];

  return (
    <section
      aria-label="TMBC pacing philosophy"
      className="bg-[#faf7f5] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[680px] px-6 md:px-0 text-left space-y-6">
        <h2 className="font-serif text-[32px] leading-[1.15] md:text-[40px] text-foreground">
          The Taylor-Made Promise
        </h2>
        <div className="space-y-3 text-[16px] leading-relaxed text-muted-foreground max-w-[46ch]">
          {promiseLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center gap-1 text-center translate-x-2 md:translate-x-6">
          <p className="font-script text-[3rem] leading-[1] text-[var(--tmbc-charcoal)]/70 -rotate-6">
            XOXO
          </p>
          <p className="font-script text-[2.5rem] leading-[1] text-[var(--tmbc-charcoal)]/70 opacity-80 -rotate-6">
            — T
          </p>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)] overflow-x-hidden">
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
        headline="Baby prep, without the overwhelm"
        lead="Taylor-Made pairs you with a dedicated mentor so you can plan for baby with clarity, without pressure."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        className="pt-20 pb-16 md:pt-32 md:pb-28"
        textContainerClassName="max-w-full md:max-w-[720px] px-6 md:px-8 p-6 space-y-6 md:space-y-8 leading-relaxed"
        headlineClassName="hero-line-clamp leading-snug"
        leadClassName="mt-6"
        ctaContainerClassName="mt-8 flex flex-col items-center gap-4"
        primaryAction={
          <Button href="/request-invite" variant="primary" className="px-8 py-4 uppercase tracking-[0.35em]">
            Request an Invite
          </Button>
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
            Need an invite code? Submit the request above and we’ll send one once your space is confirmed.
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
      <div className="my-20 md:my-24">
        <SectionDivider />
      </div>
      <SectionBand bg="white" className="border-t border-black/5 py-20 md:py-24">
        <PartnerLogoCarousel logos={partnerLogos} />
        <div className="mx-auto mt-6 md:mt-8 flex max-w-6xl px-6">
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl text-left">
            These are calm, mentor-approved relationships. If a purchase happens through our guidance, we may earn a small commission at no extra cost, and only when it feels right for your experience.
          </p>
        </div>
      </SectionBand>
      <div className="mx-auto mt-10 max-w-6xl px-6">
        <JournalSpotlight />
      </div>
    </div>
  );
}
