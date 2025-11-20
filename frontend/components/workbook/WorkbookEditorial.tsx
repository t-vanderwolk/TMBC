'use client';

import { useMemo } from 'react';

import type { AcademyModule } from '@/app/dashboard/learn/modules';
import { usePinterest } from '../../hooks/usePinterest';
import { useWorkbook, type MoodboardTile as MoodboardTileData } from '../../hooks/useWorkbook';
import WorkbookChecklist from './WorkbookChecklist';
import WorkbookJournal from './WorkbookJournal';
import WorkbookMoodboard from './WorkbookMoodboard';
import WorkbookPrompt from './WorkbookPrompt';
import WorkbookReflection from './WorkbookReflection';

type WorkbookEditorialProps = {
  module: AcademyModule;
};

const WorkbookEditorial = ({ module }: WorkbookEditorialProps) => {
  const {
    ready,
    error,
    status,
    journalText,
    setJournalText,
    reflectionNotes,
    setReflectionNotes,
    moodboardTiles,
    addMoodboardTile,
    updateMoodboardTile,
    reorderMoodboardTiles,
    checklistItems,
    addChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
  } = useWorkbook({
    moduleId: module.id,
    checklistSeed: module.content.apply,
    moodboardSeed: [
      {
        imageUrl: module.heroImage,
        caption: module.subtitle,
        size: 'large',
      },
    ],
  });

  const pinterest = usePinterest();

  const prompts = useMemo(
    () => [
      { label: 'Journal prompt', text: module.content.journalPrompt },
      { label: 'Module whisper', text: module.content.explore },
      { label: 'Concierge note', text: module.content.lecture.split('\n')[0] ?? module.content.lecture },
    ],
    [module],
  );

  const reflectionPrompts = useMemo(
    () => [
      module.content.journalPrompt,
      'Which textures do you want your space to feel like every day?',
      'What small gesture can you repeat each week to celebrate this progress?',
    ],
    [module],
  );

  const handleTileSave = async (tile: MoodboardTileData) => {
    try {
      await pinterest.savePin({
        imageUrl: tile.imageUrl,
        note: tile.caption || module.subtitle,
        title: module.title,
        link: tile.link,
      });
    } catch {
      // silent
    }
  };

  return (
    <section className="space-y-10">
      {error && (
        <div className="rounded-[28px] border border-[var(--tm-deep-mauve)] bg-white/90 px-6 py-4 text-sm text-[var(--tm-deep-mauve)]">
          {error}
        </div>
      )}
      <WorkbookPrompt prompts={prompts} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <WorkbookJournal value={journalText} onChange={setJournalText} status={status.journal} disabled={!ready} />
        <WorkbookMoodboard
          tiles={moodboardTiles}
          status={status.moodboard}
          onAddTile={addMoodboardTile}
          onResizeTile={updateMoodboardTile}
          onReorderTiles={reorderMoodboardTiles}
          onSavePin={handleTileSave}
          pinterest={{
            status: pinterest.status,
            message: pinterest.message,
            summary: pinterest.summary,
            initiateAuth: pinterest.initiateAuth,
          }}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <WorkbookChecklist
          items={checklistItems}
          onAdd={addChecklistItem}
          onToggle={toggleChecklistItem}
          onRemove={removeChecklistItem}
          status={status.checklist}
        />
        <WorkbookReflection
          value={reflectionNotes}
          onChange={setReflectionNotes}
          prompts={reflectionPrompts}
          status={status.reflection}
        />
      </div>
    </section>
  );
};

export default WorkbookEditorial;
