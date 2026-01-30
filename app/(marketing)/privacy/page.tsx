import Link from "next/link";
import MarketingContent from "@/components/marketing/MarketingContent";
import MarketingHero from "@/components/marketing/MarketingHero";
import SectionDivider from "@/components/marketing/SectionDivider";

const heroSection = (
  <MarketingHero
    eyebrow="Privacy"
    imageSrc="/images/marketing/home-hero.png"
    imageAlt="Soft ribbon background"
    headline="Privacy policy"
    lead="Our commitment to parents is grounded in transparency. Here’s how we collect, use, and safeguard the information you share."
    primaryCta={{ label: "Request an Invite", href: "/request-invite" }}
  />
);

export default function PrivacyPage() {
  return (
    <>
      {heroSection}
      <MarketingContent>
        <div className="marketing-content space-y-10 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section space-y-4 text-[var(--tmbc-charcoal)] text-opacity-80">
            <p className="text-sm">
              We collect only what helps us tailor the Taylor-Made Baby experience—account information, preferences,
              and interactions that help mentors and thoughtful parents collaborate safely.
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
          </section>
          <SectionDivider />
          <section className="marketing-section space-y-3">
            <h2 className="font-serif text-2xl text-[var(--tmbc-charcoal)]">Quick links</h2>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70">
              <Link href="/blog" className="text-[var(--tmbc-mauve)]">
                Journal
              </Link>
              <Link href="/request-invite" className="text-[var(--tmbc-mauve)]">
                Request an Invite
              </Link>
            </div>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
