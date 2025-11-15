'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { inviteApi, waitlistApi } from '@/lib/api';

const RequestInvitePage = () => {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [waitlistError, setWaitlistError] = useState('');
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const handleValidateCode = async () => {
    if (!inviteCode) {
      setInviteError('Enter your invite code to continue.');
      return;
    }

    try {
      setInviteLoading(true);
      setInviteError('');
      await inviteApi.validate(inviteCode);
      router.push(`/createprofile?code=${inviteCode}`);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Invite not found. Double-check your code.';
      setInviteError(message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleWaitlist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (waitlistLoading) return;

    try {
      setWaitlistError('');
      setWaitlistLoading(true);
      await waitlistApi.join({ name, email });
      router.push('/waitlist/success');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Unable to join waitlist right now.';
      setWaitlistError(message);
    } finally {
      setWaitlistLoading(false);
    }
  };

  return (
    <div className="section-wrap">
      <div className="card-surface mx-auto max-w-3xl space-y-10">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Invite journey</p>
          <h1 className="mt-2 text-4xl">We&apos;re so glad you&apos;re here.</h1>
          <p className="mt-2 text-sm text-tmCharcoal/80">
            Already have a code or need to join the waitlist? Choose the path that fits where you are today.
          </p>
        </div>

        <div className="rounded-3xl border border-tmDust bg-white/70 p-6">
          <h2 className="text-2xl">Enter Invite Code</h2>
          <p className="mt-2 text-sm text-tmCharcoal/80">
            Members and mentors can share codes. Validate yours to unlock onboarding.
          </p>
          <div className="mt-6 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter your invite code"
              value={inviteCode}
              onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
              className="w-full"
            />
            <button
              className="btn-primary disabled:opacity-60"
              onClick={handleValidateCode}
              disabled={inviteLoading}
            >
              {inviteLoading ? 'Checking...' : 'Use Invite Code'}
            </button>
            {inviteError && <p className="text-sm font-medium text-red-500">{inviteError}</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-tmDust bg-white/70 p-6">
          <h2 className="text-2xl">Join the Waitlist</h2>
          <p className="mt-2 text-sm text-tmCharcoal/80">
            We review every application personally. If you&apos;re referred by a member, mention them below.
          </p>
          <form className="mt-6 space-y-5" onSubmit={handleWaitlist}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">Name</label>
              <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Your full name" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@email.com"
              />
            </div>
            <button type="submit" className="btn-secondary w-full text-center disabled:opacity-60" disabled={waitlistLoading}>
              {waitlistLoading ? 'Submitting...' : 'Join Waitlist'}
            </button>
            {waitlistError && <p className="text-sm font-medium text-red-500">{waitlistError}</p>}
          </form>
          <p className="mt-4 text-xs text-tmCharcoal/70">
            Already submitted?{' '}
            <Link href="/waitlist" className="text-tmMauve underline">
              Learn about the review process.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestInvitePage;
