'use client';

import { useEffect, useState } from 'react';
import { BookHeart, PenSquare } from 'lucide-react';

import { api } from '@/lib/api';

type Entry = {
  id: string;
  date: string;
  prompt: string;
  excerpt: string;
};

const sampleEntries: Entry[] = [
  { id: '1', date: 'Mar 18', prompt: 'Daily Reflection', excerpt: 'Felt baby hiccups during morning tea...' },
  { id: '2', date: 'Mar 17', prompt: 'Keepsake Timeline', excerpt: 'Ordered the heirloom quilt from Nana.' },
];

export default function JournalPage() {
  const [entries, setEntries] = useState(sampleEntries);
  const [reflection, setReflection] = useState('');

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
      { id: Date.now().toString(), date: 'Today', prompt: 'Daily Reflection', excerpt: reflection.slice(0, 60) },
      ...prev,
    ]);
    setReflection('');
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
              <div key={entry.id} className="rounded-2xl border border-tmBlush/30 bg-tmIvory/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-tmMauve">{entry.date}</p>
                <p className="text-base font-semibold text-tmCharcoal">{entry.prompt}</p>
                <p className="mt-1 text-sm text-tmCharcoal/70">{entry.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
