import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

export type ModuleMeta = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  heroImage: string | null;
  lecture: string;
  explore: string;
  apply: string;
  updatedAt: string;
  slides?: string[];
};

const fallbackModules: ModuleMeta[] = [
  {
    id: 'm1',
    code: 'nursery-vision',
    title: 'Nursery Vision & Mood',
    subtitle: 'Design a nurturing space that reflects your family story.',
    heroImage: null,
    lecture: 'Guided mood boards, curated palettes, and scent layering rituals.',
    explore: 'List of trusted atelier partners with showrooms.',
    apply: 'Weekly prompts and checklist for style + safety walkthrough.',
    updatedAt: '2025-10-18T13:42:00Z',
  },
  {
    id: 'm2',
    code: 'feeding-foundations',
    title: 'Feeding Foundations',
    subtitle: 'Plan nourishing rituals and postpartum nourishment.',
    heroImage: null,
    lecture: 'Formula + breastfeeding decision toolkit.',
    explore: 'Private pantry curation with local suppliers.',
    apply: 'Session notes + grocery list exports.',
    updatedAt: '2025-09-28T10:30:00Z',
  },
];

export const useModuleEditor = () => {
  const [modules, setModules] = useState<ModuleMeta[]>(fallbackModules);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: ModuleMeta[] } | ModuleMeta[]>('/api/admin/modules');
      const payload = (response.data as any)?.data ?? response.data;
      setModules(payload);
      setError(null);
    } catch (err) {
      console.error('Unable to load modules', err);
      setError('Unable to load modules');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateModule = useCallback(async (payload: Partial<ModuleMeta> & { id: string }) => {
    try {
      const response = await api.patch<{ data: ModuleMeta } | ModuleMeta>(
        `/api/admin/modules/${payload.id}`,
        payload,
      );
      const updated = (response.data as any)?.data ?? response.data;
      setModules((current) =>
        current.map((module) => (module.id === payload.id ? updated : module)),
      );
      return updated;
    } catch (err) {
      console.error('Unable to update module', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { modules, loading, error, refresh, updateModule };
};
