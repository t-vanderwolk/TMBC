import { useMemo } from 'react';

export type AdminUserPreview = {
  id: string;
  name: string;
  status: 'Active' | 'Onboarding' | 'Paused';
  plan: string;
  lastActive: string;
};

export type AdminUsersData = {
  preview: AdminUserPreview[];
  totalMembers: number;
};

const placeholderUsers: AdminUsersData = {
  totalMembers: 1425,
  preview: [
    { id: 'u1', name: 'Jada Elgin', status: 'Active', plan: 'Studio', lastActive: '2m ago' },
    { id: 'u2', name: 'Mara Solis', status: 'Onboarding', plan: 'Moments', lastActive: '10m ago' },
    { id: 'u3', name: 'Noor Beck', status: 'Active', plan: 'Concierge', lastActive: '42m ago' },
    { id: 'u4', name: 'Henrie Meyers', status: 'Paused', plan: 'Studio', lastActive: '1h ago' },
  ],
};

export const useAdminUsers = () => {
  const data = useMemo(() => placeholderUsers, []);
  return { data, loading: false, error: null };
};
