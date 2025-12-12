import { useMemo } from 'react';

export type AdminRegistryEntry = {
  id: string;
  label: string;
  module: string;
  status: 'In Review' | 'Ready' | 'Requested';
  updatedAt: string;
};

export type AdminRegistryMonitorData = {
  entries: AdminRegistryEntry[];
  focus: string;
};

const placeholderRegistry: AdminRegistryMonitorData = {
  focus: 'Nursery and feeding continue to lead sign-ups.',
  entries: [
    {
      id: 'r1',
      label: 'MacroBaby Crib & Mattress',
      module: 'Nursery',
      status: 'In Review',
      updatedAt: '6m ago',
    },
    {
      id: 'r2',
      label: 'Heirloom swaddle trio',
      module: 'Mama Care',
      status: 'Ready',
      updatedAt: '15m ago',
    },
    {
      id: 'r3',
      label: 'Temperature-regulating sheets',
      module: 'Sleep',
      status: 'Requested',
      updatedAt: '22m ago',
    },
  ],
};

export const useAdminRegistryMonitor = () => {
  const data = useMemo(() => placeholderRegistry, []);
  return { data, loading: false, error: null };
};
