"use client";

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";
import { MarketingHeading } from "@/components/marketing/Typography";
import homeHeroImage from "@/assets/images/home-hero.png";

const contactDetails = [
  {
    label: "General questions, partnerships, press",
    headline: "taylor@taylormadebabyco.com",
    body: "General notes, clarity before requesting an invite, or a gentle hello.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero must render instantly and avoid additional entrance wrappers. */}
      <MarketingHero
        eyebrow="Contact"
        imageSrc={homeHeroImage}
        imageAlt="Taylor-Made Baby Co. hero art"
        headline="We’re here — thoughtfully."
        lead="Questions, notes, or unclear threads? Reach out and we’ll respond with calm."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
        }}
      />

      <section className="bg-[--tmbc-bg-white] py-20">
        <MarketingContent>
          <div className="marketing-card mx-auto max-w-3xl rounded-[36px] px-8 py-20 text-center shadow-[0_20px_80px_rgba(199,166,199,0.25)]">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">Contact</p>
            <p className="mt-4 text-base text-[var(--tmbc-charcoal)] text-opacity-80 max-w-3xl mx-auto">
              Questions, notes, or threads you’re unsure where to place? Reach out and we’ll respond with calm.
            </p>
            <p className="mt-4 text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
              We read every message. Replies may take a moment—care feels better than speed.
            </p>
          </div>
        </MarketingContent>
      </section>

      <section className="bg-[--tmbc-bg-ivory] py-20">
        <MarketingContent>
          <div className="space-y-10 mx-auto max-w-6xl px-6 text-left">
            <div className="marketing-card rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/90 px-8 py-10 shadow-[0_25px_70px_rgba(199,166,199,0.15)]">
              <div className="space-y-6">
                {contactDetails.map((detail) => (
                  <div key={detail.label}>
                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                      {detail.label}
                    </p>
                    <MarketingHeading level="h2" className="mt-2 text-[var(--tmbc-charcoal)]">
                      {detail.headline}
                    </MarketingHeading>
                    <p className="mt-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-75">{detail.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MarketingContent>
      </section>

      <section className="bg-[--tmbc-bg-white] py-20">
        <MarketingContent>
          <div className="marketing-card mx-auto max-w-2xl rounded-[32px] border border-[var(--tmbc-mauve)]/20 px-8 py-16 text-center shadow-[0_25px_70px_rgba(199,166,199,0.15)]">
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Still wondering if this is right for you? You’re always welcome to learn more or use the emails above to reach out.
            </p>
          </div>
        </MarketingContent>
      </section>

      <section className="bg-[--tmbc-bg-blush] py-20">
        <MarketingContent>
          <div className="marketing-card mx-auto max-w-2xl rounded-[32px] border border-[var(--tmbc-mauve)]/20 px-8 py-16 text-center shadow-[0_25px_70px_rgba(199,166,199,0.15)]">
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              When you’re ready, you can also{' '}
              <Link href="/request-invite" className="text-[var(--tmbc-charcoal)] underline">
                Request an Invite
              </Link>
              .
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/request-invite" className="mkt-btn-primary">
                Request an Invite
              </Link>
            </div>
          </div>
        </MarketingContent>
      </section>
    </>
  );
}
