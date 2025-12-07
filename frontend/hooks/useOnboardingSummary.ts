import { useCallback, useEffect, useState } from 'react';

import { getOnboardingProfile } from '@/lib/api/onboarding';
import { getRegistrySummary, seedRegistryFromOnboarding } from '@/lib/api/registry';
import type { OnboardingProfile } from '@/types/onboarding';

export type OnboardingSummary = {
  status: 'not_started' | 'in_progress' | 'completed';
  suggestedCount: number;
  confirmedCount: number;
  profile: OnboardingProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  seedRegistry: () => Promise<void>;
};

export function useOnboardingSummary(): OnboardingSummary {
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [summary, setSummary] = useState({ suggestedCount: 0, confirmedCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileResponse, registryResponse] = await Promise.all([
        getOnboardingProfile(),
        getRegistrySummary(),
      ]);
      setProfile(profileResponse.data?.onboardingProfile ?? null);
      setSummary(registryResponse.data ?? { suggestedCount: 0, confirmedCount: 0 });
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Unable to load onboarding summary.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const seedRegistry = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await seedRegistryFromOnboarding();
      await fetchSummary();
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Unable to generate your registry right now.');
    } finally {
      setLoading(false);
    }
  }, [fetchSummary]);

  const status = (profile?.status as OnboardingSummary['status']) ?? 'not_started';

  return {
    status,
    suggestedCount: summary.suggestedCount,
    confirmedCount: summary.confirmedCount,
    profile,
    loading,
    error,
    refresh: fetchSummary,
    seedRegistry,
  };
}
