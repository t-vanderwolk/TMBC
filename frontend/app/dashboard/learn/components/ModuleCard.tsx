'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';

import { api } from '@/lib/api';
import type { AcademyModule } from '../modules';

type ModuleCardProps = {
  module: AcademyModule;
};

const ModuleCard = ({ module }: ModuleCardProps) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddAll = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setFeedback(null);
      const recommended = await api.get(`/api/academy/module/${module.id}/recommended`);
      const products = (recommended.data?.products ?? []) as { id: string }[];
      if (!products.length) {
        setFeedback('No recommended items yet.');
        return;
      }

      await api.post('/api/registry/bulk/add', {
        productIds: products.map((product) => product.id),
      });
      setFeedback('Added to your registry.');
      setTimeout(() => setFeedback(null), 2000);
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Unable to add items.';
      setFeedback(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-white/70 bg-gradient-to-br from-white via-tmIvory to-tmBlush/40 p-5 text-left shadow-soft">
      <div className="space-y-2">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-tmMauve">
          {module.track}
        </p>
        <h4 className="text-xl font-semibold text-tmCharcoal">{module.title}</h4>
        <p className="text-sm text-tmCharcoal/80">{module.description}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={`/dashboard/learn/${module.id}`}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-tmMauve"
        >
          Enter module
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
        <button
          onClick={handleAddAll}
          disabled={loading}
          className="rounded-full border border-tmMauve/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-tmMauve disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Adding…
            </span>
          ) : (
            'Add All to Registry'
          )}
        </button>
        {feedback && <span className="text-xs text-tmCharcoal/70">{feedback}</span>}
      </div>
    </div>
  );
};

export default ModuleCard;
