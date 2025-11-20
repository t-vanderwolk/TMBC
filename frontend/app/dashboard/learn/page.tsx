'use client';

import { useEffect, useMemo, useState } from 'react';

import { api } from '@/lib/api';
import EditorialHero from '@/components/academy/EditorialHero';
import JourneyTabsEditorial from '@/components/academy/JourneyTabsEditorial';
import ModuleCardEditorial from '@/components/academy/ModuleCardEditorial';

import { academyModules, JourneyId, modulesByJourney } from './modules';

const journeys: JourneyId[] = ['nursery', 'gear', 'postpartum'];

const LearnOverviewPage = () => {
  const [recommendedModule, setRecommendedModule] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchRecommended = async () => {
      try {
        const response = await api.get('/api/academy/recommended');
        if (!mounted) return;
        setRecommendedModule(response.data?.title ?? null);
      } catch (error) {
        console.error('Unable to fetch recommended module', error);
      }
    };

    fetchRecommended();

    return () => {
      mounted = false;
    };
  }, []);

  const heroHighlight = useMemo(() => {
    return recommendedModule
      ? `Next studio unlocking: ${recommendedModule}`
      : 'Curated lessons drop every Friday at 7am.';
  }, [recommendedModule]);

  return (
    <div className="space-y-12">
      <EditorialHero
        eyebrow="Taylor-Made Baby Academy"
        title="Boutique warm editorial learning"
        description="Concierge education for the intentional family, choreographing every module with soft textures, gold accents, and hands-on prompts."
        highlight={heroHighlight}
        ctaLabel="Explore the journeys"
        ctaHref="#journeys"
        featuredModule={recommendedModule ?? 'Studio signal'}
      />

      <div id="journeys">
        <JourneyTabsEditorial journeys={journeys} modulesByJourney={modulesByJourney} />
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        {academyModules.map((module) => (
          <ModuleCardEditorial key={module.id} module={module} />
        ))}
      </section>
    </div>
  );
};

export default LearnOverviewPage;
