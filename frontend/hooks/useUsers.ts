import { useCallback, useEffect, useState } from 'react';

import { api } from '@/lib/api';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'mentor' | 'admin';
  inviteCode?: string;
  joinedAt: string;
  status: 'active' | 'disabled';
};

const seedUsers: AdminUser[] = [
  {
    id: 'u1',
    name: 'Asha Mercier',
    email: 'asha@taylormadebaby.co',
    role: 'member',
    inviteCode: 'TMBC-1221',
    joinedAt: '2025-09-14',
    status: 'active',
  },
  {
    id: 'u2',
    name: 'Levi Soto',
    email: 'levi@shells.me',
    role: 'mentor',
    inviteCode: 'MENTOR-88',
    joinedAt: '2025-09-08',
    status: 'active',
  },
  {
    id: 'u3',
    name: 'Mara Ellison',
    email: 'mara@haven.co',
    role: 'member',
    joinedAt: '2025-10-03',
    status: 'disabled',
  },
  {
    id: 'u4',
    name: 'Callie Norris',
    email: 'callie@kindred.com',
    role: 'mentor',
    inviteCode: 'MENTOR-03',
    joinedAt: '2025-10-01',
    status: 'active',
  },
];

export const useUsers = () => {
  const [data, setData] = useState<AdminUser[]>(seedUsers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: AdminUser[] } | AdminUser[]>('/api/admin/users');
      const payload = (response.data as any)?.data ?? response.data;
      setData(payload);
      setError(null);
    } catch (err) {
      console.error('Failed to load admin users', err);
      setError('Unable to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
};
