'use client';

import Link from 'next/link';

const WaitlistPage = () => {
  return (
    <section className="marketing-section">
      <div className="mx-auto max-w-[90%] md:max-w-3xl rounded-[32px] border border-[var(--tmbc-mauve)]/30 bg-white/90 p-8 shadow-[0_25px_60px_rgba(199,166,199,0.25)] text-[var(--tmbc-charcoal)]">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)] text-opacity-70">Waitlist</p>
        <h1 className="mt-2 text-2xl md:text-4xl">We review every request with care.</h1>
        <p className="text-base text-[var(--tmbc-charcoal)] text-opacity-70">
          Taylor-Made Baby Co. memberships are intentionally paced so mentors can offer high-touch concierge support. Our
          team reviews waitlist submissions weekly and replies via email if a spot opens up in your cohort.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-[28px] border border-[var(--tmbc-mauve)]/30 bg-white/70 p-6 text-left">
            <h2 className="text-2xl sm:text-3xl">What to expect</h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--tmbc-charcoal)] text-opacity-70">
              <li>• Personalized review by TMBC concierge</li>
              <li>• Invite shared via email when approved</li>
              <li>• Mentors match you to the best cohort</li>
            </ul>
          </div>
          <div className="rounded-[28px] border border-[var(--tmbc-mauve)]/30 bg-white/70 p-6 text-left">
            <h2 className="text-2xl sm:text-3xl">Need a code?</h2>
            <p className="mt-2 text-base text-[var(--tmbc-charcoal)] text-opacity-70">Already have a code? Validate it instantly.</p>
            <Link href="/request-invite" className="marketing-btn marketing-btn-primary mt-4 uppercase tracking-[0.35em]">
              Return to Invite Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistPage;
