'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { AcademyModule } from '../../app/dashboard/learn/modules';
import { useEncouragementBubble } from '@/components/academy/EncouragementBubble';
import { useModuleProgress } from '@/hooks/useModuleProgress';
import { usePinterest } from '../../hooks/usePinterest';
import { getDefaultMoodboardPack, useWorkbook, type MoodboardTile as MoodboardTileData } from '../../hooks/useWorkbook';
import WorkbookChecklist from './WorkbookChecklist';
import WorkbookJournal from './WorkbookJournal';
import WorkbookMoodboard from './WorkbookMoodboard';
import WorkbookPrompt from './WorkbookPrompt';
import WorkbookReflection from './WorkbookReflection';
import WorkbookTemplates from './WorkbookTemplates';
import { generateWorkbookSuggestions } from '@/utils/workbookSuggest';
import { generatePinSuggestions } from '@/utils/pinSuggestions';

const babyFairyTips = [
  'Map a small ritual - light a candle, breathe for three counts, then speak your plan aloud. Soft intention warms every decision.',
  'Hold the moment between modules to exhale gently. Your energy shapes the nursery more than any checklist.',
  'Gently name the textures you crave. "Velvet hush," "dawn blush," or "bay breeze." Naming guides your choices when the studio starts to blur.',
  'Layer in a tiny celebratory bell or ribbon once you mark a step complete. The sound says "you did it" to your future self.',
];

type WorkbookEditorialProps = {
  module: AcademyModule;
};

const toParagraphString = (value?: string | string[]) =>
  Array.isArray(value) ? value.join('\n\n') : value ?? '';

