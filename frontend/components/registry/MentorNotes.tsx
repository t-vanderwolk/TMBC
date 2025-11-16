'use client';

import type { MentorNote } from '@/types/registry';

type MentorNotesProps = {
  notes: MentorNote[];
};

export default function MentorNotes({ notes }: MentorNotesProps) {
  if (!notes.length) {
    return (
      <div className="rounded-2xl border border-dashed border-tmBlush/60 bg-white/80 p-4 text-sm text-tmCharcoal/70">
        <p className="font-semibold text-tmCharcoal">Mentor Notes</p>
        <p className="mt-1 text-xs text-tmCharcoal/60">Your mentor hasn&apos;t added notes yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-tmBlush/60 bg-white/90 p-4 text-sm text-tmCharcoal/80">
      <p className="font-semibold text-tmCharcoal">Mentor Notes</p>
      <div className="mt-3 space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="rounded-xl bg-tmIvory/80 p-3">
            <p className="text-sm text-tmCharcoal">{note.note}</p>
            <p className="mt-2 text-xs text-tmCharcoal/60">
              — {note.mentorName || 'Taylor Mentor'} · {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
