'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, BookCopy, ClipboardCheck, Send } from 'lucide-react';
import Link from 'next/link';

import { api } from '@/lib/api';
import type { MentorFeedback } from '@/types/mentor';

type MentorModuleReviewPageProps = {
  params: {
    memberId: string;
    moduleId: string;
  };
};

export default function MentorModuleReviewPage({ params }: MentorModuleReviewPageProps) {
  const { memberId, moduleId } = params;
  const [feedback, setFeedback] = useState<MentorFeedback[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const response = await api.get(`/api/mentor/feedback/${memberId}?moduleId=${moduleId}`);
        setFeedback(response.data?.data ?? []);
      } catch (error) {
        console.error('Mentor module feedback placeholder error', error);
      }
    };

    loadFeedback();
  }, [memberId, moduleId]);

  const handleSubmit = async () => {
    if (!draft.trim()) return;
    try {
      const response = await api.post('/api/mentor/feedback', {
        memberId,
        moduleId,
        message: draft,
      });
      if (response.data?.data) {
        setFeedback((prev) => [response.data.data, ...prev]);
      }
      setDraft('');
    } catch (error) {
      console.error('Mentor module feedback save placeholder', error);
    }
  };

  const handleCompleteReview = async () => {
    try {
      // TODO: Call mentorCollab.createTask completion/creation for MODULE_REVIEW
      await api.post('/api/mentor/tasks', {
        memberId,
        type: 'MODULE_REVIEW',
        referenceId: moduleId,
        title: `Review ${moduleId}`,
        description: 'Auto-created from mentor workspace',
      });
    } catch (error) {
      console.error('Mentor module review placeholder error', error);
    }
  };

  return (
    <div className="space-y-6 px-6 py-10 md:px-10">
      <Link
        href="/dashboard/mentor/workspace"
        className="inline-flex items-center gap-2 text-sm font-semibold text-tmMauve"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to workspace
      </Link>
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Mentor Module Review</p>
        <h1 className="text-3xl text-tmCharcoal">{moduleId}</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          // TODO: Pull module content + member progress from Prisma once curriculum tables exist
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-tmBlush/40 bg-white/90 p-6 shadow-soft">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
            <BookCopy className="h-4 w-4 text-tmMauve" />
            Module preview
          </div>
          <p className="mt-2 text-sm text-tmCharcoal/80">
            // TODO: Surface module summary, key outcomes, and attachments for mentors
          </p>
        </div>
        <div className="rounded-3xl border border-tmBlush/40 bg-white/90 p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Member progress</p>
            <span className="text-xs text-tmCharcoal/60">// TODO: Connect to completion tracker + assignments</span>
          </div>
          <div className="mt-4 rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
            <p className="text-sm text-tmCharcoal/80">Member {memberId}</p>
            <p className="text-xs text-tmCharcoal/60">Status: In progress</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-tmMauve">
          <ClipboardCheck className="h-4 w-4 text-tmMauve" />
          Mentor feedback thread
        </div>
        <p className="mt-1 text-xs text-tmCharcoal/60">// TODO: Replace with live data from mentorCollab feedback</p>
        <div className="mt-4 space-y-3">
          {feedback.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
              <p className="text-sm text-tmCharcoal">{entry.message}</p>
              <p className="text-xs text-tmCharcoal/60">
                {entry.mentor?.name || 'Mentor'} · {new Date(entry.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {!feedback.length && (
            <p className="text-xs text-tmCharcoal/60">// TODO: Encourage mentor to start the thread</p>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="Add guidance, links, or action items..."
            className="rounded-2xl border border-tmBlush/40 bg-tmIvory/70 p-3 text-sm text-tmCharcoal outline-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-full bg-tmMauve px-5 py-2 text-sm font-semibold text-white"
            >
              <Send className="h-4 w-4" />
              Send feedback
            </button>
            <button
              onClick={handleCompleteReview}
              className="inline-flex items-center gap-2 rounded-full border border-tmMauve px-5 py-2 text-sm font-semibold text-tmMauve"
            >
              <ClipboardCheck className="h-4 w-4" />
              Complete review
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
