import { useMemo } from 'react';

export type AdminModule = {
  id: string;
  title: string;
  status: 'Drafting' | 'Review' | 'Live';
  nextMilestone: string;
  owner: string;
  focus: string;
};

export type AdminModulesData = {
  modules: AdminModule[];
  spotlight: string;
};

const placeholderModules: AdminModulesData = {
  spotlight: 'Module drafts remain on track for the Spring cohort release.',
  modules: [
    {
      id: 'm1',
      title: 'Nursery Vision',
      status: 'Live',
      nextMilestone: 'Refreshing delivery notes in 3 days',
      owner: 'Mentor Aria',
      focus: 'Moodboard, spatial layout, and lighting',
    },
    {
      id: 'm2',
      title: 'Feeding Rituals',
      status: 'Review',
      nextMilestone: 'Style notes uploaded for final approval',
      owner: 'Mentor Cal',
      focus: 'Breastfeeding + bottle prep plans',
    },
  ],
};

export const useAdminModules = () => {
  const data = useMemo(() => placeholderModules, []);
  return { data, loading: false, error: null };
};
