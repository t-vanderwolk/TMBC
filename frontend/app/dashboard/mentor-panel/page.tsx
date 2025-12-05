'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth.client';
import MentorFeedbackCard from '@/components/mentor/MentorFeedbackCard';
import MentorTaskList from '@/components/mentor/MentorTaskList';
import MentorJournalShareBanner from '@/components/mentor/MentorJournalShareBanner';
import type { MentorFeedback, MentorJournalShare, MentorTask } from '@/types/mentor';

export default function MentorPanelPage() {
  const [feedback, setFeedback] = useState<MentorFeedback[]>([]);
  const [tasks, setTasks] = useState<MentorTask[]>([]);
  const [shares, setShares] = useState<MentorJournalShare[]>([]);

  useEffect(() => {
    const session = loadSession();
    const memberId = session?.payload?.userId;
    if (!memberId) {
      return;
    }

    const fetchPanel = async () => {
      try {
        // TODO: Replace with SWR + proper mentor matching
        const feedbackResponse = await api.get(`/api/mentor/feedback/${memberId}`);
        if (feedbackResponse.data?.data) setFeedback(feedbackResponse.data.data);
        const tasksResponse = await api.get('/api/mentor/member/tasks');
        setTasks(tasksResponse.data?.data ?? []);
      } catch (error) {
        console.error('Mentor panel placeholder error', error);
      }
    };

    fetchPanel();
  }, []);

  return (
    <div className="space-y-8 px-6 py-10 md:px-10">
      <header className="rounded-3xl border border-white/70 bg-gradient-to-br from-white via-tmIvory to-tmBlush/40 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Mentor Feedback Hub</p>
        <h1 className="text-4xl text-tmCharcoal">See everything your mentor curated for you.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">// TODO: personalize greeting + tie into mentor assignment data</p>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
            <Sparkles className="h-4 w-4 text-tmMauve" />
            Feedback from your mentor
          </div>
          {feedback.length ? (
            feedback.map((item) => <MentorFeedbackCard key={item.id} feedback={item} />)
          ) : (
            <p className="rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-4 text-sm text-tmCharcoal/70">
              // TODO: Load mentor feedback timeline
            </p>
          )}
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Assigned tasks</p>
          <MentorTaskList tasks={tasks} compact />
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Journal Shares</p>
          <span className="text-xs text-tmCharcoal/60">// TODO: connect toggle from Journal page + API</span>
        </div>
        <MentorJournalShareBanner shares={shares} />
        <button className="rounded-full bg-tmMauve px-5 py-3 text-sm font-semibold text-white">
          Ask your mentor
        </button>
      </section>
    </div>
  );
}
