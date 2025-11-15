'use client';

import Link from 'next/link';

const WaitlistSuccessPage = () => {
  return (
    <div className="section-wrap">
      <div className="card-surface mx-auto max-w-xl space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Waitlist received</p>
        <h1 className="text-4xl">Thank you for your request.</h1>
        <p className="text-sm text-tmCharcoal/80">
          Your application has been added to the Taylor-Made Baby Co. waitlist. A concierge mentor will review your details
          soon and reach out via email when a spot opens up.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
          <Link href="/requestinvite" className="btn-secondary text-center">
            Enter Invite Code
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSuccessPage;
