'use client';

import { useEffect } from 'react';
import { CalendarClock, MapPin, Video } from 'lucide-react';

import { api } from '@/lib/api';

const events = [
  { id: 1, title: 'Nursery Styling Session', type: 'Virtual', date: 'Mar 22 · 6pm CST', location: 'Zoom' },
  { id: 2, title: 'Austin Member Brunch', type: 'In-person', date: 'Mar 24 · 11am CST', location: 'June’s Cafe' },
  { id: 3, title: 'Fourth Trimester Circle', type: 'Virtual', date: 'Mar 26 · 8pm CST', location: 'Zoom' },
];

export default function EventsPage() {
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await api.get('/api/events');
        // TODO: calendar integration + RSVP sync
      } catch (error) {
        console.error('Events placeholder error', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Events & Meetups</p>
        <h1 className="text-4xl text-tmCharcoal">RSVP to upcoming circles, workshops, and pop-ups.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Virtual and in-person touchpoints crafted for every trimester.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-2xl border border-tmBlush/30 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              {event.type === 'Virtual' ? (
                <Video className="h-5 w-5 text-tmMauve" />
              ) : (
                <MapPin className="h-5 w-5 text-tmMauve" />
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">{event.type}</p>
                <h2 className="text-xl text-tmCharcoal">{event.title}</h2>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-tmCharcoal/80">
              <CalendarClock className="h-4 w-4 text-tmMauve" />
              {event.date}
            </div>
            <p className="mt-1 text-sm text-tmCharcoal/70">{event.location}</p>
            <button className="mt-4 w-full rounded-full border border-tmMauve px-4 py-2 text-sm font-semibold text-tmMauve">
              RSVP
            </button>
          </div>
        ))}
      </section>
      <p className="text-xs text-tmCharcoal/60">// TODO: double-booking guard + calendar invites</p>
    </div>
  );
}
