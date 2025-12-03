import Link from 'next/link';
import { academyModules } from '../../app/dashboard/learn/modules';

type ModuleRoadmapProps = {
  currentId?: string;
};

export default function ModuleRoadmap({ currentId }: ModuleRoadmapProps) {
  return (
    <nav className="space-y-3 sticky top-24">
      <h4 className="text-xs uppercase tracking-wide text-gray-500">Module Roadmap</h4>
      {academyModules
        .filter((mod) => typeof mod?.id === 'string' && mod.id.length)
        .map((mod) => (
        <Link
          key={mod.id}
          href={`/dashboard/learn/${mod.id}`}
          className={`block text-sm p-3 rounded-lg ${
            currentId === mod.id
              ? 'bg-rose-100 text-rose-700 font-semibold'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          {mod.title}
        </Link>
      ))}
    </nav>
  );
}
