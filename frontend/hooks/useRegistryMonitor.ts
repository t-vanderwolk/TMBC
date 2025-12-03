import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

export type RegistryEntry = {
  id: string;
  user: string;
  module: string;
  merchant: string;
  status: 'purchased' | 'wishlist';
  addedAt: string;
};

export type RegistryMonitor = {
  latestEntries: RegistryEntry[];
  filters: {
    label: string;
    value: string;
  }[];
  affiliateSummary: {
    label: string;
    revenue: number;
  }[];
};

const fallbackMonitor: RegistryMonitor = {
  latestEntries: [
    {
      id: 'r1',
      user: 'Juniper J.',
      module: 'Nursery Vision',
      merchant: 'MacroBaby',
      status: 'wishlist',
      addedAt: '4m ago',
    },
    {
      id: 'r2',
      user: 'Elliott R.',
      module: 'Feeding Foundations',
      merchant: 'AlbeeBaby',
      status: 'purchased',
      addedAt: '19m ago',
    },
    {
      id: 'r3',
      user: 'Harper L.',
      module: 'Sleep Sanctuary',
      merchant: 'Silver Cross',
      status: 'wishlist',
      addedAt: '28m ago',
    },
  ],
  filters: [
    { label: 'MacroBaby', value: 'MacroBaby' },
    { label: 'AlbeeBaby', value: 'AlbeeBaby' },
    { label: 'Silver Cross', value: 'Silver Cross' },
    { label: 'Nursery Vision', value: 'Nursery Vision' },
  ],
  affiliateSummary: [
    { label: 'MacroBaby', revenue: 842 },
    { label: 'AlbeeBaby', revenue: 621 },
    { label: 'Silver Cross', revenue: 372 },
  ],
};

export const useRegistryMonitor = () => {
  const [data, setData] = useState<RegistryMonitor>(fallbackMonitor);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: RegistryMonitor } | RegistryMonitor>('/api/admin/registry');
      const payload = (response.data as any)?.data ?? response.data;
      setData(payload);
      setError(null);
    } catch (err) {
      console.error('Unable to load registry monitor', err);
      setError('Unable to load registry activity');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
};
