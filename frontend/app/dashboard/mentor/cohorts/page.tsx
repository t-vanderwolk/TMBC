'use client';

// TODO: hook to live Prisma data
// TODO: add loading + error states
// TODO: refine design to match TMBC brand
// TODO: connect this CTA to Zoom session
// TODO: add empty-state UX

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, PlusCircle, UsersRound } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth.client';

type CohortMember = {
  member: {
    id: string;
    name: string | null;
    email?: string | null;
  };
};

type Cohort = {
  id: string;
  name: string;
  members?: CohortMember[];
};

type EventItem = {
  id: string;
  title: string;
  startTime: string;
  type: string;
};

export default function MentorCohortsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [cohortName, setCohortName] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('');
  const [memberId, setMemberId] = useState('');

  useEffect(() => {
    const session = loadSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    const role = String(session.payload?.role ?? '').toLowerCase();
    if (role !== 'mentor' && role !== 'admin') {
      router.replace('/dashboard');
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    const fetchCohorts = async () => {
      try {
        const [cohortsResponse, eventsResponse] = await Promise.all([
          api.get('/api/events/cohorts'),
          api.get('/api/events/upcoming'),
        ]);
        if (Array.isArray(cohortsResponse.data)) {
          setCohorts(cohortsResponse.data);
        }
        if (Array.isArray(eventsResponse.data)) {
          setUpcomingEvents(eventsResponse.data);
        }
      } catch (error) {
        console.error('Cohort management error', error);
      }
    };
    fetchCohorts();
  }, [ready]);

  if (!ready) return null;

  const handleCreateCohort = async (event: FormEvent) => {
    event.preventDefault();
    if (!cohortName) return;
    try {
      const response = await api.post('/api/events/cohorts', { name: cohortName });
      setCohorts((prev) => [response.data, ...prev]);
      setCohortName('');
    } catch (error) {
      console.error('Create cohort error', error);
    }
  };

  const handleAddMember = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedCohort || !memberId) return;
    try {
      const response = await api.post(`/api/events/cohorts/${selectedCohort}/add-member`, { memberId });
      setCohorts((prev) =>
        prev.map((cohort) =>
          cohort.id === selectedCohort
            ? { ...cohort, members: [...(cohort.members || []), response.data] }
            : cohort,
        ),
      );
      setMemberId('');
    } catch (error) {
      console.error('Add cohort member error', error);
    }
  };

  const cohortSessions = useMemo(() => {
    return upcomingEvents.filter((event) => event.type === 'COHORT_MEETING').slice(0, 5);
  }, [upcomingEvents]);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Cohort Management</p>
        <h1 className="text-4xl text-tmCharcoal">Curate mentor-led pods, track members, and keep the chat alive.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Spin up micro-cohorts, invite members in seconds, and align upcoming cohort sessions with the calendar.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleCreateCohort} className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Create Cohort</p>
            <h2 className="text-xl text-tmCharcoal">Give this pod a vibe</h2>
          </div>
          <input className="w-full rounded-xl border border-tmBlush/40 p-3 text-sm" placeholder="Cohort name (e.g., Week 32 Night Owls)" value={cohortName} onChange={(e) => setCohortName(e.target.value)} />
          <button type="submit" className="w-full rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-white">
            Save Cohort
          </button>
        </form>

        <form onSubmit={handleAddMember} className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Add Members</p>
            <h2 className="text-xl text-tmCharcoal">Ship invites without leaving Slack</h2>
          </div>
          <select className="w-full rounded-xl border border-tmBlush/40 p-3 text-sm" value={selectedCohort} onChange={(e) => setSelectedCohort(e.target.value)}>
            <option value="">Select cohort</option>
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))}
          </select>
          <input className="w-full rounded-xl border border-tmBlush/40 p-3 text-sm" placeholder="Member ID" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
          <button type="submit" className="w-full rounded-full border border-tmMauve px-6 py-3 text-sm font-semibold text-tmMauve">
            Add to Cohort
          </button>
          <p className="text-xs text-tmCharcoal/60">// TODO: hook member selector to directory lookup</p>
        </form>
      </section>

      <section className="rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Cohort Roster</p>
            <h2 className="text-2xl text-tmCharcoal">Mentor-led circles</h2>
          </div>
          <UsersRound className="h-6 w-6 text-tmMauve" />
        </div>
        <div className="mt-4 space-y-4">
          {cohorts.map((cohort) => (
            <div key={cohort.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-tmCharcoal">{cohort.name}</p>
                <Link href={`/dashboard/chat?channel=${cohort.id}`} className="text-sm font-semibold text-tmMauve">
                  Open chat
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-tmCharcoal/70">
                {cohort.members?.length
                  ? cohort.members.map((member) => (
                      <span key={member.member.id} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1">
                        {member.member.name || member.member.email || 'Member'}
                        <button type="button" className="text-xs text-tmMauve/70" onClick={() => console.log('TODO: remove member', member.member.id)}>
                          remove
                        </button>
                      </span>
                    ))
                  : 'No members yet'}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Upcoming Cohort Sessions</p>
              <h2 className="text-xl text-tmCharcoal">Aligned to live calendar</h2>
            </div>
            <PlusCircle className="h-6 w-6 text-tmMauve" />
          </div>
          <div className="mt-4 space-y-3">
            {cohortSessions.map((session) => (
              <div key={session.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-sm font-semibold text-tmCharcoal">{session.title}</p>
                <p className="text-xs text-tmCharcoal/70">{new Date(session.startTime).toLocaleString()}</p>
              </div>
            ))}
            {!cohortSessions.length && <p className="text-sm text-tmCharcoal/60">No meetings on the calendar. Schedule the next sprint.</p>}
          </div>
        </div>
        <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Cohort Chat</p>
              <h2 className="text-xl text-tmCharcoal">Keep the conversation rolling</h2>
            </div>
            <MessageCircle className="h-6 w-6 text-tmMauve" />
          </div>
          <p className="mt-3 text-sm text-tmCharcoal/70">
            Tap into the TMBC chat hub to drop resources, voice notes, or check-ins for each cohort thread.
          </p>
          <Link href="/dashboard/chat" className="mt-5 inline-flex items-center gap-2 rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-white">
            Launch chat workspace
          </Link>
          <p className="mt-3 text-xs text-tmCharcoal/60">// TODO: surface latest unread messages + badges</p>
        </div>
      </section>
    </div>
  );
}
