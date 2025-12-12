'use client';

import { useEffect, useState } from 'react';
import type { AcademyModule } from '../../app/dashboard/learn/modules';
import LectureCarousel from './LectureCarousel';
import { useEasterEgg } from '@/hooks/useEasterEgg';

type TabKey = 'explore' | 'lecture' | 'apply' | 'journal';

const deriveParagraphs = (value?: string | string[]) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split(/\n\s*\n/)
    .map((piece) => piece.trim())
    .filter(Boolean);
};

const collectListItems = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

type ModuleTabsProps = {
  module: AcademyModule;
};

export default function ModuleTabs({ module }: ModuleTabsProps) {
  const [tab, setTab] = useState<TabKey>('explore');
  const { trigger } = useEasterEgg();
  const content = module.content ?? {};
  const exploreCopy = deriveParagraphs(content.explore);
  const lectureSlides =
    content.lectureSlides?.length ? content.lectureSlides : deriveParagraphs(content.lecture);
  const applyList = collectListItems(content.apply);
  const journalPrompt = content.journalPrompt || 'Reflect on what you’ve learned.';

  useEffect(() => {
    trigger(`module-tabs:${module.id}`);
  }, [module.id, trigger]);

  const tabClasses = (key: TabKey) =>
    `px-4 py-2 rounded-t-lg cursor-pointer ${
      tab === key ? 'bg-white text-rose-700 font-semibold' : 'text-gray-500 hover:text-rose-700'
    }`;

  return (
    <div className="w-full">
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <div className={tabClasses('explore')} onClick={() => setTab('explore')}>
          Explore
        </div>
        <div className={tabClasses('lecture')} onClick={() => setTab('lecture')}>
          Lecture
        </div>
        <div className={tabClasses('apply')} onClick={() => setTab('apply')}>
          Apply
        </div>
        <div className={tabClasses('journal')} onClick={() => setTab('journal')}>
          Journal
        </div>
      </div>

      {tab === 'explore' && (
        <div className="space-y-3">
          {exploreCopy.map((paragraph, index) => (
            <p key={index} className="text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {tab === 'lecture' && <LectureCarousel slides={lectureSlides} />}

      {tab === 'apply' && (
        <ul className="list-disc pl-6 space-y-2 text-gray-800">
          {applyList.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      {tab === 'journal' && (
        <div className="p-6 bg-rose-50 rounded-xl shadow-inner text-gray-800">
          <p className="font-medium mb-4">{journalPrompt}</p>
        </div>
      )}
    </div>
  );
}
