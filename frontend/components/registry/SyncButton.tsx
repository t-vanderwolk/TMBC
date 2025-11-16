'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import type { RegistryConflict, RegistryItem, RegistrySyncState } from '@/types/registry';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'conflict';

type SyncButtonProps = {
  onItemsUpdated: (items: RegistryItem[]) => void;
  onConflictsUpdate: (conflicts: RegistryConflict[]) => void;
  onFallback: (items: RegistryItem[], error: string) => void;
  onSyncState?: (state: RegistrySyncState) => void;
  initialState?: RegistrySyncState;
};

const statusCopy: Record<SyncStatus, string> = {
  idle: 'Idle',
  syncing: 'Syncing…',
  synced: 'Synced ✓',
  conflict: 'Conflict Detected ⚠️',
};

const formatTimestamp = (value: string | null) => {
  if (!value) return null;
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString();
  } catch {
    return null;
  }
};

export default function SyncButton({
  onItemsUpdated,
  onConflictsUpdate,
  onFallback,
  onSyncState,
  initialState,
}: SyncButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<SyncStatus>(initialState?.conflicts?.length ? 'conflict' : 'idle');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(initialState?.lastSyncedAt ?? null);

  const lastSyncedLabel = useMemo(() => formatTimestamp(lastSyncedAt), [lastSyncedAt]);

  const handleSyncResponse = (payload: any) => {
    const items = (payload?.items ?? []) as RegistryItem[];
    const conflicts = (payload?.conflicts ?? []) as RegistryConflict[];
    const lastSync = payload?.lastSyncedAt ?? null;
    onItemsUpdated(items);
    onConflictsUpdate(conflicts);
    setLastSyncedAt(lastSync);
    onSyncState?.({ lastSyncedAt: lastSync, conflicts });
    return conflicts;
  };

  const handleError = (payload: any) => {
    const fallbackItems = (payload?.fallbackItems ?? []) as RegistryItem[];
    const errorMessage = payload?.error || 'Unable to sync with MyRegistry.';
    onFallback(fallbackItems, errorMessage);
    setMessage(errorMessage);
    setStatus('idle');
  };

  const triggerSync = async () => {
    if (busy) return;
    setBusy(true);
    setStatus('syncing');
    setMessage(null);

    try {
      const downResponse = await api.post('/api/myregistry/sync/down');
      if (!downResponse.data?.ok) {
        handleError(downResponse.data);
        return;
      }

      const conflictsAfterDown = handleSyncResponse(downResponse.data);
      if (conflictsAfterDown.length) {
        setStatus('conflict');
        setMessage('Resolve conflicts to continue syncing.');
        router.push('/dashboard/registry/conflicts');
        return;
      }

      const upResponse = await api.post('/api/myregistry/sync/up');
      if (!upResponse.data?.ok) {
        handleError(upResponse.data);
        return;
      }

      const conflictsAfterUp = handleSyncResponse(upResponse.data);
      if (conflictsAfterUp.length) {
        setStatus('conflict');
        setMessage('Conflicts detected — review required.');
        router.push('/dashboard/registry/conflicts');
        return;
      }

      setStatus('synced');
      setMessage('Registry synced successfully.');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      handleError({ error: 'Unable to sync right now.', fallbackItems: [] });
    } finally {
      setBusy(false);
    }
  };

  const StatusIcon = () => {
    if (status === 'syncing') {
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-tmMauve" />;
    }
    if (status === 'conflict') {
      return <TriangleAlert className="h-3.5 w-3.5 text-amber-600" />;
    }
    if (status === 'synced') {
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />;
    }
    return <RefreshCw className="h-3.5 w-3.5 text-tmCharcoal/50" />;
  };

  return (
    <div className="flex flex-col items-end gap-2 text-right">
      <button
        onClick={triggerSync}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-tmMauve px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
      >
        <RefreshCw className="h-4 w-4" />
        {busy ? 'Syncing…' : 'Sync Registry'}
      </button>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-tmCharcoal/70">
        <StatusIcon />
        <span>{statusCopy[status]}</span>
      </div>
      {lastSyncedLabel && (
        <p className="text-[10px] text-tmCharcoal/50">Last synced {lastSyncedLabel}</p>
      )}
      {message && <p className="max-w-xs text-[11px] text-tmMauve">{message}</p>}
    </div>
  );
}
