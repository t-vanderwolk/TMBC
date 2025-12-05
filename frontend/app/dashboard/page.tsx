"use client";

import DashboardHeroEditorial from '@/components/dashboard/DashboardHeroEditorial';
import DashboardOverviewCards, { JourneyCard } from '@/components/dashboard/DashboardOverviewCards';
import DashboardProgressLine, { MilestoneBadge } from '@/components/dashboard/DashboardProgressLine';

const journeyStats = {
  completedModules: 4,
  totalModules: 6,
  registryItems: 12,
  mentorNotes: 3,
};

const journeyCards: JourneyCard[] = [
  {
    title: 'Academy Atelier',
    status: 'Lecture 4 · Warm-light focus',
    detail: 'New slides drop at 7am—bring a hot tea and a journal prompt.',
    meta: 'Module 4 unlocking soon',
  },
  {
    title: 'Registry Styling',
    status: '12 curated pieces · 1 edit today',
    detail: 'Mentor flagged linen layers to keep swapping light cozy rituals.',
    meta: 'Shelved for weekend review',
  },
  {
    title: 'Mentor Chat',
    status: 'Ellie replies in 9m',
    detail: 'Voice note: “Tea + gratitude” ritual shared during your last check-in.',
    meta: 'Next call Friday · 3p PT',
  },
];

const progressMilestones: MilestoneBadge[] = [
  { label: 'Lecture', detail: 'Slide 3 of 5', achieved: true },
  { label: 'Registry', detail: '12 pieces curated', achieved: true },
  { label: 'Mentor Check', detail: 'Ellie tomorrow', achieved: false },
];

const previewCards = [
  {
    title: 'Academy',
    hint: 'Module 4 · Nursery calm focus',
    highlight: 'Schedule a 20-minute “car seat ritual” and drop a reflection on the workbook.',
  },
  {
    title: 'Registry',
    hint: '12 pieces · 4 favorites',
    highlight: 'Mentor suggests skipping the wipe warmers and embracing the blush bassinet.',
  },
  {
    title: 'Mentor Chat',
    hint: 'Ellie · Voice note incoming',
    highlight: 'Ask about the tea + gratitude ritual and share how the module landed in your space.',
  },
];

export default function MemberDashboard() {
  return (
    <main className="space-y-8 px-6 py-10 text-[var(--tmbc-charcoal)]">
      <DashboardHeroEditorial
        memberName="Taylor"
        stageLabel="Mother-to-be · Third trimester"
        status="Invited mentor circle · calm & curious"
        tagLine="This hub blends cinematic ease with a warm, editorial rhythm—your mentors are listening."
      />

      <DashboardOverviewCards cards={journeyCards} />

      <DashboardProgressLine
        completedModules={journeyStats.completedModules}
        totalModules={journeyStats.totalModules}
        registryItems={journeyStats.registryItems}
        mentorNotes={journeyStats.mentorNotes}
        milestones={progressMilestones}
      />

      <section className="space-y-4 rounded-[36px] border border-[var(--tmbc-mauve)]/20 bg-white/90 p-6 shadow-[0_25px_90px_rgba(199,166,199,0.2)]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[var(--tmbc-charcoal)]">Previews · Academy · Registry · Mentor Chat</h2>
          <span className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-charcoal)]/60">Guided pathway</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {previewCards.map((preview) => (
            <article
              key={preview.title}
              className="flex h-full flex-col justify-between rounded-[32px] border border-[var(--tmbc-charcoal)]/10 bg-[var(--tmbc-ivory)]/80 p-5 shadow-[0_20px_70px_rgba(199,166,199,0.2)]"
            >
              <div>
                <p className="text-[0.6rem] uppercase tracking-[0.5em] text-[var(--tmbc-charcoal)]/60">{preview.title}</p>
                <h3 className="mt-3 text-lg font-semibold text-[var(--tmbc-charcoal)]">{preview.hint}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--tmbc-charcoal)]/70">{preview.highlight}</p>
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
