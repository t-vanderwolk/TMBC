import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

export type AdminMentor = {
  id: string;
  name: string;
  mentees: number;
  performance: {
    workbookFeedback: number;
    registryNotes: number;
    eventsHosted: number;
  };
  lastActive: string;
};

const fallbackMentors: AdminMentor[] = [
  {
    id: 'm1',
    name: 'Kara Alden',
    mentees: 9,
    performance: { workbookFeedback: 28, registryNotes: 14, eventsHosted: 3 },
    lastActive: '2m ago',
  },
  {
    id: 'm2',
    name: 'Nate Ellis',
    mentees: 6,
    performance: { workbookFeedback: 17, registryNotes: 11, eventsHosted: 1 },
    lastActive: '11m ago',
  },
  {
    id: 'm3',
    name: 'Rosa Pineda',
    mentees: 5,
    performance: { workbookFeedback: 21, registryNotes: 9, eventsHosted: 2 },
    lastActive: '33m ago',
  },
];

export const useMentors = () => {
  const [data, setData] = useState<AdminMentor[]>(fallbackMentors);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: AdminMentor[] } | AdminMentor[]>('/api/admin/mentors');
      const payload = (response.data as any)?.data ?? response.data;
      setData(payload);
      setError(null);
    } catch (err) {
      console.error('Failed to load mentors', err);
      setError('Unable to load mentor roster');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
};
