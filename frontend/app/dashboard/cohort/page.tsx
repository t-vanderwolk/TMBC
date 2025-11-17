'use client';

// TODO: hook to live Prisma data
// TODO: add loading + error states
// TODO: refine design to match TMBC brand
// TODO: connect this CTA to Zoom session
// TODO: add empty-state UX

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, MessageSquare, NotebookTabs } from 'lucide-react';

import { api } from '@/lib/api';

type Cohort = {
  id: string;
  name: string;
  mentor?: {
    id: string;
    name: string | null;
    email?: string | null;
  };
  members?: { member: { id: string; name: string | null } }[];
};

type EventItem = {
  id: string;
  title: string;
  startTime: string;
  type: string;
};

const sharedResources = [
  { title: 'Postpartum Systems Lab', description: 'Workflows for visitors, meal trains, and overnight coverage.' },
  { title: 'Registry Power Hour deck', description: 'Concierge-approved list for Week 32 sprint.' },
];

export default function CohortPage() {
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchCohort = async () => {
      try {
        const [cohortResponse, eventsResponse] = await Promise.all([
          api.get('/api/events/cohorts/mine'),
          api.get('/api/events/my-events'),
        ]);
        if (Array.isArray(cohortResponse.data) && cohortResponse.data.length) {
          setCohort(cohortResponse.data[0]);
        }
        if (Array.isArray(eventsResponse.data)) {
          setEvents(eventsResponse.data);
        }
      } catch (error) {
        console.error('Member cohort error', error);
      }
    };

    fetchCohort();
  }, []);

  const cohortEvents = useMemo(() => {
    if (!cohort) return [];
    return events.filter((event) => event.type === 'COHORT_MEETING' || event.title.includes(cohort.name));
  }, [cohort, events]);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Your Cohort</p>
        <h1 className="text-4xl text-tmCharcoal">{cohort?.name || 'Join a TMBC cohort'}</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Mentor-facilitated pods focused on weekly accountability, live feedback, and shared rituals.
        </p>
      </header>

      {cohort ? (
        <>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Mentor</p>
              <h2 className="mt-2 text-2xl text-tmCharcoal">{cohort.mentor?.name || 'Mentor coming soon'}</h2>
              <p className="mt-2 text-sm text-tmCharcoal/70">
                Drop updates in the cohort chat, share progress photos, and log wins ahead of live sessions.
              </p>
              <div className="mt-4 text-sm text-tmCharcoal/70">
                Members:{' '}
                {cohort.members?.length
                  ? cohort.members.map((member) => member.member.name || 'Member').join(', ')
                  : 'Pending invites'}
              </div>
              <Link href={`/dashboard/chat?channel=${cohort.id}`} className="mt-5 inline-flex items-center gap-2 rounded-full bg-tmMauve px-5 py-3 text-sm font-semibold text-white">
                Open cohort chat
              </Link>
            </div>
            <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-6 w-6 text-tmMauve" />
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Shared Events</p>
                  <h2 className="text-xl text-tmCharcoal">Cohort-only touchpoints</h2>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {cohortEvents.length ? (
                  cohortEvents.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                      <p className="text-sm font-semibold text-tmCharcoal">{event.title}</p>
                      <p className="text-xs text-tmCharcoal/70">{new Date(event.startTime).toLocaleString()}</p>
                      <button type="button" className="mt-3 text-sm font-semibold text-tmMauve">
                        Add to calendar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-tmCharcoal/60">Your mentor will add the next cohort session soon.</p>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-tmMauve" />
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Cohort-only Chat</p>
                  <h2 className="text-xl text-tmCharcoal">Latest prompts</h2>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-tmCharcoal/70">
                <p>• Share a snapshot of this week’s nursery sprint.</p>
                <p>• Drop one thing you’re outsourcing before the due date.</p>
                <p>• Vote on next week’s accountability focus.</p>
              </div>
              <p className="mt-4 text-xs text-tmCharcoal/60">// TODO: sync with chat thread history + read receipts</p>
            </div>
            <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <NotebookTabs className="h-6 w-6 text-tmMauve" />
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Shared Resources</p>
                  <h2 className="text-xl text-tmCharcoal">Downloads & docs</h2>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {sharedResources.map((resource) => (
                  <div key={resource.title} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                    <p className="text-sm font-semibold text-tmCharcoal">{resource.title}</p>
                    <p className="text-xs text-tmCharcoal/70">{resource.description}</p>
                    <button type="button" className="mt-3 text-sm font-semibold text-tmMauve">
                      Download
                    </button>
                  </div>
                ))}
                <p className="text-xs text-tmCharcoal/60">// TODO: attach Google Drive + TMBC Library links</p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-6 text-center text-tmCharcoal/70">
          <p>No cohort assigned yet. Once your mentor adds you to a pod, the shared calendar and chat unlock here.</p>
        </section>
      )}
    </div>
  );
}
