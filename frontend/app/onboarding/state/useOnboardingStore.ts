import { create } from 'zustand';

import { getRecommendations } from '@/lib/recommendations';
import type { OnboardingAnswers, RecommendationsResult } from '@/types/onboarding';

const defaultAnswers: OnboardingAnswers = {
  dueDate: '',
  expecting: '',
  primaryHandler: '',
  heightConsideration: '',
  floors: '',
  stairs: '',
  entryway: '',
  nurserySize: '',
  flooring: '',
  vehicleType: '',
  parking: '',
  terrain: [],
  travelFrequency: '',
  routine: '',
  pets: '',
  helpers: '',
  gearStyle: '',
};

export type OnboardingState = {
  answers: OnboardingAnswers;
  recommendations: RecommendationsResult;
  setAnswer: <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) => void;
  toggleTerrainOption: (option: string) => void;
  updateRecommendations: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  answers: defaultAnswers,
  recommendations: getRecommendations(defaultAnswers),
  setAnswer: (key, value) => {
    set((state) => ({
      answers: {
        ...state.answers,
        [key]: value,
      } as OnboardingAnswers,
    }));
    get().updateRecommendations();
  },
  toggleTerrainOption: (option) => {
    set((state) => {
      const terrain = state.answers.terrain.includes(option)
        ? state.answers.terrain.filter((item) => item !== option)
        : [...state.answers.terrain, option];
      return {
        answers: {
          ...state.answers,
          terrain,
        },
      };
    });
    get().updateRecommendations();
  },
  updateRecommendations: () => {
    set((state) => ({
      recommendations: getRecommendations(state.answers),
    }));
  },
}));
