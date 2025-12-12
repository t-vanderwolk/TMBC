'use client';

import { Suspense, FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const OnboardingProfileContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = useMemo(() => searchParams.get('userId'), [searchParams]);
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      setError('Missing user details.');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: name.trim() || undefined,
          dueDate: dueDate || undefined,
          location: location.trim() || undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to save your profile.');
      }

      router.push(`/onboarding/mentor?userId=${userId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save your profile.';
      setError(message);
    } finally {
      setStatus('idle');
    }
  };

  if (!userId) {
    return (
      <section className="rounded-[32px] border border-[#E3C6D4] bg-white/95 p-8 shadow-[0_30px_90px_rgba(189,147,189,0.18)]">
        <p className="text-sm font-semibold text-[#D0465F]">Missing invite data. Return to your invite link.</p>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-[#E3C6D4] bg-white/95 p-8 shadow-[0_30px_90px_rgba(189,147,189,0.18)]">
      <div className="space-y-3">
        <p className="text-[0.65rem] uppercase tracking-[0.6em] text-[#C8A1B4]">Step 2 · Profile</p>
        <h2 className="font-serif text-3xl text-[#3E2F35]">Complete your profile</h2>
        <p className="text-sm text-[#3E2F35]/70">
          We only need a few details to tailor your concierge setup. All fields remain editable later.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full name"
          className="w-full rounded-[24px] border border-[#C8A1B4] bg-[#FFF8F4] px-5 py-3 text-sm text-[#3E2F35] placeholder:text-[#BFA9C1] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#EAD4DB]"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="w-full rounded-[24px] border border-[#C8A1B4] bg-[#FFF8F4] px-5 py-3 text-sm text-[#3E2F35] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#EAD4DB]"
        />
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="City, Town, or Region"
          className="w-full rounded-[24px] border border-[#C8A1B4] bg-[#FFF8F4] px-5 py-3 text-sm text-[#3E2F35] placeholder:text-[#BFA9C1] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#EAD4DB]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-[999px] bg-gradient-to-r from-[#F3D7DF] to-[#C8A1B4] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#3E2F35] shadow-[0_15px_35px_rgba(189,147,189,0.6)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'loading' ? 'Saving profile…' : 'Save profile'}
        </button>
      </form>
      {error && (
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.4em] text-[#D0465F]">{error}</p>
      )}
    </section>
  );
};

export default function OnboardingProfilePage() {
  return (
    <Suspense fallback={null}>
      <OnboardingProfileContent />
    </Suspense>
  );
}