const WorkbookEditorial = ({ module }: WorkbookEditorialProps) => {
  const moodboardSeed = getDefaultMoodboardPack(module);

  const checklistSeed = module.content.apply ?? [];
  const journalPrompt = toParagraphString(module.content.journalPrompt);
  const exploreCopy = toParagraphString(module.content.explore);
  const lectureCopy = module.content.lectureSlides?.length
    ? module.content.lectureSlides.join('\n\n')
    : toParagraphString(module.content.lecture);

  const {
    ready,
    error,
    status,
    journalText,
    setJournalText,
    reflectionNotes,
    setReflectionNotes,
    setChecklistItems,
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
    checklistSeed,
    moodboardSeed,
  });

  const pinterest = usePinterest();

  const suggestions = useMemo(
    () =>
      generateWorkbookSuggestions({
        journal: journalText,
        tiles: moodboardTiles,
        checklist: checklistItems,
      }),
    [journalText, moodboardTiles, checklistItems],
  );

  const pinSuggestions = useMemo(() => generatePinSuggestions(moodboardTiles), [moodboardTiles]);

  const prompts = useMemo(
    () => [
      { label: 'Journal prompt', text: journalPrompt },
      { label: 'Module whisper', text: exploreCopy },
      { label: 'Concierge note', text: lectureCopy.split('\n')[0] ?? lectureCopy },
    ],
    [exploreCopy, journalPrompt, lectureCopy],
  );

  const reflectionPrompts = useMemo(
    () => [
      journalPrompt,
      'Which textures do you want your space to feel like every day?',
      'What small gesture can you repeat each week to celebrate this progress?',
    ],
    [journalPrompt],
  );

  const { trigger } = useEncouragementBubble();
  const { markStep } = useModuleProgress(module.id);
  const [journalTouched, setJournalTouched] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fairySeed = useMemo(() => {
    const message =
      babyFairyTips[Math.floor(Math.random() * babyFairyTips.length)];
    return {
      message,
      show: Math.random() < 0.2,
    };
  }, []);
  const [ribbonSparkle, setRibbonSparkle] = useState(false);
  const sparkleTimerRef = useRef<number | null>(null);
  const handleRibbonClick = useCallback(() => {
    setRibbonSparkle(true);
    if (sparkleTimerRef.current) {
      clearTimeout(sparkleTimerRef.current);
    }
    sparkleTimerRef.current = window.setTimeout(() => {
      setRibbonSparkle(false);
    }, 900);
  }, []);

  useEffect(() => {
    return () => {
      if (sparkleTimerRef.current) {
        clearTimeout(sparkleTimerRef.current);
      }
    };
  }, []);

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

  const handleJournalChange = useCallback(
    (value: string) => {
      if (!journalTouched && value.trim()) {
        setJournalTouched(true);
        trigger();
      }
      setJournalText(value);
    },
    [journalTouched, setJournalText, trigger],
  );

  const handleMoodboardAdd = useCallback(
    (tile: Omit<MoodboardTileData, 'id'>) => {
      addMoodboardTile(tile);
      trigger();
    },
    [addMoodboardTile, trigger],
  );

  const handleResizeMoodboardTile = useCallback(
    (id: string, size: MoodboardTileData['size']) => {
      updateMoodboardTile(id, { size });
    },
    [updateMoodboardTile],
  );

  const handleChecklistComplete = useCallback(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    if (!ready) return;
    const resetIdle = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = setTimeout(() => {
        trigger();
      }, 12000);
    };

    const events: Array<keyof DocumentEventMap> = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    const listeners = events.map((event) => {
      document.addEventListener(event, resetIdle);
      return () => document.removeEventListener(event, resetIdle);
    });

    resetIdle();
    return () => {
      listeners.forEach((remove) => remove());
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [ready, trigger]);

  useEffect(() => {
    if (status.journal === 'saved') {
      markStep('journal', 'completed');
    } else if (journalText.trim()) {
      markStep('journal', 'in-progress');
    }
  }, [journalText, status.journal, markStep]);

  useEffect(() => {
    if (status.moodboard === 'saved') {
      markStep('moodboard', 'completed');
    } else if (moodboardTiles.length) {
      markStep('moodboard', 'in-progress');
    }
  }, [moodboardTiles.length, status.moodboard, markStep]);

  useEffect(() => {
    if (status.checklist === 'saved') {
      markStep('checklist', 'completed');
    } else if (checklistItems.length) {
      markStep('checklist', 'in-progress');
    }
  }, [checklistItems.length, status.checklist, markStep]);

  useEffect(() => {
    if (status.reflection === 'saved') {
      markStep('reflection', 'completed');
    } else if (reflectionNotes.trim()) {
      markStep('reflection', 'in-progress');
    }
  }, [reflectionNotes, status.reflection, markStep]);

  const applyTemplate = useCallback(
    (template: { notes: string; checklist: string[] }) => {
      setReflectionNotes(template.notes);
      setChecklistItems(
        template.checklist.map((text) => ({
          id:
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `tmplate-${text.slice(0, 12)}-${Date.now()}`,
          text,
          completed: false,
        })),
      );
    },
    [setChecklistItems, setReflectionNotes],
  );

  return (
    <section className="space-y-10 relative">
      {error && (
        <div className="rounded-[28px] border border-[var(--tm-deep-mauve)] bg-white/90 px-6 py-4 text-sm text-[var(--tm-deep-mauve)]">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleRibbonClick}
        className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-full border border-[var(--tm-gold)] bg-white/80 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--tm-gold)] shadow-lg transition hover:scale-[1.02]"
      >
        <span>Gold ribbon</span>
        <motion.span
          className="relative h-2 w-2 rounded-full bg-[var(--tm-gold)]"
          animate={
            ribbonSparkle
              ? { scale: [0.6, 1.4, 1], opacity: [0.2, 1, 0] }
              : { opacity: 0 }
          }
          transition={{ duration: 0.8 }}
        />
      </button>
      <div className="space-y-6">
        <WorkbookTemplates onApply={applyTemplate} />
        <WorkbookPrompt prompts={prompts} />
        {suggestions.length > 0 && (
          <div className="rounded-3xl bg-[var(--tm-blush)]/50 p-6 mt-2 shadow-sm tm-fade-in">
            <h3 className="font-serif text-lg text-[var(--tm-deep-mauve)]">Taylor’s gentle suggestions</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--tm-deep-mauve)]">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="pl-4">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
        {fairySeed.show && (
          <div className="rounded-3xl border border-[var(--tm-gold)] bg-white/90 px-5 py-4 shadow-editorial">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[var(--tm-mauve)]">
              ✨ Baby Fairy has a tip for you...
            </p>
            <p className="mt-3 text-sm font-serif leading-relaxed text-[var(--tm-charcoal)]/80">
              {fairySeed.message}
            </p>
          </div>
        )}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <WorkbookJournal value={journalText} onChange={handleJournalChange} status={status.journal} disabled={!ready} />
        <div className="space-y-6">
          <WorkbookMoodboard
            tiles={moodboardTiles}
            status={status.moodboard}
            onAddTile={handleMoodboardAdd}
            onResizeTile={handleResizeMoodboardTile}
            onReorderTiles={reorderMoodboardTiles}
            onSavePin={handleTileSave}
            pinterest={pinterest}
          />
          {pinSuggestions.length > 0 && (
            <div className="rounded-3xl bg-[var(--tm-mauve)]/10 p-6 tm-fade-in">
              <h3 className="font-playfair text-lg text-[var(--tm-deep-mauve)]">
                Inspired by your pins …
              </h3>
              <ul className="space-y-2 mt-2 text-[var(--tm-deep-mauve)] text-sm">
                {pinSuggestions.map((suggestion, index) => (
                  <li key={index} className="pl-4">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <WorkbookChecklist
          items={checklistItems}
          onAdd={addChecklistItem}
          onToggle={toggleChecklistItem}
          onComplete={handleChecklistComplete}
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
