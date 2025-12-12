'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SaveStatus } from '../../hooks/useWorkbook';

type WorkbookReflectionProps = {
  value: string;
  onChange: (value: string) => void;
  prompts: string[];
  status: SaveStatus;
};

const statusCopy: Record<SaveStatus, string> = {
  idle: 'Reflection auto-saved',
  saving: 'Saving reflections…',
  saved: 'Reflections saved',
  error: 'Unable to save reflections',
};

const WorkbookReflection = ({ value, onChange, prompts, status }: WorkbookReflectionProps) => {
  const [activePrompt, setActivePrompt] = useState(0);
  const promptCount = prompts.length;

  useEffect(() => {
    setActivePrompt(0);
  }, [prompts]);

  useEffect(() => {
    if (!promptCount) return;
    const timer = window.setInterval(() => {
      setActivePrompt((prev) => (prev + 1) % promptCount);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [promptCount]);

  const currentPrompt = prompts[activePrompt];

  const handlePrev = () => {
    setActivePrompt((prev) => (prev - 1 + promptCount) % promptCount);
  };

  const handleNext = () => {
    setActivePrompt((prev) => (prev + 1) % promptCount);
  };

  return (
    <section className="tm-editorial-card tm-paper-texture space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Reflection lane</p>
          <p className="text-[0.75rem] text-[var(--tm-deep-mauve)]">{statusCopy[status]}</p>
        </div>
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Mentor eyes only</span>
      </div>
      <div className="relative">
        <AnimatePresence mode="wait">
          {currentPrompt && (
            <motion.div
              key={`${currentPrompt}-${activePrompt}`}
              className="rounded-[24px] border border-[var(--tm-blush)] bg-white/80 px-4 py-3 text-sm text-[var(--tm-charcoal)]/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45 }}
            >
              {currentPrompt}
            </motion.div>
          )}
        </AnimatePresence>
        {promptCount > 1 && (
          <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">
            <button
              type="button"
              onClick={handlePrev}
              className="rounded-full border border-[var(--tm-blush)] px-3 py-1 text-[0.6rem]"
            >
              Prev
            </button>
            <span>
              {activePrompt + 1}/{promptCount}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full border border-[var(--tm-blush)] px-3 py-1 text-[0.6rem]"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
        placeholder="Capture how your learnings are reshaping your rituals."
        className="w-full rounded-[28px] border border-[var(--tm-blush)] bg-white/90 px-5 py-4 text-sm leading-relaxed text-[var(--tm-charcoal)] outline-none transition focus:border-[var(--tm-deep-mauve)]"
      />
    </section>
  );
};

export default WorkbookReflection;
