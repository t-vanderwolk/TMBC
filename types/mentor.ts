export type MentorFeedback = {
  id: string;
  message: string;
  createdAt: string;
  mentor?: {
    id: string;
    name: string | null;
  };
  member?: {
    id: string;
    name: string | null;
  };
  module?: {
    id: string;
    title?: string | null;
  } | null;
  registryItem?: {
    id: string;
    title?: string | null;
  } | null;
};

export type MentorTask = {
  id: string;
  mentorId: string;
  memberId: string;
  type: string;
  referenceId?: string | null;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string;
};

export type MentorJournalShare = {
  shareId: string;
  journalId: string;
  sharedAt: string;
  excerpt: string;
};
