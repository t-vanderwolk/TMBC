import { useMemo } from 'react';

export type AdminEvent = {
  id: string;
  title: string;
  detail: string;
  time: string;
  status: 'Live' | 'Queued' | 'Draft';
};

export type AdminEventsData = {
  items: AdminEvent[];
  heartbeat: string;
};

const placeholderEvents: AdminEventsData = {
  heartbeat: 'Last sync 90s ago',
  items: [
    {
      id: 'evt-1',
      title: 'Nursery Vision board shared',
      detail: 'Mentor Aria published moodboard & workbook update',
      time: '2m ago',
      status: 'Live',
    },
    {
      id: 'evt-2',
      title: 'Registry batch refresh',
      detail: 'Gently curated items queued for updating partner tags',
      time: '12m ago',
      status: 'Queued',
    },
    {
      id: 'evt-3',
      title: 'New member invite',
      detail: 'Invited via boutique concierge referral',
      time: '33m ago',
      status: 'Draft',
    },
    {
      id: 'evt-4',
      title: 'Studio call reminder',
      detail: 'Reminder scheduled for organic design session',
      time: '1h ago',
      status: 'Live',
    },
  ],
};

export const useAdminEvents = () => {
  const data = useMemo(() => placeholderEvents, []);
  return { data, loading: false, error: null };
};
