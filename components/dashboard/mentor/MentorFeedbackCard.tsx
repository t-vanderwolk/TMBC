'use client';

import { MessageSquare } from 'lucide-react';

import type { MentorFeedback } from '@/types/mentor';

type MentorFeedbackCardProps = {
  feedback: MentorFeedback;
};

const MentorFeedbackCard = ({ feedback }: MentorFeedbackCardProps) => {
  const subtitle = feedback.module?.title || feedback.registryItem?.title || 'General Reflection';
  return (
    <div className="rounded-2xl border border-member-border-soft bg-member-background-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-member-accent-secondary">
        <MessageSquare className="h-4 w-4 text-member-accent-primary" />
        Mentor Feedback
      </div>
      <p className="mt-3 text-lg font-semibold text-member-text-primary">{subtitle}</p>
      <p className="mt-2 text-sm text-member-text-secondary">{feedback.message}</p>
      <p className="mt-3 text-xs text-member-text-secondary">
        {feedback.mentor?.name || "Mentor"} · {new Date(feedback.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default MentorFeedbackCard;
