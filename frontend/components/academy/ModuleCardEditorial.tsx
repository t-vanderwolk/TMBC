'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

import { api } from '@/lib/api';
import type { AcademyModule } from '../../app/dashboard/learn/modules';

type ModuleCardEditorialProps = {
  module: AcademyModule;
};

const ModuleCardEditorial = ({ module }: ModuleCardEditorialProps) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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
    <article
      className="tm-editorial-card tm-editorial-shadow group flex h-full flex-col justify-between overflow-hidden text-left transition hover:-translate-y-1"
      style={{ borderColor: module.accentColor }}
    >
      <div className="space-y-4">
        <div className="relative h-40 w-full overflow-hidden rounded-[28px] bg-[var(--tm-ivory)]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${module.heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--tm-charcoal)]/40 via-transparent to-transparent" />
          <p className="absolute bottom-3 right-4 text-[0.65rem] uppercase tracking-[0.4em] text-white">
            {module.estimatedMinutes} min atelier
          </p>
        </div>
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
            {module.registryFocus}
          </p>
          <h3 className="tm-serif-title text-2xl leading-tight text-[var(--tm-deep-mauve)]">{module.title}</h3>
          <p className="text-sm text-[var(--tm-charcoal)]/70">{module.subtitle}</p>
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
              Adding…
            </span>
          ) : (
            'Add all to registry'
          )}
        </button>
      </div>
      {feedback && <span className="mt-3 text-xs text-[var(--tm-deep-mauve)]/80">{feedback}</span>}
    </article>
  );
};

export default ModuleCardEditorial;
