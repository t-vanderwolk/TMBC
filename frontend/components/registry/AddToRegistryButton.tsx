'use client';

import { useState } from 'react';

import { api } from '@/lib/api';
import type { RegistryItem } from '@/types/registry';

type AddToRegistryButtonProps = {
  productId: string;
  onAdded: (item: RegistryItem) => void;
};

export default function AddToRegistryButton({ productId, onAdded }: AddToRegistryButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await api.post('/api/registry/add', {
        productId,
      });

      if (response.data?.item) {
        onAdded(response.data.item as RegistryItem);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      const message = err?.response?.data?.error || 'Unable to add item.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleAdd}
        disabled={loading}
        className="rounded-full bg-tmMauve px-4 py-2 text-sm font-semibold text-white shadow-soft disabled:opacity-60"
      >
        {loading ? 'Adding…' : 'Add to Registry'}
      </button>
      {success && <span className="text-xs text-emerald-600">Added!</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
