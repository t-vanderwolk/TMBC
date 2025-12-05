'use client';

import { useMemo, useState } from 'react';

type ModuleMeta = {
  id: string;
  title: string;
  journey: 'Nursery' | 'Gear' | 'Postpartum';
  badges: string[];
  minutes: number;
  progress: number;
  mentorNote: string;
  focus: string;
};

const modules: ModuleMeta[] = [
  {
    id: 'studio-car-seat',
    title: 'Car Seat Couture & Calm Installation',
    journey: 'Nursery',
    badges: ['Video', 'Mentor audio'],
    minutes: 12,
    progress: 55,
    mentorNote: 'Ellie says: “Trust the recline. I’ll drop a voice note when you’re ready.”',
    focus: 'Master the installation with ritualized breathing so the little one always arrives wrapped in confidence.',
  },
  {
    id: 'studio-lighting',
    title: 'Moodboard Lighting & Lullaby Layers',
    journey: 'Nursery',
    badges: ['Moodboard', 'Checklist'],
    minutes: 8,
    progress: 20,
    mentorNote: 'Registry stylist tip: keep the glow soft and rewind 2 shades.',
    focus: 'Curate a layered lighting palette that whispers calm and invites bedside journaling.',
  },
  {
    id: 'studio-gear-flow',
    title: 'Gear Flow + Registry Edits',
    journey: 'Gear',
    badges: ['Registry', 'Live edit'],
    minutes: 15,
    progress: 35,
    mentorNote: 'Marisol: “Lean into capsule pieces, skip the wipe-warmer parade.”',
    focus: 'Trim the registry to essentials so every piece feels like a breath of home.',
  },
  {
    id: 'studio-postpartum',
    title: 'Postpartum Planning + Breathwork',
    journey: 'Postpartum',
    badges: ['Reflection', 'Journal'],
    minutes: 10,
    progress: 10,
    mentorNote: 'Mindful post-birth ritual queued—bring tea and paper.',
    focus: 'Record gentle breathwork cues and soft intentions for the chapter to come.',
  },
  {
    id: 'studio-closet',
    title: 'Closet Edit · 12 curated pieces',
    journey: 'Gear',
    badges: ['Registry', 'Mentor note'],
    minutes: 7,
    progress: 70,
    mentorNote: 'Registry mentor: “Replace the bulk with curated capsule vibes.”',
    focus: 'Balance wardrobe ease with lingered blush textures for every tender moment ahead.',
  },
];

const filters = ['All', 'Nursery', 'Gear', 'Postpartum'] as const;

const previewMoments = [
  {
    label: 'Academy Pulse',
    detail: 'Module 4 drops at 7am · 15-minute ritual',
    note: 'Stack a warm breath before diving in to keep the cinematic thread alive.',
  },
  {
    label: 'Registry Whisper',
    detail: '12 curated pieces · 2 edits today',
    note: 'Mentor recommends skipping the wipe warmers in favor of two blush baskets.',
  },
  {
    label: 'Mentor Chat',
    detail: 'Ellie · Voice drop tonight',
    note: 'Send your journal reflection before bedtime so the note feels like tea.',
  },
];

