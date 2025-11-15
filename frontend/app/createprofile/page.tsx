'use client';

import { FormEvent } from 'react';

const CreateProfilePage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="section-wrap">
      <div className="card-surface mx-auto max-w-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Create Profile</p>
        <h1 className="mt-2 text-4xl">Let&apos;s tailor your experience</h1>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-tmCharcoal">Name</label>
          <input className="w-full" placeholder="Your name" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-tmCharcoal">Email</label>
          <input type="email" className="w-full" placeholder="you@email.com" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-tmCharcoal">Password</label>
          <input type="password" className="w-full" placeholder="••••••••" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-tmCharcoal">Invite Code</label>
          <input className="w-full" placeholder="INVITE-CODE" />
        </div>
        <button type="submit" className="btn-primary w-full text-center">
          Save Profile
        </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfilePage;
