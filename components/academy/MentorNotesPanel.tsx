'use client';

import { FormEvent, useMemo, useState } from 'react';

import { MentorNote, useMentorNotes } from '@/hooks/useMentorNotes';

type MentorNotesPanelProps = {
  memberId: string;
  moduleId: string;
  token: string;
  canWrite?: boolean;
};

const formatDate = (value: string) => {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

const NoteItem = ({ note }: { note: MentorNote }) => (
  <div className="space-y-2 rounded-[26px] border border-[var(--tm-blush)]/40 bg-[var(--tm-ivory)]/80 p-4">
    <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
      <span>{note.mentorName || 'Your mentor'}</span>
      <span className="text-[var(--tm-charcoal)]/60">{formatDate(note.createdAt)}</span>
    </div>
    <p className="text-sm leading-relaxed text-[var(--tm-charcoal)]/85">{note.content}</p>
  </div>
);

export default function MentorNotesPanel({ memberId, moduleId, token, canWrite }: MentorNotesPanelProps) {
  const { notes, loading, error, addNote } = useMentorNotes(memberId, moduleId, token);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const summaryLabel = useMemo(() => {
    if (loading) return 'Gathering the latest reflections...';
    if (error) return 'Mentor notes paused';
    if (!notes.length) return 'No notes here yet';
    return `Shared by ${notes[notes.length - 1].mentorName || 'your mentor'}`;
  }, [error, loading, notes]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) {
      setFormError('Capture a short note before sharing.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setFormMessage('Saving note...');

    try {
      await addNote(draft.trim());
      setDraft('');
      setFormMessage('Note saved—ready for the next check-in.');
    } catch (submitError) {
      setFormError('Unable to save the note. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="flex flex-col gap-4 rounded-[32px] border border-[var(--tm-blush)] bg-white/80 p-5 shadow-[0_25px_60px_rgba(146,92,115,0.25)]">
      <div className="space-y-1">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">Mentor whispers</p>
        <h2 className="tm-serif-title text-2xl text-[var(--tm-deep-mauve)]">Mentor Notes</h2>
        <p className="text-xs tracking-[0.4em] text-[var(--tm-charcoal)]/60">{summaryLabel}</p>
      </div>

      {loading && <p className="text-sm text-[var(--tm-charcoal)]/70">Loading mentor notes…</p>}
      {error && <p className="text-sm text-[var(--tm-charcoal)]/70">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {notes.length ? (
            notes.map((note) => <NoteItem key={note.id} note={note} />)
          ) : (
            <div className="rounded-[26px] border border-[var(--tm-blush)]/40 bg-[var(--tm-ivory)]/70 p-4 text-sm text-[var(--tm-charcoal)]/75">
              Notes will appear here as your mentor leaves them—think of it as the hush between lessons.
            </div>
          )}
        </div>
      )}

      {canWrite && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <label className="text-[0.6rem] uppercase tracking-[0.5em] text-[var(--tm-charcoal)]/60">Add a note</label>
          <textarea
            className="min-h-[120px] w-full rounded-[20px] border border-[var(--tm-mauve)]/30 bg-[var(--tm-ivory)]/80 px-4 py-3 text-sm leading-relaxed text-[var(--tm-charcoal)] focus:border-[var(--tm-mauve)] focus:outline-none"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={submitting}
            placeholder="Leave a warm note your mentee can reference in their flow."
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-[var(--tm-charcoal)]/60">
              {formError || formMessage || 'Notes are gentle, context-rich prompts for future reference.'}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-[999px] border border-[var(--tm-mauve)] bg-[var(--tm-mauve)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[var(--tm-deep-mauve)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Share'}
            </button>
          </div>
        </form>
      )}
    </aside>
  );
}
