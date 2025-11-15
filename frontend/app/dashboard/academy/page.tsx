'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Clock, Layers } from 'lucide-react';

import { api } from '@/lib/api';
import { academyModules } from '../learn/modules';

type ModuleProgress = {
  id: string;
  title: string;
  journey: string;
  estimatedTime: string;
  status: 'Not started' | 'In progress' | 'Complete';
};

const fallbackModules: ModuleProgress[] = academyModules.slice(0, 12).map((module, index) => ({
  id: module.id,
  title: module.title,
  journey: module.journey,
  estimatedTime: `${20 + index * 5} min`,
  status: index % 3 === 0 ? 'Complete' : index % 3 === 1 ? 'In progress' : 'Not started',
}));

export default function AcademyPage() {
  const [modules, setModules] = useState<ModuleProgress[]>(fallbackModules);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        await api.get('/api/academy/modules');
        // TODO: hydrate academy modules with backend data + progress
      } catch (error) {
        console.error('Academy modules placeholder error', error);
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.5em] text-tmMauve">All Academy Modules</p>
        <h1 className="text-4xl text-tmCharcoal">Every journey. Every ritual. All mapped out.</h1>
        <p className="mt-2 text-sm text-tmCharcoal/70">
          Browse the complete Taylor-Made Baby Academy collection and jump directly into the lesson you need today.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {modules.map((module) => (
          <div
            key={module.id}
            className="flex flex-col gap-4 rounded-2xl border border-tmBlush/40 bg-white/90 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-tmMauve">{module.journey}</p>
                <h2 className="text-xl text-tmCharcoal">{module.title}</h2>
              </div>
              <BookOpen className="h-6 w-6 text-tmMauve" />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-tmCharcoal/80">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-tmMauve" />
                {module.estimatedTime}
              </span>
              <span className="inline-flex items-center gap-2">
                <Layers className="h-4 w-4 text-tmMauve" />
                {module.status}
              </span>
            </div>
            <button className="inline-flex items-center justify-center rounded-full bg-tmMauve/10 px-4 py-2 text-sm font-semibold text-tmMauve">
              Resume Module
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-tmCharcoal/60">// TODO: add module progress + completion API hookup</p>
    </div>
  );
}
