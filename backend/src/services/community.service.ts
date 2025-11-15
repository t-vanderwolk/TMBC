export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  host: string;
}

const events: CommunityEvent[] = [
  { id: 'weekly-zoom', title: 'Weekly Community Zoom', date: 'Tuesdays 7pm CT', host: 'Concierge Team' },
  { id: 'mentor-circle', title: 'Mentor Circle', date: 'Fridays 12pm CT', host: 'Mentor Cohort' },
  { id: 'registry-qna', title: 'Registry Q&A', date: 'Sundays 4pm CT', host: 'Registry Lead' },
];

export const getCommunityEvents = async () => events;
