import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import { MarketingHeading } from "@/components/marketing/Typography";
import homeHeroImage from "@/assets/images/home-hero.png";
import { SectionBand, textCage } from "@/components/marketing/MarketingCadence";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

const heroSection = (
  <MarketingHero
    eyebrow="Privacy"
    imageSrc={homeHeroImage}
    imageAlt="Soft ribbon background"
    headline="Privacy policy"
    lead="Our commitment to parents is grounded in transparency. Here’s how we collect, use, and safeguard the information you share."
    primaryCta={{ label: "Request an Invite", href: "/request-invite" }}
  />
);

export default function PrivacyPage() {
  return (
    <>
      {/* Hero must render instantly and avoid additional entrance wrappers. */}
      {heroSection}
      <SectionBand bg="white">
        <div className={`${textCage("standard")} text-[var(--tmbc-charcoal)] text-opacity-80 space-y-4`}>
          <p className="text-sm">
            We collect only what helps us tailor the Taylor-Made Baby experience—account information, preferences, and
            interactions that help mentors and thoughtful parents collaborate safely.
          </p>
          <p className="text-sm">
            Your data lives securely, never sold, and always handled with care. You can request deletion or corrections
            at any time by contacting support.
          </p>
          <p className="text-sm">
            For full details about cookies, analytics, and retention, please email{" "}
            <Link href="/contact" className="text-[var(--tmbc-mauve)] underline">
              support@taylormadebaby.co
            </Link>
            .
          </p>
        </div>
      </SectionBand>
      <SectionBand bg="ivory">
        <div className="mx-auto max-w-3xl space-y-3">
          <MarketingHeading level="h2">Quick links</MarketingHeading>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70">
            <Link href="/blog" className="text-[var(--tmbc-mauve)]">
              Journal
            </Link>
            <Link href="/request-invite" className="text-[var(--tmbc-mauve)]">
              Request an Invite
            </Link>
          </div>
        </div>
      </SectionBand>
      <SectionBand bg="blush">
        <div className={`${textCage("intro")} text-center`}>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            Questions about privacy? Reach out anytime—we keep the conversation calm.
          </p>
          <Link href="/contact" className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] underline">
            Contact support
          </Link>
        </div>
      </SectionBand>
      <SectionBand bg="white">
        <div className={`${textCage("intro")} text-center`}>
          <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
            Privacy is ongoing work; we keep updates gentle and transparent.
          </p>
        </div>
      </SectionBand>
    </>
  );
}
