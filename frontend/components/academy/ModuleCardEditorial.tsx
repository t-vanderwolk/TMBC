'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { api } from '@/lib/api';
import type { AcademyModule } from '../../app/dashboard/learn/modules';
import ProgressStars from '@/components/academy/ProgressStars';
import { moduleProgressSteps, useModuleProgress } from '@/hooks/useModuleProgress';
import ModuleProgressRing from '@/components/academy/ModuleProgressRing';

type ModuleCardEditorialProps = {
  module: AcademyModule;
};

const ModuleCardEditorial = ({ module }: ModuleCardEditorialProps) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { progress } = useModuleProgress(module.id);
  const completedSteps = useMemo(
    () => moduleProgressSteps.filter((step) => progress[step.id] === 'completed').length,
    [progress],
  );
  const progressPercent = Math.round((completedSteps / moduleProgressSteps.length) * 100);

  const handleAddAll = async () => {
    if (loading) return;
    setLoading(true);
    setFeedback(null);

    try {
      const recommended = await api.get(`/api/academy/module/${module.id}/recommended`);
      const products = (recommended.data?.products ?? []) as { id: string }[];
      if (!products.length) {
        setFeedback('No recommended items at the moment.');
        return;
      }

      await api.post('/api/registry/bulk/add', {
        productIds: products.map((product) => product.id),
      });

      setFeedback('Luxury set added to your registry.');
      setTimeout(() => setFeedback(null), 2200);
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Unable to add items right now.';
      setFeedback(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        rotateX: 4,
        rotateY: -3,
        scale: 1.02,
        boxShadow: '0 40px 90px rgba(147,85,131,0.25)',
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className="tm-editorial-card tm-paper-texture group relative flex h-full flex-col justify-between overflow-hidden border border-[var(--tm-blush)] bg-gradient-to-br from-white via-[var(--tm-ivory)] to-[var(--tm-blush)]/60 text-left"
      style={{ borderColor: module.accentColor || 'var(--tm-blush)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-transparent via-[var(--tm-gold)]/20 to-transparent opacity-0 transition group-hover:opacity-70"
      />
      <div className="space-y-4">
        <div className="relative h-40 w-full overflow-hidden rounded-[28px] border border-[var(--tm-gold)] bg-gradient-to-br from-[var(--tm-mauve)]/80 via-[var(--tm-deep-mauve)] to-[var(--tm-deep-mauve)]">
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-[var(--tm-ivory)]">
            <p className="text-sm font-semibold tracking-[0.4em]">Module Preview</p>
            <p className="text-xs uppercase tracking-[0.6em]">Coming Soon</p>
            <p className="text-[0.65rem] uppercase tracking-[0.35em]">Studio Vibes</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--tm-charcoal)]/25 via-transparent to-transparent" />
          <p className="absolute bottom-4 right-4 text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-ivory)]/80">
            {module.estimatedMinutes} min atelier
          </p>
        </div>
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
            {module.registryFocus}
          </p>
          <h3 className="tm-serif-title text-2xl leading-tight text-[var(--tm-deep-mauve)]">{module.title}</h3>
          <p className="text-sm text-[var(--tm-charcoal)]/70">{module.subtitle}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {moduleProgressSteps.map((step) => (
              <ProgressStars
                key={step.id}
                label={step.label}
                hideLabel
                completed={progress[step.id] === 'completed'}
                inProgress={progress[step.id] === 'in-progress'}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-[var(--tm-charcoal)]/70">
        <div className="rounded-full border border-[var(--tm-gold)] bg-[var(--tm-blush)]/30 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)]">
          Studio Vibes
        </div>
        <div className="relative h-24 w-24">
          <ModuleProgressRing percent={progressPercent} />
          <div className="absolute inset-0 flex items-center justify-center text-[0.65rem] font-semibold text-[var(--tm-deep-mauve)]">
            {progressPercent}%
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href={`/dashboard/learn/${module.id}`}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)] transition group-hover:text-[var(--tm-gold)]"
        >
          Enter module
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={handleAddAll}
          disabled={loading}
          className="rounded-full border border-[var(--tm-deep-mauve)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[var(--tm-deep-mauve)] disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Adding...
            </span>
          ) : (
            'Add all to registry'
          )}
        </button>
      </div>
      {feedback && <span className="mt-3 text-xs text-[var(--tm-deep-mauve)]/80">{feedback}</span>}
    </motion.article>
  );
};

export default ModuleCardEditorial;
