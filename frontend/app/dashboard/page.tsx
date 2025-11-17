'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Circle,
  Gift,
  Sparkles,
  Star,
} from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth';

const weeklyChecklist = [
  'Upload nursery progress photos for your mentor',
  'Review the Feeding & Seating module notes',
  'Sync registry with concierge feedback',
  'Book your 3rd trimester mentor touchpoint',
];

const perks = [
  { name: 'Maison Bébé Bassinet Bundle', code: 'TAYLOR10', notes: 'Complimentary rush delivery' },
  { name: 'Cocoon & Co. Nursing Capsule', code: 'TMBC15', notes: '15% off through Sunday' },
  { name: 'Petite Poppins Concierge Hour', code: 'TAYLORVIP', notes: 'Bonus organizer session' },
];

export default function DashboardPage() {
  const [firstName, setFirstName] = useState('Friend');
  const [progress, setProgress] = useState(48);
  const [nextModule, setNextModule] = useState('Vision & Style Foundations');
  const [myEvents, setMyEvents] = useState<
    { id: string; title: string; startTime: string; type: string; location?: string | null }[]
  >([]);

  useEffect(() => {
    const session = loadSession();
    if (session?.payload?.firstName) {
      setFirstName(session.payload.firstName.split(' ')[0]);
    }
  }, []);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        await api.get('/api/dashboard/overview');
        // TODO: hydrate dashboard overview data from backend response
      } catch (error) {
        console.error('Dashboard overview placeholder error', error);
      }
    };

    fetchOverview();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/api/events/my-events');
        if (Array.isArray(response.data)) {
          setMyEvents(response.data);
        }
      } catch (error) {
        console.error('Dashboard event widget error', error);
      }
    };

    fetchEvents();
  }, []);

  const sortedEvents = useMemo(
    () =>
      [...myEvents].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [myEvents],
  );
  const nextEvent = sortedEvents[0];
  const weekEvents = sortedEvents.slice(0, 3);

  return (
    <div className="space-y-8">
      <header className="space-y-2 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Member Overview</p>
        <h1 className="text-4xl text-tmCharcoal">Hi, {firstName}. Let’s get you ready for baby.</h1>
        <p className="text-sm text-tmCharcoal/70">
          Your concierge team refreshed your plan overnight. Review today’s milestones and keep momentum going.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-tmBlush/30 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Today's Progress</p>
              <p className="text-3xl font-semibold text-tmCharcoal">{progress}%</p>
            </div>
            <Star className="h-10 w-10 text-tmMauve" />
          </div>
          <p className="mt-4 text-sm text-tmCharcoal/70">
            You’ve completed 3 of 5 focus items for the day. Celebrate each micro-win.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-tmMauve">
            View progress log
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <div className="rounded-2xl border border-tmBlush/30 bg-gradient-to-br from-tmMauve to-tmBlush p-6 text-white shadow-soft">
          <p className="text-xs uppercase tracking-[0.5em]">Next Academy Module</p>
          <h2 className="mt-2 text-2xl">{nextModule}</h2>
          <p className="mt-3 text-sm text-white/90">
            Head to the Nursery Journey to keep building your dreamy sleep space.
          </p>
          <Link href="/dashboard/learn" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
            Continue in Learn
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-2 text-xs text-white/80">// TODO: surface recommended module from backend</p>
        </div>
        <div className="rounded-2xl border border-tmBlush/30 bg-white/90 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Concierge Reminders</p>
          <ul className="mt-4 space-y-3 text-sm text-tmCharcoal/80">
            <li>Mentor office hours: Thursday @ 3pm CST</li>
            <li>Registry sync requested by Friday</li>
            <li>Submit nursery inspo to Slack thread</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-tmBlush/30 bg-white/90 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Your Next Event</p>
          {nextEvent ? (
            <>
              <h3 className="mt-2 text-2xl text-tmCharcoal">{nextEvent.title}</h3>
              <p className="mt-1 text-sm text-tmCharcoal/70">
                {new Date(nextEvent.startTime).toLocaleString()} · {nextEvent.location || 'Virtual'}
              </p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-tmMauve px-5 py-3 text-sm font-semibold text-white">
                Join Live Session
                <Sparkles className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-tmCharcoal/50">// TODO: connect this CTA to Zoom session</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-tmCharcoal/70">RSVP to an event to unlock the live session link.</p>
          )}
        </div>
        <div className="rounded-2xl border border-tmBlush/30 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Events this Week</p>
              <h3 className="text-xl text-tmCharcoal">On your radar</h3>
            </div>
            <CalendarClock className="h-6 w-6 text-tmMauve" />
          </div>
          <div className="mt-4 space-y-3">
            {weekEvents.length ? (
              weekEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                  <p className="text-sm font-semibold text-tmCharcoal">{event.title}</p>
                  <p className="text-xs text-tmCharcoal/70">{new Date(event.startTime).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-tmCharcoal/70">No RSVPs on the books yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-tmBlush/30 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">This Week’s Checklist</p>
              <h3 className="text-2xl text-tmCharcoal">Curated for your current trimester</h3>
            </div>
            <CheckCircle2 className="h-8 w-8 text-tmMauve" />
          </div>
          <ul className="mt-4 space-y-3">
            {weeklyChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-tmCharcoal/80">
                <Circle className="mt-1 h-3 w-3 text-tmMauve" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-tmCharcoal/60">// TODO: drive checklist from concierge tasks API</p>
        </div>
        <div className="rounded-2xl border border-tmBlush/30 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Affiliate Perks of the Week</p>
              <h3 className="text-2xl text-tmCharcoal">Member-only codes just dropped</h3>
            </div>
            <Gift className="h-8 w-8 text-tmMauve" />
          </div>
          <div className="mt-4 space-y-4">
            {perks.map((perk) => (
              <div key={perk.name} className="rounded-2xl border border-tmBlush/40 bg-tmIvory/80 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-tmCharcoal">{perk.name}</p>
                  <span className="rounded-full bg-tmMauve/10 px-3 py-1 text-xs font-semibold tracking-[0.3em] text-tmMauve">
                    {perk.code}
                  </span>
                </div>
                <p className="mt-2 text-sm text-tmCharcoal/70">{perk.notes}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-tmCharcoal/60">// TODO: connect perks API + expiration logic</p>
        </div>
      </section>

      <section className="rounded-2xl border border-tmBlush/30 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Weekly Focus</p>
            <h3 className="text-2xl text-tmCharcoal">Concierge Calendar</h3>
            <p className="mt-2 text-sm text-tmCharcoal/70">
              Hold space for registry office hours, community calls, and postpartum planning sessions.
            </p>
          </div>
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-2 rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-white shadow-soft"
          >
            View events
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
