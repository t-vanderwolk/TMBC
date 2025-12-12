'use client';

import { MessageSquare } from 'lucide-react';

import type { MentorFeedback } from '@/types/mentor';

type MentorFeedbackCardProps = {
  feedback: MentorFeedback;
};

const MentorFeedbackCard = ({ feedback }: MentorFeedbackCardProps) => {
  const subtitle = feedback.module?.title || feedback.registryItem?.title || 'General Reflection';
  return (
    <div className="rounded-2xl border border-tmBlush/40 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-tmMauve">
        <MessageSquare className="h-4 w-4 text-tmMauve" />
        Mentor Feedback
      </div>
      <p className="mt-1 text-xs text-tmCharcoal/60">// TODO: Replace mock data with feed from mentorCollab service</p>
      <p className="mt-3 text-lg font-semibold text-tmCharcoal">{subtitle}</p>
      <p className="mt-2 text-sm text-tmCharcoal/80">{feedback.message}</p>
      <p className="mt-3 text-xs text-tmCharcoal/50">
        {feedback.mentor?.name || 'Mentor'} · {new Date(feedback.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default MentorFeedbackCard;
