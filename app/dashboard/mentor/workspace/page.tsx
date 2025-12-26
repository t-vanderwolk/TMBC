'use client';

import { useEffect, useState } from 'react';
import { ClipboardCheck, Users2, NotepadText } from 'lucide-react';

import { api } from '@/lib/api';
import MentorFeedbackCard from '@/components/dashboard/mentor/MentorFeedbackCard';
import MentorTaskList from '@/components/dashboard/mentor/MentorTaskList';
import MentorJournalShareBanner from '@/components/dashboard/mentor/MentorJournalShareBanner';
import type { MentorFeedback, MentorJournalShare, MentorTask } from '@/types/mentor';

type Mentee = {
  id: string;
  name: string;
  focus: string;
  stage: string;
  mentorCollabConfirmedAt?: string | null;
};

const mockMentees: Mentee[] = [
  { id: 'member-1', name: 'Taylor V.', focus: 'Nursery styling', stage: '32 weeks' },
  { id: 'member-2', name: 'Morgan A.', focus: 'Feeding plan', stage: '28 weeks' },
];

const mockOnboardingContext = [
  { label: 'Home setup', value: 'Apartment, shared nursery, limited storage' },
  { label: 'Planning focus', value: 'Feeding comfort + calm bedtime routines' },
  { label: 'Lifestyle notes', value: 'Walkable neighborhood, minimal gear preference' },
];

const mentorAnalytics = [
  { label: 'Suggestions sent', value: '12' },
  { label: 'Acceptance rate', value: '58%' },
  { label: 'Top categories', value: 'Sleep · Feeding · Travel' },
];

export default function MentorWorkspacePage() {
  const [mentees, setMentees] = useState<Mentee[]>(mockMentees);
  const [tasks, setTasks] = useState<MentorTask[]>([]);
  const [feedback, setFeedback] = useState<MentorFeedback[]>([]);
  const [sharedEntries, setSharedEntries] = useState<MentorJournalShare[]>([]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // TODO: Replace placeholder calls with SWR fetching from mentorCollab endpoints
        const overview = await api.get('/mentor/overview');
        const menteeResponse = await api.get('/mentor/mentees');
        setMentees(
          (menteeResponse.data?.data ?? []).map((item: any) => ({
            id: item.id,
            name: item.name || 'Member',
            focus: item.email || 'Focus TBD',
            stage: 'Onboarding',
            mentorCollabConfirmedAt: item.mentorCollabConfirmedAt ?? null,
          })),
        );

        setFeedback(overview.data?.data?.recentFeedback ?? []);
        const taskResponse = await api.get('/mentor/tasks');
        setTasks(taskResponse.data?.data ?? []);
        // TODO: load journal shares per member selection
      } catch (error) {
        console.error('Mentor workspace bootstrap placeholder', error);
      }
    };

    bootstrap();
  }, []);

  return (
    <div className="space-y-8 px-6 py-10 md:px-10">
      <header className="rounded-3xl border border-white/70 bg-gradient-to-br from-white via-tmIvory to-tmBlush/40 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Mentor Workspace</p>
        <h1 className="text-4xl text-tmCharcoal">Stay in rhythm with every mentee.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          // TODO: Replace with live overview stats from mentorCollab service
        </p>
      </header>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
        {/* TMBC Canon:
            Onboarding is mentor context only.
            Mentors decide what to suggest. */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Onboarding context</p>
            <p className="text-sm text-tmCharcoal/70">Read-only insights to guide your next suggestions.</p>
          </div>
          <span className="text-xs text-tmCharcoal/60">No registry items are created from this view.</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {mockOnboardingContext.map((item) => (
            <div key={item.label} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">{item.label}</p>
              <p className="mt-2 text-sm text-tmCharcoal/80">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
            <Users2 className="h-4 w-4 text-tmMauve" />
            Your Mentees
          </div>
          <p className="mt-1 text-xs text-tmCharcoal/60">// TODO: hook to mentee selection + search</p>
          <div className="mt-4 space-y-3">
            {mentees.map((mentee) => (
              <div key={mentee.id} className="rounded-2xl border border-tmBlush/40 bg-tmIvory/70 p-4">
                <p className="text-base font-semibold text-tmCharcoal">{mentee.name}</p>
                <p className="text-sm text-tmCharcoal/70">{mentee.focus}</p>
                <p className="text-xs text-tmCharcoal/60">{mentee.stage}</p>
                <p className="mt-2 text-xs text-tmMauve">
                  MyRegistry collaboration: {mentee.mentorCollabConfirmedAt ? 'Yes' : 'No'}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
            <ClipboardCheck className="h-4 w-4 text-tmMauve" />
            Tasks to Review
          </div>
          <MentorTaskList tasks={tasks} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
          {/* TMBC Canon:
              Mentors advise.
              Monetization is admin-owned. */}
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Suggestion drafts</p>
          <p className="mt-2 text-sm text-tmCharcoal/70">
            Capture intentional product ideas with optional mentor notes. Drafts stay pending until a member accepts.
          </p>
          <div className="mt-4 rounded-2xl border border-dashed border-tmBlush/40 bg-tmIvory/70 p-4 text-sm text-tmCharcoal/70">
            // TODO: Connect to mentor suggestion creation flow (addedByMentor + optional note).
          </div>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
          {/* TMBC Canon:
              Mentors advise.
              Monetization is admin-owned. */}
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Mentor analytics</p>
          <p className="mt-2 text-sm text-tmCharcoal/70">
            Track guidance volume and category coverage (no revenue metrics).
          </p>
          <div className="mt-4 space-y-3">
            {mentorAnalytics.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">{stat.label}</p>
                <p className="mt-1 text-base font-semibold text-tmCharcoal">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Open Member Profiles</p>
            <p className="text-sm text-tmCharcoal/70">// TODO: route to mentor member profile page + load registry summary</p>
          </div>
          <span className="text-xs text-tmCharcoal/60">Click a card to jump into their workspace view.</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mentees.map((mentee) => (
            <button
              key={`${mentee.id}-profile`}
              className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4 text-left transition hover:-translate-y-0.5"
            >
              <p className="text-lg font-semibold text-tmCharcoal">{mentee.name}</p>
              <p className="text-sm text-tmCharcoal/70">{mentee.focus}</p>
              <p className="text-xs text-tmCharcoal/60">{mentee.stage}</p>
              <p className="mt-2 text-xs text-tmMauve">View profile →</p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
            <NotepadText className="h-4 w-4 text-tmMauve" />
            Recent Feedback
          </div>
          {feedback.length ? (
            feedback.map((item) => <MentorFeedbackCard key={item.id} feedback={item} />)
          ) : (
            <p className="rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-4 text-sm text-tmCharcoal/70">
              // TODO: Connect to mentor feedback feed
            </p>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.5em] text-tmMauve">Journal Shares</div>
            <span className="text-xs text-tmCharcoal/60">// TODO: add member filter + pagination</span>
          </div>
          <MentorJournalShareBanner shares={sharedEntries} />
        </div>
      </section>
    </div>
  );
}
