'use client';

// TODO: hook to live Prisma data
// TODO: add loading + error states
// TODO: refine design to match TMBC brand
// TODO: connect this CTA to Zoom session
// TODO: add empty-state UX

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarClock, Play, Sparkles } from 'lucide-react';

import { EventCard } from '@/components/events/EventCard';
import { CalendarGrid, type CalendarGridEvent } from '@/components/events/CalendarGrid';
import { api } from '@/lib/api';

type EventItem = {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  description?: string | null;
};

const placeholderEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'Nursery Styling Session',
    type: 'WORKSHOP',
    startTime: '2025-12-03T15:43:07.000Z',
    endTime: '2025-12-03T16:43:07.000Z',
    location: 'Zoom',
  },
  {
    id: 'event-2',
    title: 'Austin Member Brunch',
    type: 'COMMUNITY_EVENT',
    startTime: '2025-12-05T16:00:00.000Z',
    endTime: '2025-12-05T17:30:00.000Z',
    location: 'June’s Cafe',
  },
];

const weeklySessions = [
  { title: 'Academy Live: Sleep Lab', date: 'Mondays · 7pm CST', mentor: 'Jade' },
  { title: 'Fourth Trimester Circle', date: 'Wednesdays · 12pm CST', mentor: 'Liz' },
  { title: 'Registry Power Hour', date: 'Fridays · 10am CST', mentor: 'Kara' },
];

export default function EventsPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>(placeholderEvents);
  const [myEvents, setMyEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [upcomingResponse, myResponse] = await Promise.all([
          api.get('/api/events/upcoming'),
          api.get('/api/events/my-events'),
        ]);
        if (Array.isArray(upcomingResponse.data)) {
          setUpcomingEvents(upcomingResponse.data);
        }
        if (Array.isArray(myResponse.data)) {
          setMyEvents(myResponse.data);
        }
      } catch (error) {
        console.error('Events data error', error);
      }
    };

    fetchEvents();
  }, []);

  const calendarEvents = useMemo<CalendarGridEvent[]>(() => {
    return upcomingEvents.map((event) => ({
      date: event.startTime,
      title: event.title,
      type: event.type,
    }));
  }, [upcomingEvents]);

  const nextEvent = useMemo(() => {
    if (!upcomingEvents.length) return null;
    return [...upcomingEvents].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )[0];
  }, [upcomingEvents]);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Events & Cohorts</p>
        <h1 className="text-4xl text-tmCharcoal">RSVP to workshops, studio circles, and cohort huddles.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          A single view for live sessions, RSVP tracking, and mentor-led cohort meetings.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Upcoming Events</p>
            <h2 className="text-2xl text-tmCharcoal">Claim your seat before spots fill</h2>
          </div>
          <Link href="/dashboard/mentor/events" className="text-sm font-semibold text-tmMauve">
            Mentor tools
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} title={event.title} type={event.type} startTime={event.startTime} endTime={event.endTime} location={event.location} description={event.description} />
          ))}
          {!upcomingEvents.length && (
            <div className="rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-5 text-sm text-tmCharcoal/60">
              No events scheduled yet. Check back after mentors publish the next sprint.
            </div>
          )}
        </div>
        <p className="text-xs text-tmCharcoal/60">// TODO: double-booking guard + calendar invites</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-tmBlush/30 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">My RSVPs</p>
              <h3 className="text-xl text-tmCharcoal">You’re confirmed for</h3>
            </div>
            <Sparkles className="h-5 w-5 text-tmMauve" />
          </div>
          <div className="mt-4 space-y-3">
            {myEvents.length === 0 && (
              <p className="text-sm text-tmCharcoal/60">No RSVPs yet—save your spot to unlock the prep checklist.</p>
            )}
            {myEvents.slice(0, 4).map((event) => (
              <div key={event.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-sm font-semibold text-tmCharcoal">{event.title}</p>
                <p className="text-xs text-tmCharcoal/70">{new Date(event.startTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-tmBlush/30 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Weekly Academy Sessions</p>
              <h3 className="text-xl text-tmCharcoal">Live touchpoints</h3>
            </div>
            <CalendarClock className="h-5 w-5 text-tmMauve" />
          </div>
          <ul className="mt-4 space-y-3">
            {weeklySessions.map((session) => (
              <li key={session.title} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-sm font-semibold text-tmCharcoal">{session.title}</p>
                <p className="text-xs text-tmCharcoal/70">{session.date} · Mentor {session.mentor}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarGrid events={calendarEvents} />
        </div>
        <div className="flex flex-col rounded-2xl border border-tmBlush/40 bg-gradient-to-br from-tmMauve to-tmBlush p-6 text-white shadow-soft">
          <p className="text-xs uppercase tracking-[0.5em]">Join Live</p>
          <h3 className="mt-2 text-2xl font-semibold">{nextEvent ? nextEvent.title : 'Live Session Standby'}</h3>
          <p className="mt-3 text-sm text-white/80">
            {nextEvent
              ? `Next begins ${new Date(nextEvent.startTime).toLocaleString()}`
              : 'We’ll notify you when a live session opens.'}
          </p>
          <button type="button" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-semibold transition hover:bg-white/25">
            <Play className="h-4 w-4" />
            Join Live Session
          </button>
          <p className="mt-3 text-xs text-white/70">// TODO: connect this CTA to Zoom session</p>
        </div>
      </section>
    </div>
  );
}
