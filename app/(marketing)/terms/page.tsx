import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import { MarketingHeading } from "@/components/marketing/Typography";
import { SectionBand, textCage } from "@/components/marketing/MarketingCadence";

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

import { HERO_IMAGE_REGISTRY } from "@/lib/heroImages";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

const heroSection = (
  <MarketingHero
    eyebrow="Terms"
    headline="Terms of use"
    lead="Taylor-Made Baby Co. is built for families who value clarity. These terms keep the community safe while mentors and admins collaborate."
    primaryCta={{ label: "Request an Invite", href: "/request-invite" }}
    heroImage={HERO_IMAGE_REGISTRY.heroMarketingSignature}
  />
);

export default function TermsPage() {
  return (
    <>
      {/* Hero must render instantly and avoid additional entrance wrappers. */}
      {heroSection}
      <SectionBand bg="white">
        <div className={`${textCage("standard")} text-[var(--tmbc-charcoal)] text-opacity-80 space-y-4`}>
          <p className="text-sm">
            Access to our marketing site and dashboards requires following our community guidelines. Use of the site implies
            agreement with our policies and respect for mentors, members, and admins who share their time here.
          </p>
          <p className="text-sm">
            You may not reverse engineer, redistribute, or misuse any content, and we reserve the right to suspend access
            if behavior violates these terms.
          </p>
          <p className="text-sm">
            If you have questions about any clause, email{" "}
            <Link href="/contact" className="text-[var(--tmbc-mauve)] underline">
              support@taylormadebaby.co
            </Link>
            .
          </p>
        </div>
      </SectionBand>
      <SectionBand bg="ivory">
        <div className="mx-auto max-w-3xl space-y-3">
          <MarketingHeading level="h2">Need help?</MarketingHeading>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-75">
            Review the Privacy Policy, or visit the Journal to see how we keep content rooted in trust.
          </p>
        </div>
      </SectionBand>
      <SectionBand bg="blush">
        <div className={`${textCage("intro")} text-center space-y-3`}>
          <Link href="/privacy" className="text-sm uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
            Privacy
          </Link>
          <Link href="/request-invite" className="text-sm uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
            Request an Invite
          </Link>
        </div>
      </SectionBand>
      <SectionBand bg="white">
        <div className={`${textCage("intro")} text-center`}>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            Questions? We’re keeping care calm and human—just reach out.
          </p>
        </div>
      </SectionBand>
    </>
  );
}
