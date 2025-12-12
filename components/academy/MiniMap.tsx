'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ScrollTargets = {
  journal: string;
  moodboard: string;
  checklist: string;
  reflection: string;
  apply: string;
  notes: string;
  mentor?: string;
};

type MiniMapProps = {
  slidesCount: number;
  currentSlide: number;
  onSlideJump: (index: number) => void;
  scrollTargets: ScrollTargets;
  onSectionChange?: (target: string) => void;
};

export default function MiniMap({
  slidesCount,
  currentSlide,
  onSlideJump,
  scrollTargets,
  onSectionChange,
}: MiniMapProps) {
  const sections = useMemo(
    () => [
      { label: 'Lecture', target: '#lecture' },
      { label: 'Journal', target: scrollTargets.journal },
      { label: 'Moodboard', target: scrollTargets.moodboard },
      { label: 'Checklist', target: scrollTargets.checklist },
      { label: 'Reflection', target: scrollTargets.reflection },
      { label: 'Apply', target: scrollTargets.apply },
      { label: 'Mentor Notes', target: scrollTargets.mentor ?? scrollTargets.notes },
    ],
    [scrollTargets],
  );

  const [activeSection, setActiveSection] = useState(sections[0]?.target ?? '#lecture');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sparkleChance = useMemo(() => Math.random() < 1 / 15, []);
  const [fairyVisible, setFairyVisible] = useState(false);

  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id ? `#${entry.target.id}` : '';
          if (id) {
            setActiveSection(id);
            onSectionChange?.(id);
          }
        });
      },
      { rootMargin: '-40% 0% -50% 0%', threshold: 0.35 },
    );
    sections.forEach((section) => {
      if (!section.target) return;
      const element = document.querySelector(section.target);
      if (element) {
        observer.observe(element);
      }
    });
    return () => observer.disconnect();
  }, [sections, onSectionChange]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const handleSectionClick = useCallback(
    (target: string) => {
      if (typeof window === 'undefined') return;
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(target);
        onSectionChange?.(target);
      }
      if (drawerOpen) {
        setTimeout(closeDrawer, 200);
      }
    },
    [drawerOpen, onSectionChange],
  );

  const handleKeyShortcuts = useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          onSlideJump(Math.min(currentSlide + 1, Math.max(slidesCount - 1, 0)));
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onSlideJump(Math.max(currentSlide - 1, 0));
          break;
        case '1':
          document.querySelector('#lecture')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case '2':
          document.querySelector('#journal')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case '3':
          document.querySelector('#moodboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        case '4':
          document.querySelector('#apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          break;
        default:
          break;
      }
    },
    [currentSlide, slidesCount, onSlideJump],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', handleKeyShortcuts);
    return () => window.removeEventListener('keydown', handleKeyShortcuts);
  }, [handleKeyShortcuts]);

  const fairyTip = '✨ Baby Fairy Tip: Trust your instincts.';

  const renderPanel = () => (
    <div className="rounded-[32px] border border-[var(--tm-blush)] bg-[#F6F1EB]/90 p-5 shadow-[0_25px_70px_rgba(134,75,95,0.25)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#3E2F35]">Mini Map</p>
          {sparkleChance && (
            <button
              type="button"
              onClick={() => {
                setFairyVisible(true);
                window.setTimeout(() => setFairyVisible(false), 3200);
              }}
              className="text-[0.65rem] leading-none text-[var(--tm-gold)]"
            >
              ✨
            </button>
          )}
        </div>
        <div className="text-[0.6rem] uppercase tracking-[0.45em] text-[#8B6581]">
          Slide {Math.min(currentSlide + 1, Math.max(slidesCount, 1))} / {Math.max(slidesCount, 1)}
        </div>
      </div>
      {fairyVisible && (
        <div className="mt-2 rounded-2xl border border-[var(--tm-gold)] bg-white/90 px-3 py-2 text-[0.65rem] text-[#3E2F35] shadow-lg">
          {fairyTip}
        </div>
      )}
      <div className="mt-4 grid gap-3">
        {sections.map((section) => {
          const isActive = activeSection === section.target;
          return (
            <button
              key={section.target}
              type="button"
              onClick={() => handleSectionClick(section.target)}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm uppercase tracking-[0.35em] transition ${
                isActive
                  ? 'border-[var(--tm-gold)] bg-white text-[var(--tm-deep-mauve)] shadow-lg'
                  : 'border-transparent bg-white/60 text-[#3E2F35] hover:border-[var(--tm-blush)] hover:text-[var(--tm-deep-mauve)]'
              }`}
            >
              <span>{section.label}</span>
              <span className="text-[0.55rem] text-[#8B6581]">↗</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {Array.from({ length: Math.max(slidesCount, 1) }).map((_, idx) => {
            const isCurrent = idx === currentSlide;
            const isComplete = idx < currentSlide;
            return (
              <button
                key={idx}
                type="button"
                aria-label={`Jump to slide ${idx + 1}`}
                onClick={() => onSlideJump(idx)}
                className={`h-2 w-2 rounded-full transition ${
                  isCurrent ? 'bg-[var(--tm-gold)]' : isComplete ? 'bg-[#C6B6CE]' : 'bg-[#C6B6CE]/50'
                }`}
              />
            );
          })}
        </div>
        <div className="h-1.5 w-20 rounded-full bg-gradient-to-r from-[var(--tm-gold)] to-[var(--tm-mauve)] shadow-inner" />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="hidden lg:block lg:sticky lg:top-24">{renderPanel()}</div>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={openDrawer}
          className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border border-[var(--tm-deep-mauve)] bg-white/90 px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35] shadow-xl"
        >
          ✨ Map
        </button>
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              ref={drawerRef}
              className="fixed inset-x-4 bottom-4 z-40 rounded-[32px] border border-[var(--tm-blush)] bg-white/95 p-4 shadow-[0_25px_60px_rgba(134,75,95,0.35)]"
              initial={{ y: 400, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 400, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.y > 60) {
                  closeDrawer();
                }
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]">Mini Map</p>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="text-sm font-semibold text-[#3E2F35]"
                >
                  Close
                </button>
              </div>
              <div className="mt-3">{renderPanel()}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
