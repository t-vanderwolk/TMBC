import Link from "next/link";
import MarketingContent from "@/components/marketing/MarketingContent";
import MarketingHero from "@/components/marketing/MarketingHero";
import SectionDivider from "@/components/marketing/SectionDivider";

const heroSection = (
  <MarketingHero
    eyebrow="Terms"
    imageSrc="/images/marketing/home-hero.png"
    imageAlt="Soft ribbon background"
    headline="Terms of use"
    lead="Taylor-Made Baby Co. is built for families who value clarity. These terms keep the community safe while mentors and admins collaborate."
    primaryCta={{ label: "Request an Invite", href: "/request-invite" }}
  />
);

export default function TermsPage() {
  return (
    <>
      {heroSection}
      <MarketingContent>
        <div className="marketing-content space-y-10 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section space-y-4 text-[var(--tmbc-charcoal)] text-opacity-80">
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
          </section>
          <SectionDivider />
          <section className="marketing-section space-y-3">
            <h2 className="font-serif text-2xl text-[var(--tmbc-charcoal)]">Need help?</h2>
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-75">
              Review the Privacy Policy, or visit the Journal to see how we keep content rooted in trust.
            </p>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
