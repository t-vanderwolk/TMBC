'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { academyClient } from '@/lib/academyClient';
import { fallbackModules, groupModulesByJourney, JourneyId, normalizeApiModule } from './modules';
import ModuleCardEditorial from '@/components/academy/ModuleCardEditorial';
import JourneyTabsEditorial from '@/components/academy/JourneyTabsEditorial';
import EditorialHero from '@/components/academy/EditorialHero';

const journeys: JourneyId[] = ['nursery', 'gear', 'postpartum'];

export default function LearnOverviewPage() {
  const [recommended, setRecommended] = useState<string | null>(null);
  const [modules, setModules] = useState(fallbackModules);
  const [loading, setLoading] = useState(true);
  const [lastVisited, setLastVisited] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        const [allModules, recommendedTitle] = await Promise.all([
          academyClient.listModules(),
          academyClient.getRecommended(),
        ]);

        if (!mounted) {
          return;
        }

        if (allModules?.length) {
          setModules(allModules.map(normalizeApiModule));
        }

        setRecommended(recommendedTitle);
      } catch (error) {
        console.error('Unable to load academy modules', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAll();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('tmbc:last-module');
    if (stored) {
      setLastVisited(stored);
    }
  }, []);

  const modulesByJourney = groupModulesByJourney(modules);
  const continueModule = useMemo(
    () => modules.find((module) => module.id === lastVisited) ?? null,
    [lastVisited, modules],
  );

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading curated studios...</div>;
  }

  return (
    <div className="space-y-16">
      <EditorialHero
        eyebrow="Taylor-Made Baby Academy"
        title="Boutique learning for the intentional parent"
        description="Curated lessons, soft textures, and concierge-level guidance."
        highlight={recommended ?? 'New modules drop every Friday at 7am'}
        ctaLabel="Explore the journeys"
        ctaHref="/dashboard/learn"
        featuredModule={recommended ?? 'Studio signal'}
      />

      {continueModule && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[35px] border border-[var(--tm-gold)] bg-gradient-to-br from-[var(--tm-ivory)] to-[var(--tm-blush)]/60 p-6 shadow-editorial"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-white/60 to-transparent" />
          <div className="pointer-events-none absolute top-0 right-6 h-24 w-24 rounded-full bg-[var(--tm-gold)]/40 blur-3xl" />
          <div className="relative space-y-3">
            <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[var(--tm-mauve)]">
              Continue where you left off
            </p>
            <h3 className="tm-serif-title text-3xl leading-snug text-[var(--tm-deep-mauve)]">
              {continueModule.title}
            </h3>
            <p className="text-sm text-[var(--tm-charcoal)]/80">{continueModule.subtitle}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--tm-deep-mauve)] bg-white/70 px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)]">
                Studio {continueModule.order}
              </span>
              <span className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-gold)]">
                {continueModule.estimatedMinutes} min atelier
              </span>
            </div>
            <Link
              href={`/dashboard/learn/${continueModule.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--tm-deep-mauve)] bg-white/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--tm-deep-mauve)] transition hover:border-[var(--tm-gold)] hover:text-[var(--tm-gold)]"
            >
              Return to studio
              <span aria-hidden className="text-[var(--tm-gold)]">
                →
              </span>
            </Link>
          </div>
        </motion.section>
      )}

      <JourneyTabsEditorial journeys={journeys} modulesByJourney={modulesByJourney} />

      <section className="grid gap-6 lg:grid-cols-3">
        {modules.map((module) => (
          <ModuleCardEditorial key={module.id} module={module} />
        ))}
      </section>
    </div>
  );
}
