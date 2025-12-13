"use client";

import { RegistryDto, RegistryShippingAddress } from '@/lib/services/server/registry.service';

type RegistryHeroProps = {
  registry: RegistryDto | null;
  loading: boolean;
  creating: boolean;
  syncing: boolean;
  totalItems: number;
  purchasedCount: number;
  lastSyncedAt: string | null;
  shippingAddress: RegistryShippingAddress | null;
  onCreate: () => Promise<void>;
  onSync: () => Promise<void>;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

export default function RegistryHero({
  registry,
  loading,
  creating,
  syncing,
  totalItems,
  purchasedCount,
  lastSyncedAt,
  shippingAddress,
  onCreate,
  onSync,
}: RegistryHeroProps) {
  if (loading) {
    return (
      <section className="rounded-[32px] border border-[#C8A1B4]/30 bg-white/90 p-6 shadow-[0_25px_80px_rgba(199,166,199,0.25)]">
        <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[#3E2F35]/60">Dynamic Registry</p>
        <div className="mt-4 h-36 animate-pulse rounded-2xl bg-[#F7F2F5]" />
      </section>
    );
  }

  const hasRegistry = Boolean(registry);

  return (
    <section className="rounded-[36px] border border-[#C8A1B4]/40 bg-white/80 p-6 shadow-[0_30px_90px_rgba(199,166,199,0.25)]">
      <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/60">Dynamic Registry</p>
      <h1 className="mt-3 text-3xl font-serif text-[#3E2F35]">
        {hasRegistry ? 'Your MyRegistry gifts' : 'Taylor-Made registry center'}
      </h1>
      <p className="mt-2 text-sm text-[#3E2F35]/70">
        {hasRegistry
          ? 'Every synced item stays inside TMBC with mentor context and affiliate-ready links.'
          : 'Create a MyRegistry account to keep all of your gifts, notes, and mentor guidance in one place.'}
      </p>

      {hasRegistry ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[28px] border border-[#3E2F35]/10 bg-[#FFFAF8] p-4 text-sm">
            <p className="text-[0.55rem] uppercase tracking-[0.5em] text-[#3E2F35]/60">Total items</p>
            <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{totalItems}</p>
          </div>
          <div className="rounded-[28px] border border-[#3E2F35]/10 bg-white p-4 text-sm">
            <p className="text-[0.55rem] uppercase tracking-[0.5em] text-[#3E2F35]/60">Purchased</p>
            <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{purchasedCount}</p>
          </div>
          <div className="flex items-center justify-between rounded-[28px] border border-[#C8A1B4]/40 bg-[#F7F0F7] p-4 text-sm">
            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.5em] text-[#3E2F35]/60">Sync status</p>
              <p className="mt-1 text-lg font-semibold text-[#3E2F35]">{lastSyncedAt ? formatDate(lastSyncedAt) : 'Pending'}</p>
            </div>
            <button
              type="button"
              onClick={onSync}
              disabled={syncing}
              className="rounded-full border border-[#3E2F35]/20 px-5 py-2 text-[0.7rem] uppercase tracking-[0.4em] text-[#3E2F35] transition-colors hover:border-[#3E2F35] disabled:opacity-50"
            >
              {syncing ? 'Syncing…' : 'Sync now'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4 rounded-[28px] border border-[#E0C5D3] bg-[#FFF9FC] p-5 text-sm text-[#3E2F35]">
          <p className="text-[0.75rem] uppercase tracking-[0.5em] text-[#C8A1B4]">Connect</p>
          <p className="text-lg font-semibold">Create your MyRegistry account</p>
          <p className="text-sm text-[#3E2F35]/70">
            MyRegistry handles universal gifting while TMBC keeps the experience warm and contextual.
          </p>
          <button
            type="button"
            onClick={onCreate}
            disabled={creating}
            className="w-full rounded-full border border-[#3E2F35]/20 bg-[#3E2F35] px-5 py-3 text-[0.75rem] uppercase tracking-[0.4em] text-white transition-colors hover:bg-[#2d2428] disabled:opacity-50"
          >
            {creating ? 'Creating…' : 'Create registry'}
          </button>
        </div>
      )}

      {shippingAddress && (
        <p className="mt-4 text-[0.7rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
          Shipping to {shippingAddress.line1}, {shippingAddress.city}, {shippingAddress.state}
        </p>
      )}
      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.5em] text-[#7B4E62]/80">
        Powered by MyRegistry
      </p>
    </section>
  );
}
