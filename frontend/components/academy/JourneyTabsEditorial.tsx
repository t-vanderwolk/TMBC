'use client';

import { useMemo, useState } from 'react';

import type { AcademyModule, JourneyId } from '../../app/dashboard/learn/modules';
import { journeyMeta } from '../../app/dashboard/learn/modules';

type JourneyTabsEditorialProps = {
  journeys: JourneyId[];
  modulesByJourney: Record<JourneyId, AcademyModule[]>;
};

const JourneyTabsEditorial = ({ journeys, modulesByJourney }: JourneyTabsEditorialProps) => {
  const [activeJourney, setActiveJourney] = useState<JourneyId>(journeys[0]);

  const activeModules = modulesByJourney[activeJourney] ?? [];

  const curatedLine = useMemo(() => {
    if (!activeModules.length) return 'Journeys curated for your rhythm.';
    return activeModules
      .slice(0, 3)
      .map((module) => module.track)
      .join(' • ');
  }, [activeModules]);

  return (
    <section className="tm-paper-texture tm-soft-fade rounded-[40px] border border-[var(--tm-blush)] bg-white/70 p-6">
      <div className="flex flex-wrap items-center gap-3">
        {journeys.map((journey) => {
          const isActive = journey === activeJourney;
          return (
            <button
              key={journey}
              type="button"
              onClick={() => setActiveJourney(journey)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.45em] transition ${
                isActive
                  ? 'border-[var(--tm-deep-mauve)] bg-[var(--tm-deep-mauve)]/10 text-[var(--tm-deep-mauve)]'
                  : 'border-[var(--tm-blush)] text-[var(--tm-mauve)]'
              }`}
            >
              {journeyMeta[journey].label}
            </button>
          );
        })}
      </div>
      <div className="mt-6 space-y-4">
        <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">Journey note</p>
        <h2 className="tm-serif-title text-3xl leading-tight text-[var(--tm-deep-mauve)]">
          {journeyMeta[activeJourney].description}
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--tm-charcoal)]/70">
          <span className="tm-gold-bracket text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)]">
            {activeModules.length} Modules
          </span>
          <span className="text-[var(--tm-mauve)]">{curatedLine}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {activeModules.slice(0, 3).map((module) => (
            <article
              key={module.id}
              className="rounded-3xl border border-[var(--tm-blush)] bg-[var(--tm-ivory)]/80 p-4 text-[0.85rem] shadow-[0_20px_40px_rgba(130,90,110,0.15)]"
            >
              <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
                {module.registryFocus}
              </p>
              <p className="mt-2 font-semibold text-[var(--tm-deep-mauve)]">{module.title}</p>
              <p className="mt-1 text-[0.75rem] text-[var(--tm-charcoal)]/65">{module.subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneyTabsEditorial;
