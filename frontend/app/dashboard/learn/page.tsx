'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Baby, Book, Heart } from 'lucide-react';

import { api } from '@/lib/api';

import ModuleCard from './components/ModuleCard';
import {
  academyModules,
  journeyMeta,
  JourneyId,
  modulesByJourney,
  type AcademyModule,
} from './modules';

const journeys: JourneyId[] = ['nursery', 'gear', 'postpartum'];

const LearnOverviewPage = () => {
  const [recommended, setRecommended] = useState(academyModules[0]?.title || 'Taylor-Made Academy Module');

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        await api.get('/api/academy/recommended');
        // TODO: Pull recommended next lesson for the member from backend
      } catch (error) {
        console.error('Recommended module placeholder error', error);
      }
    };

    fetchRecommended();
  }, []);

  return (
    <section id="learn" className="space-y-10 px-6 py-10 md:px-10">
      <div className="rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-tmIvory to-tmBlush/50 p-8 shadow-soft">
        <p className="font-script text-3xl text-tmMauve">Taylor-Made</p>
        <p className="font-serif text-xs uppercase tracking-[0.6em] text-tmCharcoal">
          Baby Academy
        </p>
        <h1 className="mt-4 text-4xl text-tmCharcoal">
          Choose your journey, follow the tracks, stay concierge calm.
        </h1>
        <p className="mt-3 text-base text-tmCharcoal/80">
          Each track unlocks high-touch lessons, Playfair-styled workbooks, and
          reflection prompts to prepare you for every milestone. Start where you
          are, and revisit whenever you need a refresher.
        </p>
        <div className="mt-6 rounded-2xl border border-tmMauve/30 bg-white/80 p-4 text-sm text-tmCharcoal/80">
          <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">Your next lesson</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-lg font-semibold text-tmCharcoal">{recommended}</span>
            <Link
              href="/dashboard/learn#journey-nursery"
              className="inline-flex items-center gap-2 text-sm font-semibold text-tmMauve"
            >
              Jump into Learn
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-2 text-xs text-tmCharcoal/60">// TODO: surface personalized recommendation from API</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {journeys.map((journey) => {
          const meta = journeyMeta[journey];
          const icon =
            journey === 'nursery' ? Baby : journey === 'gear' ? Book : Heart;
          const Icon = icon;
          return (
            <Link
              key={journey}
              href={`#journey-${journey}`}
              className="rounded-[28px] border border-tmBlush/40 bg-white/90 p-6 shadow-soft transition hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-8 w-8 text-tmMauve" />
                <div>
                  <p className="text-xs uppercase tracking-[0.6em] text-tmMauve">
                    {meta.label}
                  </p>
                  <h3 className="text-2xl text-tmCharcoal">
                    {journey === 'nursery'
                      ? 'Design the sanctuary'
                      : journey === 'gear'
                      ? 'Master the gear'
                      : 'Protect the postpartum'}
                  </h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-tmCharcoal/80">
                {meta.description}
              </p>
            </Link>
          );
        })}
      </div>

      {journeys.map((journey) => {
        const meta = journeyMeta[journey];
        return (
          <div
            key={journey}
            id={`journey-${journey}`}
            className="space-y-6 rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-soft lg:p-10"
          >
            <div className="space-y-2">
              <p className="text-[0.65rem] uppercase tracking-[0.6em] text-tmMauve">
                {meta.label}
              </p>
              <h2 className="text-3xl text-tmCharcoal">{meta.description}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {modulesByJourney[journey].map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default LearnOverviewPage;
