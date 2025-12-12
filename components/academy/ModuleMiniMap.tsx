'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

type MapSection = {
  id: string;
  label: string;
};

type ModuleMiniMapProps = {
  sections: MapSection[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
};

export default function ModuleMiniMap({ sections, activeId, onActiveChange }: ModuleMiniMapProps) {
  const [current, setCurrent] = useState(activeId ?? sections[0]?.id ?? '');

  useEffect(() => {
    if (activeId) {
      setCurrent(activeId);
    }
  }, [activeId]);

  const determineActive = useCallback(() => {
    if (typeof window === 'undefined') return;
    let candidate = sections[0]?.id ?? '';
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (!element) return;
      const { top } = element.getBoundingClientRect();
      if (top <= window.innerHeight * 0.35) {
        candidate = section.id;
      }
    });
    if (candidate && candidate !== current) {
      setCurrent(candidate);
      onActiveChange?.(candidate);
    }
  }, [current, onActiveChange, sections]);

  useEffect(() => {
    determineActive();
    window.addEventListener('scroll', determineActive, { passive: true });
    return () => {
      window.removeEventListener('scroll', determineActive);
    };
  }, [determineActive]);

  const handleJump = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCurrent(sectionId);
    onActiveChange?.(sectionId);
  };

  const shimmering = useMemo(
    () => ({
      animate: { opacity: [0, 0.4, 0.1], y: [0, -2, 0], x: [0, 0, 3] },
      transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
    }),
    [],
  );

  return (
    <aside className="sticky top-24 hidden w-full rounded-[32px] border border-[var(--tm-mauve)] bg-gradient-to-br from-[#F6EDF7] via-white to-[var(--tm-ivory)] p-6 shadow-editorial lg:block">
      <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-deep-mauve)]">
        Module mini-map
      </p>
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
        Smooth scroll & studio cues
      </p>
      <div className="mt-4 space-y-3">
        {sections.map((section) => {
          const isActive = section.id === current;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleJump(section.id)}
              className="relative flex w-full items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-left text-sm text-[var(--tm-charcoal)] transition hover:border-[var(--tm-gold)] hover:text-[var(--tm-deep-mauve)]"
            >
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{section.label}</p>
                <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">
                  tap to glide
                </span>
              </div>
              <div className="relative h-8 w-8">
                <motion.span
                  className={`absolute inset-0 rounded-full border-2 transition ${
                    isActive ? 'border-[var(--tm-gold)]' : 'border-[var(--tm-mauve)]/40'
                  }`}
                  animate={isActive ? shimmering.animate : undefined}
                  transition={isActive ? shimmering.transition : undefined}
                />
                <span
                  className={`absolute inset-2 rounded-full transition ${
                    isActive ? 'bg-[var(--tm-gold)]/70' : 'bg-[var(--tm-mauve)]/30'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
