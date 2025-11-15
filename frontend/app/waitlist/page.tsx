'use client';

import Link from 'next/link';

const WaitlistPage = () => {
  return (
    <div className="section-wrap">
      <div className="card-surface mx-auto max-w-3xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Waitlist</p>
        <h1 className="text-4xl">We review every request with care.</h1>
        <p className="text-sm text-tmCharcoal/80">
          Taylor-Made Baby Co. memberships are intentionally paced so mentors can offer high-touch concierge support. Our
          team reviews waitlist submissions weekly and replies via email if a spot opens up in your cohort.
        </p>
        <div className="grid gap-4 text-sm text-tmCharcoal/80 md:grid-cols-2">
          <div className="rounded-3xl border border-tmDust bg-white/70 p-6">
            <h2 className="text-2xl">What to expect</h2>
            <ul className="mt-4 space-y-2 text-left">
              <li>• Personalized review by TMBC concierge</li>
              <li>• Invite shared via email when approved</li>
              <li>• Mentors match you to the best cohort</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-tmDust bg-white/70 p-6 text-left">
            <h2 className="text-2xl">Need a code?</h2>
            <p className="mt-2">Already have a code? Validate it instantly.</p>
            <Link href="/requestinvite" className="btn-primary mt-4 inline-block">
              Return to Invite Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;
