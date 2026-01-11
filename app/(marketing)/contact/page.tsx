"use client";

import Link from "next/link";
import MarketingHero from "@/components/marketing/MarketingHero";
import MarketingContent from "@/components/marketing/MarketingContent";

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
      <MarketingHero
        imageSrc="/assets/images/hero-marketing-signature.png"
        imageAlt="Taylor-Made Baby Co. hero art"
        imageWidth={1536}
        imageHeight={1024}
        headline="We’re here — thoughtfully."
        supportingText="Questions, notes, or unclear threads? Reach out and we’ll respond with calm."
        primaryCta={{
          label: "Request an Invite",
          href: "/request-invite",
          className: "marketing-btn marketing-btn-primary marketing-btn-primary-medium uppercase tracking-[0.35em]",
        }}
        motion
      />
      <MarketingContent>
        <div className="marketing-content space-y-16 text-[var(--tmbc-charcoal)]">
          <section className="marketing-section marketing-card mx-auto max-w-3xl rounded-[36px] bg-[var(--tmbc-ivory)]/90 px-8 py-20 text-center shadow-[0_20px_80px_rgba(199,166,199,0.25)]">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)] text-opacity-60">
              Contact
            </p>
            <p className="mt-4 text-base text-[var(--tmbc-charcoal)] text-opacity-80 max-w-3xl mx-auto">
              Questions, notes, or threads you’re unsure where to place? Reach out and we’ll respond with calm.
            </p>
            <p className="mt-4 text-xs text-[var(--tmbc-charcoal)] text-opacity-60">
              We read every message. Replies may take a moment—care feels better than speed.
            </p>
          </section>

          <section className="marketing-section mx-auto max-w-3xl">
            <div className="marketing-card rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/90 px-8 py-10 shadow-[0_25px_70px_rgba(199,166,199,0.15)]">
              <div className="space-y-6 text-left">
                {contactDetails.map((detail) => (
                  <div key={detail.label}>
                    <p className="text-xs uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] text-opacity-60">
                      {detail.label}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl text-[var(--tmbc-charcoal)]">{detail.headline}</h2>
                    <p className="mt-2 text-sm text-[var(--tmbc-charcoal)] text-opacity-75">{detail.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="marketing-section marketing-card mx-auto max-w-2xl rounded-[32px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/90 px-8 py-16 text-center shadow-[0_25px_70px_rgba(199,166,199,0.15)]">
            <p className="text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              Still wondering if this is right for you? You’re always welcome to learn more or use the emails above to reach out.
            </p>
            <p className="mt-4 text-sm text-[var(--tmbc-charcoal)] text-opacity-80">
              When you’re ready, you can also{" "}
              <Link href="/request-invite" className="text-[var(--tmbc-charcoal)] underline">
                request an invite
              </Link>
              .
            </p>
          </section>
        </div>
      </MarketingContent>
    </>
  );
}
