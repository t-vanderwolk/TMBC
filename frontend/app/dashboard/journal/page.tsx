'use client';

import { useEffect, useState } from 'react';
import { BookHeart, PenSquare, Share2 } from 'lucide-react';

import { api } from '@/lib/api';
import { loadSession } from '@/lib/auth';

type Entry = {
  id: string;
  date: string;
  prompt: string;
  excerpt: string;
  shared: boolean;
};

const sampleEntries: Entry[] = [
  { id: '1', date: 'Mar 18', prompt: 'Daily Reflection', excerpt: 'Felt baby hiccups during morning tea...', shared: true },
  { id: '2', date: 'Mar 17', prompt: 'Keepsake Timeline', excerpt: 'Ordered the heirloom quilt from Nana.', shared: false },
];

export default function JournalPage() {
  const [entries, setEntries] = useState(sampleEntries);
  const [reflection, setReflection] = useState('');
  const session = loadSession();
  const defaultMentorId = session?.payload?.mentorId || 'mentor-demo';

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        await api.get('/api/journal');
        // TODO: auto-lock previous entries + fetch real journal data
      } catch (error) {
        console.error('Journal placeholder error', error);
      }
    };

    fetchJournal();
  }, []);

  const handleSave = () => {
    if (!reflection.trim()) return;
    setEntries((prev) => [
      {
        id: Date.now().toString(),
        date: 'Today',
        prompt: 'Daily Reflection',
        excerpt: reflection.slice(0, 60),
        shared: false,
      },
      ...prev,
    ]);
    setReflection('');
  };

  const toggleShare = async (entryId: string, nextShare: boolean) => {
    setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, shared: nextShare } : entry)));
    try {
      await api.post('/api/mentor/journal/share', {
        journalId: entryId,
        mentorId: defaultMentorId,
        allowed: nextShare,
      });
      // TODO: connect to mentor selection + expose share status to mentor workspace
    } catch (error) {
      console.error('Journal share toggle placeholder error', error);
    }
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">Personal Journal</p>
        <h1 className="text-4xl text-tmCharcoal">Capture the moments you never want to forget.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Daily reflections stay private between you and your mentor unless you choose to share.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-tmBlush/30 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <PenSquare className="h-6 w-6 text-tmMauve" />
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Daily Reflection</p>
              <h2 className="text-2xl text-tmCharcoal">What felt gentle today?</h2>
            </div>
          </div>
          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="Pour your thoughts, wins, wobbles..."
            className="mt-4 min-h-[160px] w-full rounded-2xl border border-tmBlush/40 bg-tmIvory/60 p-4 text-sm text-tmCharcoal outline-none"
          />
          <div className="mt-4 flex items-center justify-between text-xs text-tmCharcoal/60">
            <span>// TODO: lock entries after 24h + sync with mentor view</span>
            <button
              onClick={handleSave}
              className="rounded-full bg-tmMauve px-4 py-2 text-sm font-semibold text-white shadow-soft"
            >
              Save Entry
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-tmBlush/30 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BookHeart className="h-6 w-6 text-tmMauve" />
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">My Keepsake Timeline</p>
              <h2 className="text-2xl text-tmCharcoal">Recently captured</h2>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="space-y-2 rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-tmMauve">{entry.date}</p>
                    <p className="text-base font-semibold text-tmCharcoal">{entry.prompt}</p>
                  </div>
                  <button
                    onClick={() => toggleShare(entry.id, !entry.shared)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      entry.shared
                        ? 'bg-tmMauve text-white'
                        : 'border border-tmMauve/40 text-tmMauve'
                    }`}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    {entry.shared ? 'Shared' : 'Share'}
                  </button>
                </div>
                <p className="text-sm text-tmCharcoal/70">{entry.excerpt}</p>
                <p className="text-xs text-tmCharcoal/60">
                  {entry.shared
                    ? 'Mentor can see this reflection.'
                    : '// TODO: confirm share once mentor assigned'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
