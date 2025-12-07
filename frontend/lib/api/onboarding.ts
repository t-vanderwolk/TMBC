import apiClient from '@/lib/api/apiClient';
import type { OnboardingAnswers, OnboardingProfile } from '@/types/onboarding';

export type OnboardingProfileResponse = {
  onboardingProfile: OnboardingProfile | null;
};

export const saveOnboarding = (answers: OnboardingAnswers) =>
  apiClient.post('/api/onboarding', { answers });

export const getOnboardingProfile = () => apiClient.get<OnboardingProfileResponse>('/api/onboarding/me');