export default function UnifiedAcademyLearnPage() {
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>('All');

  const filteredModules = useMemo(() => {
    if (activeFilter === 'All') return modules;
    return modules.filter((module) => module.journey === activeFilter);
  }, [activeFilter]);

  const journeyProgress =
    modules.length > 0
      ? Math.round(
          (modules.reduce((sum, module) => sum + module.progress, 0) / (modules.length * 100)) * 100,
        )
      : 0;

  const totalMinutes = modules.reduce((sum, module) => sum + module.minutes, 0);

  return (
    <main className="space-y-10 px-6 py-10 text-[var(--tmbc-charcoal)]">
      <section className="rounded-[40px] border border-[var(--tmbc-mauve)] bg-gradient-to-br from-[var(--tmbc-blush)]/90 via-white/80 to-[var(--tmbc-mauve)]/70 p-8 shadow-[0_40px_90px_rgba(199,166,199,0.35)]">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/70">Academy · Learn</p>
        <h1 className="font-serif text-4xl text-[var(--tmbc-charcoal)]">Soft choreography for your learning flow</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--tmbc-charcoal)]/70">
          Every module feels like a curated studio—layered lighting, whispered mentor notes, and intentional steps
          that let you pause for breath while still making progress.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.85rem] text-[var(--tmbc-charcoal)]/80">
          <div className="rounded-[26px] border border-[var(--tmbc-charcoal)]/20 bg-white/70 px-4 py-2">
            {modules.length} micro-studios ready to be explored
          </div>
          <div className="rounded-[26px] border border-[var(--tmbc-charcoal)]/20 bg-white/70 px-4 py-2">
            {totalMinutes} minutes of tender learning
          </div>
          <div className="rounded-[26px] border border-[var(--tmbc-charcoal)]/20 bg-white/70 px-4 py-2">
            {journeyProgress}% of the journey orchestrated
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-6 shadow-[0_25px_80px_rgba(199,166,199,0.2)]">
        <div className="flex flex-wrap items-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-4 py-1 text-[0.65rem] uppercase tracking-[0.4em] transition ${
                activeFilter === filter
                  ? 'border-[var(--tmbc-mauve)] bg-[var(--tmbc-mauve)]/10 text-[var(--tmbc-mauve)]'
                  : 'border-[var(--tmbc-charcoal)]/20 text-[var(--tmbc-charcoal)]/70'
              }`}
            >
              {filter}
            </button>
          ))}
          <span className="text-xs tracking-[0.4em] text-[var(--tmbc-charcoal)]/70">Module filters</span>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module) => (
            <article
              key={module.id}
              className="group flex flex-col justify-between rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/90 p-5 shadow-[0_15px_50px_rgba(199,166,199,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(199,166,199,0.25)]"
            >
              <div className="space-y-2">
                <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">
                  {module.journey}
                </p>
                <h2 className="text-lg font-semibold text-[var(--tmbc-charcoal)]">{module.title}</h2>
                <p className="text-[0.85rem] text-[var(--tmbc-charcoal)]/70">{module.focus}</p>
                <p className="mt-3 text-sm italic text-[var(--tmbc-charcoal)]/70">{module.mentorNote}</p>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)]/60">
                  <span>{module.minutes} min atelier</span>
                  <span>{module.progress}% complete</span>
                </div>
                <div className="h-1 rounded-full bg-[var(--tmbc-blush)]/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--tmbc-mauve)] to-[var(--tmbc-gold)] transition-all"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/60">
                  {module.badges.map((badge) => (
                    <span key={badge} className="rounded-full border border-[var(--tmbc-mauve)]/40 px-3 py-1">
                      {badge}
                    </span>
                  ))}
                </div>
                <button className="inline-flex items-center justify-center rounded-full border border-[var(--tmbc-charcoal)]/20 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--tmbc-charcoal)] transition hover:border-[var(--tmbc-mauve)] hover:text-[var(--tmbc-mauve)]">
                  Continue module
                  <span aria-hidden className="ml-2 text-[var(--tmbc-gold)]">
                    →
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-[36px] border border-[var(--tmbc-mauve)]/20 bg-[var(--tmbc-ivory)]/70 p-6 shadow-[0_25px_90px_rgba(199,166,199,0.2)]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[var(--tmbc-charcoal)]">This afternoon · Academy cues</h2>
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Mentor curated</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {previewMoments.map((preview) => (
            <article
              key={preview.label}
              className="flex h-full flex-col justify-between rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-white/90 p-5 shadow-[0_20px_70px_rgba(199,166,199,0.2)]"
            >
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">{preview.label}</p>
                <h3 className="mt-3 text-lg font-semibold text-[var(--tmbc-charcoal)]">{preview.detail}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--tmbc-charcoal)]/70">{preview.note}</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-[var(--tmbc-charcoal)]/60">
                <span className="h-2 w-2 rounded-full bg-[var(--tmbc-mauve)]" />
                <span>calm command center</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
