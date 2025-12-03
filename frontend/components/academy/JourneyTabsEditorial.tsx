"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import type { AcademyModule, JourneyId } from '../../app/dashboard/learn/modules';
import { journeyMeta } from '../../app/dashboard/learn/modules';

type JourneyTabsEditorialProps = {
  journeys: JourneyId[];
  modulesByJourney: Record<JourneyId, AcademyModule[]>;
};

const journeyTooltips: Record<JourneyId, string> = {
  nursery: 'Where dreams get their first address.',
  gear: 'Strollers, carriers, and the great debate: do we need three?',
  postpartum: 'Healing, holding, and learning your new rhythm.',
};

const JourneyTabsEditorial = ({ journeys, modulesByJourney }: JourneyTabsEditorialProps) => {
  const [activeJourney, setActiveJourney] = useState<JourneyId>(journeys[0]);

  const activeModules = modulesByJourney[activeJourney] ?? [];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<JourneyId, HTMLButtonElement | null>>({
    nursery: null,
    gear: null,
    postpartum: null,
  });
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const button = buttonRefs.current[activeJourney];
    const container = containerRef.current;
    if (!button || !container) return;
    const buttonRect = button.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setUnderline({
      left: buttonRect.left - containerRect.left,
      width: buttonRect.width,
    });
  }, [activeJourney, journeys]);

  const curatedLine = useMemo(() => {
    if (!activeModules.length) return 'Journeys curated for your rhythm.';
    return activeModules
      .slice(0, 3)
      .map((module) => module.track)
      .join(' • ');
  }, [activeModules]);

  return (
    <section className="tm-paper-texture tm-soft-fade relative overflow-hidden rounded-[40px] border border-[var(--tm-blush)] bg-white/70 p-6">
      <div className="absolute -top-6 left-4 h-24 w-24 rounded-full bg-[var(--tm-gold)]/30 blur-3xl" aria-hidden />
      <div className="absolute -bottom-8 right-6 h-28 w-28 rounded-full bg-[var(--tm-blush)]/40 blur-3xl" aria-hidden />
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">
            Journey selector
          </p>
          <div className="relative" ref={containerRef}>
            <div className="flex flex-wrap gap-3">
              {journeys.map((journey) => {
                const isActive = journey === activeJourney;
                return (
                <button
                  key={journey}
                  type="button"
                  ref={(node) => {
                    buttonRefs.current[journey] = node;
                  }}
                  onClick={() => setActiveJourney(journey)}
                  aria-pressed={isActive}
                  title={journeyTooltips[journey]}
                  className={`relative overflow-hidden rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.45em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--tm-gold)] ${
                    isActive
                      ? 'border-[var(--tm-deep-mauve)] bg-[var(--tm-deep-mauve)]/10 text-[var(--tm-deep-mauve)]'
                      : 'border-[var(--tm-blush)] text-[var(--tm-mauve)]'
                  }`}
                >
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-white/70 via-[var(--tm-gold)]/40 to-white/70 opacity-0"
                    whileHover={{ opacity: 0.65, x: 32 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                  <span className="relative z-10">{journeyMeta[journey].label}</span>
                </button>
                );
              })}
            </div>
            <motion.div
              className="absolute bottom-0 h-0.5 rounded-full bg-[var(--tm-gold)]"
              animate={{ x: underline.left, width: underline.width }}
              transition={{ type: 'spring', stiffness: 220, damping: 30 }}
            />
          </div>
          <p className="text-sm text-[var(--tm-charcoal)]/70">{journeyTooltips[activeJourney]}</p>
        </div>
        <div className="space-y-4">
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
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
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
    </section>
  );
};

export default JourneyTabsEditorial;
