export type AdminEvent = {
  id: string;
  name: string;
  date: string;
  location: string;
  rsvpCount: number;
  status: 'scheduled' | 'published' | 'cancelled';
};

