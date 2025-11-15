'use client';

import { FormEvent, useState } from 'react';

const RequestInvitePage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-tmMauve/30 bg-white/80 p-8 shadow-soft">
      <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Request Invite</p>
      <h1 className="mt-2 font-serif text-4xl">We&apos;re so glad you&apos;re here.</h1>
      <p className="mt-2 text-sm text-tmCharcoal/80">
        Tell us about your growing family and why you&apos;re drawn to Taylor-Made Baby Co. This form is a placeholder and
        does not send data yet.
      </p>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Name</label>
          <input className="rounded-2xl border border-tmCharcoal/20 px-4 py-3" required placeholder="Your full name" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Email</label>
          <input type="email" className="rounded-2xl border border-tmCharcoal/20 px-4 py-3" required placeholder="you@email.com" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Why do you want to join TMBC?</label>
          <textarea
            required
            className="min-h-[140px] rounded-2xl border border-tmCharcoal/20 px-4 py-3"
            placeholder="Share your story or questions."
          />
        </div>
        <button type="submit" className="rounded-full bg-tmMauve px-8 py-3 text-white">
          Submit Request
        </button>
        {submitted && <p className="text-sm text-tmMauve">Thanks! We&apos;ll connect soon.</p>}
      </form>
    </div>
  );
};

export default RequestInvitePage;
