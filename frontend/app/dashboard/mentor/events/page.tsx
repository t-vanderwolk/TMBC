'use client';

// TODO: hook to live Prisma data
// TODO: add loading + error states
// TODO: refine design to match TMBC brand
// TODO: connect this CTA to Zoom session
// TODO: add empty-state UX

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Megaphone, Send, Sparkles } from 'lucide-react';

import { EventCard } from '@/components/events/EventCard';
import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth';

type EventItem = {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  location?: string | null;
  description?: string | null;
  rsvps?: { id: string; status: string }[];
};

type Cohort = {
  id: string;
  name: string;
  members?: { member: { id: string; name: string } }[];
};

const initialEvent: EventItem = {
  id: 'draft-1',
  title: 'Live Nursery Studio',
  type: 'WORKSHOP',
  startTime: new Date().toISOString(),
  endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  location: 'Zoom',
};

export default function MentorEventsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([initialEvent]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [scheduler, setScheduler] = useState({ cohortId: '', startTime: '', duration: 60 });
  const [formData, setFormData] = useState({
    title: '',
    type: 'WORKSHOP',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });

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
    const fetchMentorEvents = async () => {
      try {
        const [eventsResponse, cohortsResponse] = await Promise.all([
          api.get('/api/events/my-events'),
          api.get('/api/events/cohorts'),
        ]);
        if (Array.isArray(eventsResponse.data) && eventsResponse.data.length) {
          setEvents(eventsResponse.data);
        }
        if (Array.isArray(cohortsResponse.data)) {
          setCohorts(cohortsResponse.data);
        }
      } catch (error) {
        console.error('Mentor events error', error);
      }
    };
    fetchMentorEvents();
  }, [ready]);

  if (!ready) return null;

  const handleCreateEvent = async (event: FormEvent) => {
    event.preventDefault();
    if (!formData.title || !formData.startTime || !formData.endTime) return;
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        type: formData.type,
      };
      const response = await api.post('/api/events', payload);
      setEvents((prev) => [response.data, ...prev]);
      setFormData({ title: '', type: 'WORKSHOP', startTime: '', endTime: '', location: '', description: '' });
    } catch (error) {
      console.error('Create event error', error);
    }
  };

  const handleScheduleCohort = async (event: FormEvent) => {
    event.preventDefault();
    if (!scheduler.cohortId || !scheduler.startTime) return;
    try {
      const response = await api.post('/api/events', {
        title: 'Cohort Quick Scheduler',
        description: 'Auto-generated cohort touchpoint',
        startTime: scheduler.startTime,
        endTime: new Date(new Date(scheduler.startTime).getTime() + scheduler.duration * 60000).toISOString(),
        location: 'Zoom',
        type: 'COHORT_MEETING',
      });
      setEvents((prev) => [response.data, ...prev]);
      setScheduler({ cohortId: '', startTime: '', duration: 60 });
    } catch (error) {
      console.error('Cohort scheduler error', error);
    }
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    console.log('Broadcast message →', broadcastMessage);
    setBroadcastMessage('');
    setBroadcastOpen(false);
  };

  const computeRSVPBreakdown = (event: EventItem) => {
    const counts: Record<string, number> = {};
    (event.rsvps || []).forEach((rsvp) => {
      counts[rsvp.status] = (counts[rsvp.status] || 0) + 1;
    });
    return counts;
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Mentor Event HQ</p>
        <h1 className="text-4xl text-tmCharcoal">Schedule workshops, cohort meetings, and academy live sessions.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Draft events, review RSVPs, and broadcast momentum notes to your cohorts.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleCreateEvent} className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Create Event</p>
            <h2 className="text-xl text-tmCharcoal">Push a new experience live</h2>
          </div>
          <input className="w-full rounded-xl border border-tmBlush/40 p-3 text-sm" placeholder="Title" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} />
          <textarea className="w-full rounded-xl border border-tmBlush/40 p-3 text-sm" placeholder="Description" value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} />
          <div className="grid gap-3 md:grid-cols-2">
            <select className="rounded-xl border border-tmBlush/40 p-3 text-sm" value={formData.type} onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}>
              <option value="WORKSHOP">Workshop</option>
              <option value="GROUP_SESSION">Group Session</option>
              <option value="ACADEMY_QA">Academy Q&A</option>
              <option value="COHORT_MEETING">Cohort Meeting</option>
              <option value="COMMUNITY_EVENT">Community Event</option>
            </select>
            <input className="rounded-xl border border-tmBlush/40 p-3 text-sm" placeholder="Location" value={formData.location} onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input type="datetime-local" className="rounded-xl border border-tmBlush/40 p-3 text-sm" value={formData.startTime} onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))} />
            <input type="datetime-local" className="rounded-xl border border-tmBlush/40 p-3 text-sm" value={formData.endTime} onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))} />
          </div>
          <button type="submit" className="w-full rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-white">
            Publish Event
          </button>
        </form>
        <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Broadcast to Cohort</p>
              <h2 className="text-xl text-tmCharcoal">Spur action between live sessions</h2>
            </div>
            <Megaphone className="h-6 w-6 text-tmMauve" />
          </div>
          <p className="mt-2 text-sm text-tmCharcoal/70">
            Spotlight wins, share prep tasks, and drop Zoom links to every member at once.
          </p>
          <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full border border-tmMauve px-5 py-3 text-sm font-semibold text-tmMauve" onClick={() => setBroadcastOpen((prev) => !prev)}>
            {broadcastOpen ? 'Close Composer' : 'Broadcast to Cohort'}
          </button>
          {broadcastOpen && (
            <div className="mt-4 space-y-3">
              <textarea className="h-32 w-full rounded-xl border border-tmBlush/40 p-3 text-sm" placeholder="Share wins, reminders, or a new Zoom room" value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} />
              <button type="button" onClick={handleBroadcast} className="inline-flex items-center justify-center gap-2 rounded-full bg-tmMauve px-5 py-2 text-sm font-semibold text-white">
                <Send className="h-4 w-4" />
                Send Broadcast
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">My Events</p>
            <h2 className="text-2xl text-tmCharcoal">Live + upcoming</h2>
          </div>
          <Sparkles className="h-6 w-6 text-tmMauve" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} title={event.title} type={event.type} startTime={event.startTime} endTime={event.endTime} location={event.location} description={event.description} />
          ))}
        </div>
        {!events.length && <p className="text-sm text-tmCharcoal/60">No sessions yet—schedule your first touchpoint above.</p>}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">RSVP Breakdown</p>
          <h2 className="text-xl text-tmCharcoal">Member sentiment per event</h2>
          <div className="mt-4 space-y-4">
            {events.slice(0, 3).map((event) => {
              const breakdown = computeRSVPBreakdown(event);
              return (
                <div key={event.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                  <p className="text-sm font-semibold text-tmCharcoal">{event.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-tmCharcoal/70">
                    {Object.entries(breakdown).map(([status, count]) => (
                      <span key={status} className="rounded-full bg-white/80 px-3 py-1 font-semibold text-tmMauve">
                        {status}: {count}
                      </span>
                    ))}
                    {!Object.keys(breakdown).length && <span>No RSVPs yet.</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <form onSubmit={handleScheduleCohort} className="space-y-4 rounded-2xl border border-tmBlush/40 bg-white/95 p-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Cohort Quick-Scheduler</p>
            <h2 className="text-xl text-tmCharcoal">Drop a touchpoint in seconds</h2>
          </div>
          <select className="w-full rounded-xl border border-tmBlush/40 p-3 text-sm" value={scheduler.cohortId} onChange={(e) => setScheduler((prev) => ({ ...prev, cohortId: e.target.value }))}>
            <option value="">Select cohort</option>
            {cohorts.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))}
          </select>
          <input type="datetime-local" className="w-full rounded-xl border border-tmBlush/40 p-3 text-sm" value={scheduler.startTime} onChange={(e) => setScheduler((prev) => ({ ...prev, startTime: e.target.value }))} />
          <input type="number" className="w-full rounded-xl border border-tmBlush/40 p-3 text-sm" value={scheduler.duration} onChange={(e) => setScheduler((prev) => ({ ...prev, duration: Number(e.target.value) }))} min={15} max={180} placeholder="Duration (minutes)" />
          <button type="submit" className="w-full rounded-full bg-tmMauve px-6 py-3 text-sm font-semibold text-white">
            Schedule Cohort Meeting
          </button>
          <p className="text-xs text-tmCharcoal/50">// TODO: add empty-state UX</p>
        </form>
      </section>
    </div>
  );
}
