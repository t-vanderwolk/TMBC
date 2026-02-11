import Image from "next/image";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";
import SectionDivider from "@/components/marketing/SectionDivider";
import RibbonDivider from "@/components/ui/RibbonDivider";
import { MarketingHeading } from "@/components/marketing/Typography";
import Button from "@/components/ui/Button";
import { HERO_IMAGE_REGISTRY } from "@/lib/heroImages";
import { SectionBand, cardBase } from "@/components/marketing/MarketingCadence";
import { JournalSpotlight } from "@/components/marketing/JournalSpotlight";
import PillarHighlightsSection from "@/components/marketing/PillarHighlightsSection";
import InviteFlowSection from "@/components/marketing/InviteFlowSection";
import { caveat } from "@/lib/fonts";
import WhyParentsAccordion from "@/components/marketing/WhyParentsAccordion";
import InviteOnlyAccordion from "@/components/marketing/InviteOnlyAccordion";

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush
import inviteNarrativeBg from "@/assets/images/keybowdivider.png";
import robellogo from "@/assets/logos/robellogo.png";
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
    <SectionBand bg="blush" className="py-16 md:py-20 lg:py-24 why-parents-gradient">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-neutral-500">
          WHY PARENTS LOVE TMBC
        </p>
        <div className="max-w-4xl">
          <h2 className="font-serif text-4xl mb-3 text-[var(--tmbc-charcoal)]">
            Why Parents Love Taylor-Made
          </h2>
          <p className="text-[16px] leading-[1.7] text-neutral-600 max-w-[46ch]">
            What makes this feel different — and why it matters.
          </p>
        </div>
        <WhyParentsAccordion />
      </div>
    </SectionBand>
  );
}

function WhyInviteOnlySection() {
  return (
    <>
      <section className="invite-only-hero">
        <div className="invite-only-hero-inner">
          <Image
            src={inviteNarrativeBg}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="invite-only-image"
            priority={false}
          />
        </div>
      </section>
      <section className="invite-only-content integrate-invite-gradient">
        <InviteOnlyAccordion />
      </section>
    </>
  );
}

function TrustSection() {
  const promiseLines = [
    "We help you prepare with confidence, not pressure.",
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
        <div className="mt-6 flex justify-center">
          <div
            className={`${caveat.className} text-[var(--tmbc-blush-primary)] text-[3rem] leading-none`}
            style={{ transform: "rotate(-6deg) scale(2.5) translateY(4px) translateX(12px)" }}
          >
            <div>XOXO</div>
            <div className="-mt-1 text-[2rem]">— T</div>
          </div>
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
        lead="Know what to buy, what to skip, and why — so decisions feel calm, intentional, and confident."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
        className="pt-20 pb-16 md:pt-32 md:pb-28"
        textContainerClassName="max-w-full md:max-w-[720px] px-6 md:px-8 p-6 space-y-6 md:space-y-8 leading-relaxed"
        headlineClassName="hero-line-clamp leading-snug"
        leadClassName="mt-10 md:mt-12"
        ctaContainerClassName="mt-8 flex flex-col items-center gap-4"
        primaryAction={
          <Button href="/request-invite" variant="primary" className="px-8 py-4 uppercase tracking-[0.35em]">
            Request an Invite
          </Button>
        }
        secondaryAction={
          <Link
            href="/how-it-works"
            className="flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-80 transition hover:text-[var(--tmbc-mauve)]"
          >
            <span>See How It Works</span>
            <span aria-hidden>→</span>
          </Link>
        }
        heroImage={HERO_IMAGE_REGISTRY.heroMarketingSignature}
      />
      {/* Invite Code Entry */}
      <div id="request-invite" className="mt-12 flex w-full justify-center px-4">
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
      <RibbonDivider />
      <PillarHighlightsSection />
      <TrustSection />
      <div className="my-20 md:my-24">
        <SectionDivider />
      </div>
      <ExperienceIllustrationSection />
      <RibbonDivider />
      <SectionBand bg="white" className="border-t border-black/5 py-20 md:py-24">
        <div className="mx-auto mb-6 max-w-6xl px-6 text-center">
          <p className="text-sm font-light uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
            Mentor-Approved Partnerships
          </p>
        </div>
        <PartnerLogoCarousel logos={partnerLogos} />
        <div className="mx-auto mt-6 md:mt-8 flex max-w-6xl px-6">
          <p className="text-xs md:text-sm text-muted-foreground max-w-3xl text-left">
            These are calm, mentor-approved relationships. If a purchase happens through our guidance, we may earn a small commission at no extra cost, and only when it feels right for your experience.
          </p>
        </div>
      </SectionBand>
      <div className="mx-auto mt-10 max-w-6xl px-6 flex justify-center">
        <JournalSpotlight />
      </div>
    </div>
  );
}
