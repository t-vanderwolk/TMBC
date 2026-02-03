'use client';

// Marketing background cadence is intentional.
// Do not reorder or recolor section backgrounds.
// Pattern: white → ivory → white → blush

import Link from 'next/link';
import { MarketingHeading } from "@/components/marketing/Typography";

// Marketing visual guardrails:
// - All cards/panels use canonical marketing-card / marketing-panel styles
// - No borders, transforms, or hover animations
// - Elevation is soft and consistent across pages

const WaitlistPage = () => {
  return (
    <section className="marketing-section">
      <div className="marketing-card marketing-card-padding mx-auto max-w-[90%] md:max-w-3xl space-y-6 text-[var(--tmbc-charcoal)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70">Waitlist</p>
        <MarketingHeading level="h1" className="mt-2">
          We review every request with care.
        </MarketingHeading>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Taylor-Made Baby Co. memberships are intentionally paced so mentors can offer high-touch concierge support. Our
          team reviews waitlist submissions weekly and replies via email if a spot opens up in your cohort.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="marketing-panel marketing-card-padding text-left space-y-4">
            <MarketingHeading level="h2" className="text-[var(--tmbc-charcoal)]">
              What to expect
            </MarketingHeading>
            <ul className="mkt-bullet-list">
              <li className="mkt-bullet-item">Personalized review by TMBC concierge</li>
              <li className="mkt-bullet-item">Invite shared via email when approved</li>
              <li className="mkt-bullet-item">Mentors match you to the best cohort</li>
            </ul>
          </div>
          <div className="marketing-panel marketing-card-padding text-left space-y-4">
            <MarketingHeading level="h2" className="text-[var(--tmbc-charcoal)]">
              Need a code?
            </MarketingHeading>
            <p className="mt-2 text-base text-[var(--tmbc-charcoal)] text-opacity-70">Already have a code? Validate it instantly.</p>
            <Link href="/request-invite" className="mkt-btn-primary mt-4">
              Request an Invite
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistPage;
