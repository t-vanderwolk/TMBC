'use client';

import Link from 'next/link';
import { FormEvent } from 'react';

const LoginPage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-tmMauve/30 bg-white/80 p-8 shadow-soft">
      <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Member Login</p>
      <h1 className="mt-2 font-serif text-4xl">Welcome back</h1>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Email</label>
          <input type="email" className="rounded-2xl border border-tmCharcoal/20 px-4 py-3" placeholder="you@email.com" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Password</label>
          <input type="password" className="rounded-2xl border border-tmCharcoal/20 px-4 py-3" placeholder="••••••••" />
        </div>
        <button type="submit" className="w-full rounded-full bg-tmMauve px-8 py-3 text-white">
          Log In
        </button>
      </form>
      <div className="mt-6 text-sm text-tmCharcoal/80">
        <p>
          Need an invite? <Link href="/requestinvite" className="text-tmMauve underline">Request one here.</Link>
        </p>
        <p className="mt-2">
          Ready to complete onboarding?{' '}
          <Link href="/createprofile" className="text-tmMauve underline">
            Create Profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
