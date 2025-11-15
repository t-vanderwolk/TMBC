'use client';

import { FormEvent } from 'react';

const CreateProfilePage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-tmMauve/30 bg-white/80 p-8 shadow-soft">
      <p className="text-sm uppercase tracking-[0.4em] text-tmMauve">Create Profile</p>
      <h1 className="mt-2 font-serif text-4xl">Let&apos;s tailor your experience</h1>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Name</label>
          <input className="rounded-2xl border border-tmCharcoal/20 px-4 py-3" placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Email</label>
          <input type="email" className="rounded-2xl border border-tmCharcoal/20 px-4 py-3" placeholder="you@email.com" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Password</label>
          <input type="password" className="rounded-2xl border border-tmCharcoal/20 px-4 py-3" placeholder="••••••••" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Invite Code</label>
          <input className="rounded-2xl border border-tmCharcoal/20 px-4 py-3" placeholder="INVITE-CODE" />
        </div>
        <button type="submit" className="w-full rounded-full bg-tmMauve px-8 py-3 text-white">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CreateProfilePage;
