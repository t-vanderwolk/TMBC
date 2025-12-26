import apiClient from '@/lib/api/apiClient';

export type RegistrySummaryResponse = {
  suggestedCount: number;
  confirmedCount: number;
};

export const getRegistrySummary = () => apiClient.get<RegistrySummaryResponse>('/registry/summary');
