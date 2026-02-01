import Image from "next/image";
import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import SectionDivider from "@/components/marketing/SectionDivider";
import PartnerLogoCarousel from "@/components/marketing/PartnerLogoCarousel";
import FadeInSection from "@/components/motion/FadeInSection";
import Button from "@/components/ui/Button";
import learnPillar from "@/assets/images/learnpillar.png";
import planPillar from "@/assets/images/planpillar.png";
import connectPillar from "@/assets/images/connectpillar.png";
import reflectPillar from "@/assets/images/reflectpillar.png";
import homepageHero from "@/assets/images/homepagehero.png";

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
    <section className="marketing-section section-ivory py-28 sm:py-32">
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
    <section className="marketing-section section-ivory py-28 sm:py-32">
      <MarketingContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">Pillars that shape the experience</p>
            <h2 className="mkt-h2 font-playfair text-[var(--tmbc-charcoal)] tracking-[0.02em] leading-[1.2]">
              Learn · Plan · Connect · Reflect—
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {pillarHighlights.map((pillar, index) => (
              <article
                key={pillar.title}
                className="flex flex-col overflow-hidden rounded-[28px] border border-[rgba(243,214,223,0.56)] bg-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
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
                  <h3 className="font-playfair text-2xl leading-6">{pillar.headline}</h3>
                  <p className="text-sm leading-[1.6] text-[var(--tmbc-charcoal)] text-opacity-80">{pillar.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </MarketingContent>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="marketing-section section-blush py-28 sm:py-32">
      <MarketingContent>
        <div className="space-y-10">
          <div className="marketing-text-panel max-w-[680px] space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">How we keep care calm</p>
            <h2 className="mkt-h2 font-playfair text-[var(--tmbc-charcoal)] tracking-[0.02em] leading-[1.2]">
              You arrive when you’re ready; we keep the space gentle, patient, and always on your timeline.
            </h2>
            <p className="mkt-body text-[var(--tmbc-charcoal)] text-opacity-80">
              No hard launches, no rushed timelines—only thoughtful, mentor-led pacing so you feel supported while
              being invited to take the next calm step when the moment is right.
            </p>
          </div>
          <article className="rounded-[28px] border border-[var(--tmbc-ivory)]/70 bg-white/80 px-6 py-8 text-[var(--tmbc-charcoal)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">Journal spotlight</p>
            <h3 className="mt-3 mkt-h2 font-playfair text-[var(--tmbc-charcoal)] text-[26px] leading-[1.3]">
              Thoughtful guidance, shared gently.
            </h3>
            <p className="mt-3 mkt-body text-[var(--tmbc-charcoal)] text-opacity-70">
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
        <h2 className="mkt-h2 font-playfair text-[var(--tmbc-charcoal)] tracking-[0.02em] leading-[1.2]">
          Ready when you are—no rush, just thoughtful care.
        </h2>
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
    <main className="bg-[var(--tmbc-ivory)] text-[var(--tmbc-charcoal)]">
      {/* Mobile spacing rule:
          Marketing sections should breathe on mobile.
          Prefer py-20+ over dense stacking. */}
      {/* Hero must render instantly: never wrap in FadeInSection */}
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
        }}
        imageSrc={homepageHero}
        imageAlt="Taylor-Made Baby Co. marketing hero"
        priority
      />
      <SectionDivider />
      <FadeInSection delayMs={80}>
        <ReassuranceBand />
      </FadeInSection>
      <SectionDivider />
      <FadeInSection delayMs={160}>
        <PillarHighlightsSection />
      </FadeInSection>
      <SectionDivider />
      <FadeInSection delayMs={240}>
        <TrustSection />
      </FadeInSection>
      <SectionDivider />
      <FadeInSection delayMs={320}>
        <section className="marketing-section section-blush section-transition py-28 sm:py-32 pb-36">
          <MarketingContent>
            <PartnerLogoCarousel />
          </MarketingContent>
        </section>
      </FadeInSection>
      <SectionDivider />
      <FadeInSection delayMs={400}>
        <section className="marketing-section section-ivory py-28 sm:py-32">
          <MarketingContent>
            <FinalCTA />
          </MarketingContent>
        </section>
      </FadeInSection>
    </main>
  );
}
