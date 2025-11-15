'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, ClipboardCheck, Users } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth';

const mentees = [
  { name: 'Taylor V.', due: 'July 12', focus: 'Nursery styling' },
  { name: 'Morgan A.', due: 'Aug 3', focus: 'Feeding plan' },
];

const registryReviews = [
  { member: 'Taylor V.', status: 'Needs feedback' },
  { member: 'Morgan A.', status: 'Approved' },
];

export default function MentorPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    const role = String(session.payload?.role ?? '').toLowerCase();
    if (role !== 'mentor') {
      router.replace('/dashboard');
      return;
    }
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    const fetchMentorData = async () => {
      try {
        await api.get('/api/mentor/overview');
        // TODO: mentor analytics + mentee assignments
      } catch (error) {
        console.error('Mentor placeholder error', error);
      }
    };
    fetchMentorData();
  }, [ready]);

  if (!ready) return null;

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Mentor Console</p>
        <h1 className="text-4xl text-tmCharcoal">Keep mentees on track with concierge-level care.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Review progress insights, registry requests, and upcoming accountability touchpoints.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-tmMauve" />
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Active Mentees</p>
              <h2 className="text-2xl text-tmCharcoal">Current roster</h2>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {mentees.map((mentee) => (
              <div key={mentee.name} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-base font-semibold text-tmCharcoal">{mentee.name}</p>
                <p className="text-sm text-tmCharcoal/70">Due {mentee.due} · Focus: {mentee.focus}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-6 w-6 text-tmMauve" />
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Registry Reviews</p>
              <h2 className="text-2xl text-tmCharcoal">Action items</h2>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {registryReviews.map((review) => (
              <div key={review.member} className="flex items-center justify-between rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-base text-tmCharcoal">{review.member}</p>
                <span className="text-sm font-semibold text-tmMauve">{review.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-tmBlush/40 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-tmMauve" />
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Progress Insights</p>
            <h2 className="text-2xl text-tmCharcoal">Weekly snapshot</h2>
          </div>
        </div>
        <p className="mt-3 text-sm text-tmCharcoal/70">
          Track module completion, checklist adherence, and accountability prompts at a glance.
        </p>
        <p className="mt-4 text-xs text-tmCharcoal/60">// TODO: mentor analytics dashboard + exports</p>
      </section>
    </div>
  );
}
