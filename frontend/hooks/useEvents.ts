import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

export type AdminEvent = {
  id: string;
  name: string;
  date: string;
  location: string;
  rsvpCount: number;
  status: 'scheduled' | 'published' | 'cancelled';
};

const fallbackEvents: AdminEvent[] = [
  {
    id: 'e1',
    name: 'Nursery Vision Foundations',
    date: 'Oct 30, 2025',
    location: 'Studio 4 | Dallas, TX',
    rsvpCount: 48,
    status: 'published',
  },
  {
    id: 'e2',
    name: 'Feeding Rituals & Prep',
    date: 'Nov 07, 2025',
    location: 'Virtual Workshop',
    rsvpCount: 62,
    status: 'scheduled',
  },
  {
    id: 'e3',
    name: 'Mom + Mentor Brunch',
    date: 'Nov 12, 2025',
    location: 'MacroBaby Atelier',
    rsvpCount: 29,
    status: 'scheduled',
  },
];

export const useEvents = () => {
  const [data, setData] = useState<AdminEvent[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: AdminEvent[] } | AdminEvent[]>('/api/admin/events');
      const payload = (response.data as any)?.data ?? response.data;
      setData(payload);
      setError(null);
    } catch (err) {
      console.error('Unable to load admin events', err);
      setError('Unable to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
};
