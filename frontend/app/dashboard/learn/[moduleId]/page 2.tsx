'use client';

import { useEffect, useState } from 'react';

import { academyClient } from '@/lib/academyClient';
import { fallbackModules, type AcademyModule } from '../modules';
import ModuleHeroEditorial from '@/components/academy/ModuleHeroEditorial';
import ModuleTabs from '@/components/academy/ModuleTabs';
import ModuleRoadmap from '@/components/academy/ModuleRoadmap';
import ModuleSection from '@/components/academy/ModuleSection';

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  const { moduleId } = params;
  const [module, setModule] = useState<AcademyModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchModule = async () => {
      const data = await academyClient.getModule(moduleId);
      if (!mounted) return;
      setModule(data ? (data as AcademyModule) : null);
      setLoading(false);
    };

    fetchModule();

    return () => {
      mounted = false;
    };
  }, [moduleId]);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading module…</div>;
  }

  if (!module) {
    return (
      <div className="text-center py-20 text-gray-300">
        Module not found — check your invite path.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
      <aside>
        <ModuleRoadmap currentId={module.id} />
      </aside>

      <main className="space-y-10">
        <ModuleHeroEditorial module={module} />
        <ModuleSection>
          <ModuleTabs module={module} />
        </ModuleSection>
      </main>
    </div>
  );
}
