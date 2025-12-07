import apiClient from '@/lib/api/apiClient';

export type RegistrySummaryResponse = {
  suggestedCount: number;
  confirmedCount: number;
};

export const seedRegistryFromOnboarding = () => apiClient.post('/api/registry/seedFromOnboarding');
export const getRegistrySummary = () => apiClient.get<RegistrySummaryResponse>('/api/registry/summary');
