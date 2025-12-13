"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';

import RegistryHero from './components/RegistryHero';
import RegistryItemCard from './components/RegistryItemCard';
import RegistryEmptyState from './components/RegistryEmptyState';
import type { RegistryDto } from '@/lib/services/server/registry.service';

const API_BASE = '/api/registry';

type RegistryResponse = {
  registry: RegistryDto | null;
};

const fetchRegistry = async (): Promise<RegistryResponse> => {
  const response = await fetch(API_BASE, { cache: 'no-store' });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Unable to load registry');
  }
  return response.json();
};

const postAction = async (path: string) => {
  const response = await fetch(path, { method: 'POST', cache: 'no-store' });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Request failed');
  }
  return response.json();
};

export default function RegistryPage() {
  const [registry, setRegistry] = useState<RegistryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const loadRegistry = useCallback(async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      const { registry: payload } = await fetchRegistry();
      setRegistry(payload);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to reach the registry service.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRegistry();
  }, [loadRegistry]);

  const handleCreate = useCallback(async () => {
    setCreating(true);
    setStatusMessage('');
    try {
      const { registry: payload } = await postAction(`${API_BASE}/create`);
      setRegistry(payload);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to create registry.');
    } finally {
      setCreating(false);
    }
  }, []);

  const handleSync = useCallback(async () => {
    setSyncing(true);
    setStatusMessage('');
    try {
      const { registry: payload } = await postAction(`${API_BASE}/sync`);
      setRegistry(payload);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to sync registry.');
    } finally {
      setSyncing(false);
    }
  }, []);

  const totalItems = registry?.items.length ?? 0;
  const purchasedCount = registry?.items.filter((item) => item.status === 'PURCHASED').length ?? 0;

  return (
    <main className="space-y-6 px-4 py-8 text-[#3E2F35] sm:px-6">
      <RegistryHero
        registry={registry}
        loading={loading}
        creating={creating}
        syncing={syncing}
        totalItems={totalItems}
        purchasedCount={purchasedCount}
        lastSyncedAt={registry?.lastSyncedAt ?? null}
        shippingAddress={registry?.shippingAddress ?? null}
        onCreate={handleCreate}
        onSync={handleSync}
      />

      {statusMessage && (
        <div className="rounded-[28px] border border-[#F0CCD7] bg-[#FFF4FA] px-5 py-3 text-sm text-[#8B4A61]">
          {statusMessage}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-[28px] border border-[#C8A1B4]/40 bg-white/80 p-12 text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">
          Checking MyRegistry…
        </div>
      ) : registry ? (
        registry.items.length ? (
          <section className="grid gap-4 md:grid-cols-2">
            {registry.items.map((item) => (
              <RegistryItemCard key={item.id} item={item} />
            ))}
          </section>
        ) : (
          <RegistryEmptyState onSync={handleSync} syncing={syncing} />
        )
      ) : (
        <div className="rounded-[28px] border border-[#C8A1B4]/40 bg-white/80 p-8 text-center text-sm text-[#3E2F35]">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/60">Ready when you are</p>
          <p className="mt-2 text-lg font-semibold">Create a MyRegistry account to pull in your gifts.</p>
          <p className="mt-1 text-[#3E2F35]/70">Use the button above to start the sync and bring everything into TMBC.</p>
        </div>
      )}
    </main>
  );
}
