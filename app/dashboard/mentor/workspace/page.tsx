'use client';

import { useEffect, useState } from 'react';
import { ClipboardCheck, Users2 } from 'lucide-react';

import { api } from '@/lib/api';
import ActionButton from '@/components/dashboard/ui/ActionButton';
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

export default function MentorWorkspacePage() {
  const [mentees, setMentees] = useState<Mentee[]>(mockMentees);
  const [activeMenteeId, setActiveMenteeId] = useState<string>(mockMentees[0]?.id ?? '');
  const [tasks, setTasks] = useState<MentorTask[]>([]);
  const [feedback] = useState<MentorFeedback[]>([]);
  const [sharedEntries] = useState<MentorJournalShare[]>([]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // INTENTIONAL: Fetch directly until mentorCollab endpoints are stabilized.
        const menteeResponse = await api.get('/mentor/mentees');
        const nextMentees = (menteeResponse.data?.data ?? []).map((item: any) => ({
          id: item.id,
          name: item.name || 'Member',
          focus: item.email || 'Focus TBD',
          stage: 'Onboarding',
          mentorCollabConfirmedAt: item.mentorCollabConfirmedAt ?? null,
        }));
        setMentees(nextMentees);

        const taskResponse = await api.get('/mentor/tasks');
        setTasks(taskResponse.data?.data ?? []);
        // INTENTIONAL: Journal shares are loaded globally until member-level filtering is available.
      } catch (error) {
        console.error('Mentor workspace bootstrap placeholder', error);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!mentees.length) {
      setActiveMenteeId('');
      return;
    }

    const hasActive = mentees.some((mentee) => mentee.id === activeMenteeId);
    if (!hasActive) {
      setActiveMenteeId(mentees[0].id);
    }
  }, [activeMenteeId, mentees]);

  const activeMentee = mentees.find((mentee) => mentee.id === activeMenteeId) ?? null;

  return (
    <div className="space-y-8 px-6 py-10 md:px-10">
      <header className="rounded-3xl border border-white/70 bg-gradient-to-br from-white via-tmIvory to-tmBlush/40 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Mentor Workspace</p>
        <h1 className="text-4xl text-tmCharcoal">Focus on one mentee at a time.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Select a mentee to review their active work, then keep your attention there.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
            <Users2 className="h-4 w-4 text-tmMauve" />
            Your Mentees
          </div>
          <p className="mt-1 text-xs text-tmCharcoal/60">
            Choose a mentee to keep the workspace focused.
          </p>
          <div className="mt-4 space-y-3">
            {mentees.length ? (
              mentees.map((mentee) => {
                const isActive = mentee.id === activeMenteeId;
                return (
                  <button
                    key={mentee.id}
                    type="button"
                    onClick={() => setActiveMenteeId(mentee.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? 'border-tmMauve bg-tmIvory/80 shadow-sm'
                        : 'border-tmBlush/40 bg-tmIvory/50 hover:-translate-y-0.5'
                    }`}
                  >
                    <p className="text-base font-semibold text-tmCharcoal">{mentee.name}</p>
                    <p className="text-sm text-tmCharcoal/70">{mentee.focus}</p>
                    <p className="text-xs text-tmCharcoal/60">{mentee.stage}</p>
                  </button>
                );
              })
            ) : (
              <p className="rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-4 text-sm text-tmCharcoal/70">
                No mentees assigned yet. This section will populate as mentors engage.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
            <ClipboardCheck className="h-4 w-4 text-tmMauve" />
            Active Mentee
          </div>
          {activeMentee ? (
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-lg font-semibold text-tmCharcoal">{activeMentee.name}</p>
                <p className="text-sm text-tmCharcoal/70">{activeMentee.focus}</p>
                <p className="text-xs text-tmCharcoal/60">{activeMentee.stage}</p>
                <p className="mt-2 text-xs text-tmMauve">
                  MyRegistry collaboration: {activeMentee.mentorCollabConfirmedAt ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <ActionButton
                  href={`/dashboard/mentor/plan/${activeMentee.id}`}
                  variant="ghost"
                  className="sm:w-auto"
                  fullWidth
                >
                  Open plan
                </ActionButton>
                <ActionButton
                  href={`/dashboard/mentor/journal/${activeMentee.id}`}
                  variant="ghost"
                  className="sm:w-auto"
                  fullWidth
                >
                  Review journal
                </ActionButton>
                <ActionButton
                  href="/dashboard/mentor/messages"
                  variant="ghost"
                  className="sm:w-auto"
                  fullWidth
                >
                  Message
                </ActionButton>
                <ActionButton
                  href="/dashboard/mentor/tasks"
                  variant="ghost"
                  className="sm:w-auto"
                  fullWidth
                >
                  Review modules
                </ActionButton>
              </div>
              <p className="text-xs text-tmCharcoal/60">
                This workspace will expand with mentee-specific filters in Phase 2.
              </p>
            </div>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-4 text-sm text-tmCharcoal/70">
              Select a mentee to see their active work tools.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
            <ClipboardCheck className="h-4 w-4 text-tmMauve" />
            Tasks to Review
          </div>
          <MentorTaskList tasks={tasks} />
        </div>
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.5em] text-tmMauve">Journal Shares</div>
          <MentorJournalShareBanner shares={sharedEntries} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-xs uppercase tracking-[0.5em] text-tmMauve">Recent Feedback</div>
        {feedback.length ? (
          feedback.map((item) => <MentorFeedbackCard key={item.id} feedback={item} />)
        ) : (
          <p className="rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-4 text-sm text-tmCharcoal/70">
            No mentor feedback yet. This section will populate as feedback is recorded.
          </p>
        )}
      </section>
    </div>
  );
}
