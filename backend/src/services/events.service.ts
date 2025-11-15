type EventItem = {
  id: string;
  title: string;
  type: 'Virtual' | 'In-person';
  date: string;
  location: string;
};

const events: EventItem[] = [
  { id: 'event-1', title: 'Nursery Styling Session', type: 'Virtual', date: 'Mar 22 · 6pm CST', location: 'Zoom' },
  { id: 'event-2', title: 'Austin Member Brunch', type: 'In-person', date: 'Mar 24 · 11am CST', location: 'June’s Cafe' },
  { id: 'event-3', title: 'Fourth Trimester Circle', type: 'Virtual', date: 'Mar 26 · 8pm CST', location: 'Zoom' },
];

export const getEvents = async () => {
  // TODO: Replace with Prisma event table + filters
  return events;
};

export const rsvpToEvent = async (eventId: string, userId: string) => {
  // TODO: Persist RSVP with user + event relation
  return {
    eventId,
    userId,
    status: 'confirmed',
  };
};
