import { useCallback, useMemo } from 'react';

export type AdminMetric = {
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  accent?: 'mauve' | 'gold' | 'charcoal';
  badge?: string;
};

export type AdminStatsData = {
  lastRefresh: string;
  narrative: string;
  metrics: AdminMetric[];
};

const placeholderStats: AdminStatsData = {
  lastRefresh: 'Synced 3 minutes ago',
  narrative: 'The concierge crew is steady, with members continuing to lean into curated prep rituals.',
  metrics: [
    {
      title: 'Members',
      value: '1,425',
      subtitle: '12 new this week',
      accent: 'mauve',
      badge: 'Stable',
    },
    {
      title: 'Mentors',
      value: '84',
      subtitle: '6 pending invites',
      accent: 'gold',
      badge: 'Curated',
    },
    {
      title: 'Events',
      value: '14',
      subtitle: '3 experiences scheduled',
      accent: 'charcoal',
      badge: 'Live',
    },
    {
      title: 'Registry Items',
      value: '842',
      subtitle: '19 curated additions',
      accent: 'mauve',
      badge: 'Refined',
    },
  ],
};

export const useAdminStats = () => {
  const data = useMemo(() => placeholderStats, []);
  const refresh = useCallback(async () => placeholderStats, []);

  return { data, loading: false, error: null, refresh };
};
