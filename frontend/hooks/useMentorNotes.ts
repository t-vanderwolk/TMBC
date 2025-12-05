import { useEffect, useState } from 'react';

import { api } from '@/lib/api';

export interface MentorNote {
  id: string;
  content: string;
  mentorName?: string | null;
  createdAt: string;
}

export function useMentorNotes(memberId: string | undefined, moduleId: string | undefined, token?: string) {
  const [notes, setNotes] = useState<MentorNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId || !moduleId || !token) return undefined;

    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .get(`/api/mentor-notes/${memberId}/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (cancelled) return;
        setNotes(res.data || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message || 'Unable to load mentor notes.');
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [memberId, moduleId, token]);

  const addNote = async (content: string) => {
    if (!token || !memberId || !moduleId) return null;
    const res = await api.post(
      `/api/mentor-notes/${memberId}/${moduleId}`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setNotes((prev) => [...prev, res.data]);
    return res.data;
  };

  return { notes, loading, error, addNote };
}
