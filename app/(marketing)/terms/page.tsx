import Link from "next/link";
import MarketingContent from "@/components/marketing/MarketingContent";
import MarketingHero from "@/components/marketing/MarketingHero";
import { MarketingHeading } from "@/components/marketing/Typography";
import homeHeroImage from "@/assets/images/home-hero.png";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

const heroSection = (
  <MarketingHero
    eyebrow="Terms"
    imageSrc={homeHeroImage}
    imageAlt="Soft ribbon background"
    headline="Terms of use"
    lead="Taylor-Made Baby Co. is built for families who value clarity. These terms keep the community safe while mentors and admins collaborate."
    primaryCta={{ label: "Request an Invite", href: "/request-invite" }}
  />
);

export default function TermsPage() {
  return (
    <>
      {/* Hero must render instantly and avoid additional entrance wrappers. */}
      {heroSection}
      <section className="bg-[--tmbc-bg-white] py-20">
        <MarketingContent>
          <div className="marketing-content mx-auto max-w-4xl space-y-4 text-[var(--tmbc-charcoal)] text-opacity-80">
            <p className="text-sm">
              Access to our marketing site and dashboards requires following our community guidelines. Use of the site
              implies agreement with our policies and respect for mentors, members, and admins who share their time here.
            </p>
            <p className="text-sm">
              You may not reverse engineer, redistribute, or misuse any content, and we reserve the right to suspend
              access if behavior violates these terms.
            </p>
            <p className="text-sm">
              If you have questions about any clause, email{" "}
              <Link href="/contact" className="text-[var(--tmbc-mauve)] underline">
                support@taylormadebaby.co
              </Link>
              .
            </p>
          </div>
        </MarketingContent>
      </section>
      <section className="bg-[--tmbc-bg-ivory] py-20">
        <MarketingContent>
          <div className="marketing-content mx-auto max-w-3xl space-y-3">
            <MarketingHeading level="h2">
              Need help?
            </MarketingHeading>
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-75">
              Review the Privacy Policy, or visit the Journal to see how we keep content rooted in trust.
            </p>
          </div>
        </MarketingContent>
      </section>
      <section className="bg-[--tmbc-bg-white] py-20">
        <MarketingContent>
          <div className="marketing-content mx-auto max-w-2xl text-center space-y-3">
            <Link href="/privacy" className="text-sm uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
              Privacy
            </Link>
            <Link href="/request-invite" className="text-sm uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]">
              Request an Invite
            </Link>
          </div>
        </MarketingContent>
      </section>
      <section className="bg-[--tmbc-bg-blush] py-16">
        <MarketingContent>
          <div className="marketing-content mx-auto max-w-3xl text-center">
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Questions? We’re keeping care calm and human—just reach out.
            </p>
          </div>
        </MarketingContent>
      </section>
    </>
  );
}
