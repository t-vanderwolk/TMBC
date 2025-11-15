'use client';

import { FormEvent, useState } from 'react';

const RequestInvitePage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="section-wrap">
      <div className="card-surface mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Request Invite</p>
        <h1 className="mt-2 text-4xl">We&apos;re so glad you&apos;re here.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/80">
          Tell us about your growing family and why you&apos;re drawn to Taylor-Made Baby Co. This form is a placeholder and
          does not send data yet.
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-tmCharcoal">Name</label>
          <input className="w-full" required placeholder="Your full name" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-tmCharcoal">Email</label>
          <input type="email" className="w-full" required placeholder="you@email.com" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-tmCharcoal">Why do you want to join TMBC?</label>
          <textarea
            required
            className="min-h-[140px] w-full rounded-3xl border-tmDust bg-white px-4 py-3 text-sm text-tmCharcoal placeholder:text-[#C1AEB6]"
            placeholder="Share your story or questions."
          />
        </div>
        <button type="submit" className="btn-primary">
          Submit Request
        </button>
        {submitted && <p className="text-sm text-tmMauve">Thanks! We&apos;ll connect soon.</p>}
        </form>
      </div>
    </div>
  );
};

export default RequestInvitePage;
