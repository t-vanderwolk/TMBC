'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, Shield } from 'lucide-react';

import { api } from '@/lib/api';
import type { RegistryConflict } from '@/types/registry';

type RegistryConflictsPanelProps = {
  onResolved?: () => void;
};

const fieldLabels: Record<RegistryConflict['field'], string> = {
  quantity: 'Quantity',
  status: 'Status',
  customNote: 'Custom note',
  affiliateUrl: 'Affiliate link',
};

const formatValue = (value: string | null) => {
  if (value === null || value === undefined || value === '') return '—';
  return value;
};

export default function RegistryConflictsPanel({ onResolved }: RegistryConflictsPanelProps) {
  const [conflicts, setConflicts] = useState<RegistryConflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);

  const loadConflicts = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/api/registry/conflicts');
      setConflicts((response.data?.conflicts ?? []) as RegistryConflict[]);
    } catch {
      setError('Unable to load conflicts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConflicts();
  }, []);

  const handleResolve = async (conflictId: string, resolution: 'local' | 'remote') => {
    try {
      setResolving(conflictId + resolution);
      await api.post('/api/registry/conflicts/resolve', { conflictId, resolution });
      await loadConflicts();
      onResolved?.();
    } catch {
      setError('Unable to resolve conflict. Please try again.');
    } finally {
      setResolving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-3xl border border-tmBlush/40 bg-white/80 p-6 text-sm text-tmCharcoal/70">
        <Loader2 className="h-4 w-4 animate-spin text-tmMauve" />
        Checking for conflicts…
      </div>
    );
  }

  if (!conflicts.length) {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-tmBlush/40 bg-white/80 p-6 text-tmCharcoal/70">
        <Shield className="h-5 w-5 text-emerald-500" />
        <div>
          <p className="font-semibold text-tmCharcoal">No conflicts detected</p>
          <p className="text-sm">Your TMBC registry is in sync with MyRegistry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
      {conflicts.map((conflict) => (
        <div
          key={conflict.id}
          className="space-y-3 rounded-3xl border border-amber-200 bg-white/90 p-5 shadow-soft"
        >
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {fieldLabels[conflict.field]} differs on <strong>{conflict.item.title}</strong>
            </span>
          </div>
          <p className="text-sm text-tmCharcoal/80">
            Yours: <span className="font-semibold text-tmCharcoal">{formatValue(conflict.localValue)}</span> | Remote:{' '}
            <span className="font-semibold text-tmCharcoal">{formatValue(conflict.remoteValue)}</span>
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <button
              onClick={() => handleResolve(conflict.id, 'local')}
              disabled={resolving === conflict.id + 'local'}
              className="rounded-full bg-tmMauve px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {resolving === conflict.id + 'local' ? 'Keeping yours…' : 'Keep Mine'}
            </button>
            <button
              onClick={() => handleResolve(conflict.id, 'remote')}
              disabled={resolving === conflict.id + 'remote'}
              className="rounded-full border border-tmMauve px-4 py-2 text-tmMauve disabled:opacity-60"
            >
              {resolving === conflict.id + 'remote' ? 'Applying remote…' : 'Use MyRegistry'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
