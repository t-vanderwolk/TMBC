"use client";

import React from 'react';

type Props = {
  onSync: () => Promise<void>;
  syncing: boolean;
};

export default function RegistryEmptyState({ onSync, syncing }: Props) {
  return (
    <section className="rounded-[32px] border border-dashed border-[#C8A1B4] bg-[#FFF9FC]/80 p-8 text-center text-[#3E2F35]">
      <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/60">MyRegistry is waiting</p>
      <h2 className="mt-3 text-2xl font-semibold">No gifts yet</h2>
      <p className="mt-2 text-sm text-[#3E2F35]/70">
        Sync with MyRegistry to pull the latest items and share them with your guests.
      </p>
      <button
        type="button"
        onClick={onSync}
        disabled={syncing}
        className="mt-6 inline-flex items-center justify-center rounded-full border border-[#3E2F35]/20 bg-[#3E2F35] px-6 py-3 text-[0.75rem] uppercase tracking-[0.4em] text-white transition-colors hover:bg-[#2d2428] disabled:opacity-50"
      >
        {syncing ? 'Syncing…' : 'Sync registry'}
      </button>
    </section>
  );
}
