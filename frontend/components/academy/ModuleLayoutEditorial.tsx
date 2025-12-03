'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import CardPlaceholder from '@/components/ui/CardPlaceholder';
import EncouragementBubble from '@/components/academy/EncouragementBubble';
import ProgressStars from '@/components/academy/ProgressStars';
import { useSoftConfetti } from '@/components/academy/Interactions';
import type { AcademyModule } from '../../app/dashboard/learn/modules';
import { journeyMeta } from '../../app/dashboard/learn/modules';
import { moduleProgressSteps, useModuleProgress } from '@/hooks/useModuleProgress';

type ModuleLayoutEditorialProps = {
  module: AcademyModule;
  children: ReactNode;
};

const ModuleLayoutEditorial = ({ module, children }: ModuleLayoutEditorialProps) => {
  const meta = journeyMeta[module.journey];
  const { progress } = useModuleProgress(module.id);
  const { SoftConfettiLayer, triggerSoftConfetti } = useSoftConfetti();
  const completedSteps = useMemo(
    () => moduleProgressSteps.filter((step) => progress[step.id] === 'completed').length,
    [progress],
  );
  const progressPercent = Math.round((completedSteps / moduleProgressSteps.length) * 100);
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (progressPercent === 100 && !celebrated) {
      triggerSoftConfetti();
      setCelebrated(true);
    } else if (progressPercent < 100 && celebrated) {
      setCelebrated(false);
    }
  }, [progressPercent, celebrated, triggerSoftConfetti]);

  return (
    <EncouragementBubble>
      <div className="space-y-10 relative">
        <SoftConfettiLayer />
        <section className="tm-paper-texture relative overflow-hidden rounded-[40px] border border-[var(--tm-mauve)] bg-gradient-to-br from-[#F6EDF7] via-[#F6F1EB] to-white/90 shadow-editorial">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-8 left-12 h-36 w-36 rounded-full bg-[var(--tm-gold)]/20 blur-3xl" />
            <div className="absolute bottom-6 right-6 h-32 w-32 rounded-full bg-[var(--tm-mauve)]/40 blur-3xl" />
          </div>
          <motion.div
            className="absolute top-6 right-6 z-30 rounded-[32px] border border-[var(--tm-gold)] bg-[var(--tm-ivory)]/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)] shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            aria-label="Mentor bubble"
          >
            Need a mentor nudge? I've witnessed 400 serene studios today.
          </motion.div>
          <div className="sticky top-20 z-20 rounded-[40px] bg-white/80 px-6 py-10 backdrop-blur-lg">
            <nav className="flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-mauve)]">
              <Link href="/dashboard" className="hover:text-[var(--tm-deep-mauve)]">
                Dashboard
              </Link>
              <span>/</span>
              <Link href="/dashboard/learn" className="hover:text-[var(--tm-deep-mauve)]">
                Academy
              </Link>
              <span>/</span>
              <span className="text-[var(--tm-deep-mauve)]">{meta.label}</span>
            </nav>
            <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] items-center">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">
                  {meta.label}
                </p>
                <motion.h1
                  className="tm-serif-title mt-3 text-4xl md:text-5xl leading-tight text-[var(--tm-deep-mauve)]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  {module.title}
                </motion.h1>
                <p className="mt-3 text-lg text-[var(--tm-charcoal)]/75">{module.subtitle}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.7rem] uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)]">
                  <span className="tm-gold-bracket">{module.registryFocus}</span>
                  <span>{module.estimatedMinutes} min atelier</span>
                  <span>{module.track}</span>
                </div>
                <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
                  {moduleProgressSteps.map((step) => (
                    <ProgressStars
                      key={step.id}
                      label={step.label}
                      completed={progress[step.id] === 'completed'}
                      inProgress={progress[step.id] === 'in-progress'}
                    />
                  ))}
                </div>
              </div>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[32px] border border-[var(--tm-blush)] bg-[var(--tm-ivory)]">
                <CardPlaceholder className="absolute inset-0 h-full w-full !rounded-[32px] !border-0 !shadow-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--tm-charcoal)]/50 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.45em] text-white/90">
                  Studio {module.order}
                </div>
                <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[var(--tm-deep-mauve)]">
                  <span>Next</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
            <motion.div
              className="sticky top-4 z-20 mt-6 rounded-[32px] border border-[var(--tm-gold)] bg-white/90 px-5 py-4 shadow-2xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">Chapter ribbon</span>
                <span className="text-[1.5rem] font-semibold text-[var(--tm-deep-mauve)]">{progressPercent}%</span>
              </div>
              <div className="mt-3 h-1 rounded-full bg-[var(--tm-mauve)]/20">
                <motion.div
                  className="h-full rounded-full bg-[var(--tm-gold)]"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              </div>
              <p className="mt-3 text-[0.65rem] text-[var(--tm-charcoal)]/70">
                Sticky progress ribbon keeps your chapter rhythm in view while the studio scrolls below.
              </p>
            </motion.div>
          </div>
        </section>
        <div className="space-y-8">{children}</div>
      </div>
    </EncouragementBubble>
  );
};

export default ModuleLayoutEditorial;
