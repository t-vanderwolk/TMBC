'use client';
import { useEffect, useMemo, useState } from 'react';
import { Loader2, MessageSquarePlus, PlusCircle, ChevronDown } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth.client';
import type { MentorNote } from '@/types/registry';
import type { MentorFeedback } from '@/types/mentor';

type MentorNotesProps = {
  notes: MentorNote[];
  registryItemId: string;
};

export default function MentorNotes({ notes, registryItemId }: MentorNotesProps) {
  const session = loadSession();
  const memberId = session?.payload?.userId;
  const mentorId = session?.payload?.mentorId || 'mentor-demo';
  const [thread, setThread] = useState<MentorFeedback[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState('');
  const [loadingThread, setLoadingThread] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allNotes = useMemo(() => {
    return [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notes]);

  useEffect(() => {
    if (!memberId) return;

    const fetchThread = async () => {
      try {
        setLoadingThread(true);
        const response = await api.get(`/api/mentor/feedback/${memberId}?registryItemId=${registryItemId}`);
        setThread(response.data?.data ?? []);
      } catch (error) {
        console.error('Mentor feedback thread placeholder error', error);
      } finally {
        setLoadingThread(false);
      }
    };

    fetchThread();
  }, [memberId, registryItemId]);

  const handleAskMentor = async () => {
    if (!draft.trim() || !memberId) return;
    try {
      setSubmitting(true);
      const response = await api.post('/api/mentor/feedback', {
        memberId,
        mentorId,
        registryItemId,
        message: draft,
      });
      if (response.data?.data) {
        setThread((prev) => [response.data.data, ...prev]);
      }
      setDraft('');
    } catch (error) {
      console.error('Ask mentor placeholder error', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-tmBlush/60 bg-white/90 p-4 text-sm text-tmCharcoal/80">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-tmCharcoal">Mentor Notes</p>
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-tmMauve"
        >
          Thread
          <ChevronDown className={`h-3 w-3 transition ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {allNotes.length === 0 && (
        <p className="mt-1 text-xs text-tmCharcoal/60">Your mentor hasn&apos;t added notes yet.</p>
      )}
      <div className="mt-3 space-y-3">
        {allNotes.map((note) => (
          <div key={note.id} className="rounded-xl bg-tmIvory/80 p-3">
            <p className="text-sm text-tmCharcoal">{note.note}</p>
            <p className="mt-2 text-xs text-tmCharcoal/60">
              — {note.mentorName || 'Mentor'} · {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {expanded && (
        <div className="mt-4 space-y-3 rounded-xl border border-tmBlush/30 bg-white/80 p-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-tmMauve">
            <MessageSquarePlus className="h-4 w-4 text-tmMauve" />
            Threaded Advice
          </div>
          <p className="text-xs text-tmCharcoal/60">// TODO: Replace mock thread with live mentor feedback data</p>
          {loadingThread ? (
            <div className="flex items-center gap-2 text-sm text-tmCharcoal/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading thread…
            </div>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {thread.map((entry) => (
                <div key={entry.id} className="rounded-xl bg-tmIvory/70 p-3">
                  <p className="text-sm text-tmCharcoal">{entry.message}</p>
                  <p className="mt-1 text-xs text-tmCharcoal/60">
                    {entry.mentor?.name || 'You'} · {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {!thread.length && (
                <p className="text-xs text-tmCharcoal/60">// TODO: Encourage mentor/member to start thread</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              placeholder="Ask your mentor for advice…"
              className="w-full rounded-xl border border-tmBlush/40 bg-white/80 p-2 text-sm outline-none"
            />
            <button
              onClick={handleAskMentor}
              disabled={!draft.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-full border border-tmMauve px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-tmMauve disabled:opacity-50"
            >
              <PlusCircle className="h-4 w-4" />
              {submitting ? 'Sending…' : 'Ask Mentor'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
