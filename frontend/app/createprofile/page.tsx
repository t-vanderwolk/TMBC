'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';

import { inviteApi } from '@/lib/api';
import { Auth } from '@/lib/auth';

const CreateProfileContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = (searchParams.get('code') || '').toUpperCase();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) {
      setStatus('error');
      setError('Invite code missing. Return to the invite page to get started.');
      return;
    }

    const fetchInvite = async () => {
      try {
        setStatus('loading');
        const response = await inviteApi.validate(code);
        const invite = response.data?.invite;
        if (invite?.email) {
          setEmail(invite.email);
        }
        setStatus('ready');
      } catch (err: any) {
        setStatus('error');
        const message = err?.response?.data?.message || 'Invite not found or already used.';
        setError(message);
      }
    };

    void fetchInvite();
  }, [code]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code) return;

    try {
      setLoading(true);
      setError('');
      const response = await inviteApi.consume({ code, email, password, name });
      const { token, user } = response.data;

      Auth.save(token);
      const payload = Auth.decode();
      const role = (payload?.role || user?.role || 'member').toLowerCase();

      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else if (role === 'mentor') {
        router.push('/dashboard/mentor');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Unable to create profile with this invite.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'error') {
    return (
      <div className="section-wrap">
        <div className="card-surface mx-auto max-w-xl space-y-4 text-center">
          <h1 className="text-3xl">Invite not found</h1>
          <p className="text-sm text-tmCharcoal/80">{error}</p>
          <Link href="/request-invite" className="btn-primary">
            Return to Invite Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-wrap">
      <div className="card-surface mx-auto max-w-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Create Profile</p>
        <h1 className="mt-2 text-4xl">Let&apos;s tailor your experience</h1>
        <p className="mt-2 text-sm text-tmCharcoal/80">
          Invite Code: <span className="font-mono text-tmMauve">{code || 'N/A'}</span>
        </p>
        {status !== 'ready' ? (
          <p className="mt-6 text-sm text-tmCharcoal/70">Validating your invite code...</p>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">Name</label>
              <input className="w-full" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">Email</label>
              <input
                type="email"
                className="w-full"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-tmCharcoal">Password</label>
              <input
                type="password"
                className="w-full"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <button type="submit" className="btn-primary w-full text-center disabled:opacity-60" disabled={loading}>
              {loading ? 'Creating profile...' : 'Save Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const InviteSuspenseFallback = () => (
  <div className="section-wrap">
    <div className="card-surface mx-auto max-w-xl space-y-3 text-center">
      <p className="font-script text-3xl text-tmMauve">Taylor-Made</p>
      <p className="font-serif text-xs uppercase tracking-[0.5em] text-tmCharcoal">Baby Co.</p>
      <p className="text-sm text-tmCharcoal/80">Collecting your invite details…</p>
    </div>
  </div>
);

const CreateProfilePage = () => (
  <Suspense fallback={<InviteSuspenseFallback />}>
    <CreateProfileContent />
  </Suspense>
);

export default CreateProfilePage;
