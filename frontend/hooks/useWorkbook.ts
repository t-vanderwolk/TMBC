'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

const workbookTypes = ['journal', 'moodboard', 'checklist', 'reflection'] as const;

export type WorkbookEntrySectionType = (typeof workbookTypes)[number];
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type MoodboardTile = {
  id: string;
  imageUrl: string;
  caption: string;
  size: 'small' | 'medium' | 'large';
  link?: string;
  sourceBrand?: string;
};

export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

type WorkbookEntryRecord = {
  id: string;
  moduleId: string;
  type: WorkbookEntrySectionType;
  content: unknown;
  createdAt: string;
  updatedAt: string;
};

type UseWorkbookOptions = {
  moduleId: string;
  checklistSeed?: string[];
  moodboardSeed?: Omit<MoodboardTile, 'id'>[];
};

type MoodboardModuleSeed = {
  heroImage?: string | null;
  subtitle: string;
};

export const getDefaultMoodboardPack = (module: MoodboardModuleSeed): Omit<MoodboardTile, 'id'>[] => [
  { imageUrl: '/academy/palette/mauve.jpg', caption: 'Soft mauve', size: 'small' },
  { imageUrl: '/academy/palette/blush.jpg', caption: 'Blush warmth', size: 'small' },
  { imageUrl: '/academy/palette/ivory.jpg', caption: 'Calm ivory', size: 'small' },
  { imageUrl: '/academy/textures/linen.jpg', caption: 'Linen texture', size: 'medium' },
  { imageUrl: '/academy/textures/boucle.jpg', caption: 'Bouclé softness', size: 'medium' },
  {
    imageUrl: module.heroImage ?? '/academy/palette/ivory.jpg',
    caption: module.subtitle,
    size: 'large',
  },
];

//
// Helpers
//
const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 12);

const createEmptyRecord = () =>
  workbookTypes.reduce<Record<WorkbookEntrySectionType, WorkbookEntryRecord | null>>((acc, type) => {
    acc[type] = null;
    return acc;
  }, {} as Record<WorkbookEntrySectionType, WorkbookEntryRecord | null>);

const createStatusRecord = () =>
  workbookTypes.reduce<Record<WorkbookEntrySectionType, SaveStatus>>((acc, type) => {
    acc[type] = 'idle';
    return acc;
  }, {} as Record<WorkbookEntrySectionType, SaveStatus>);

const createChecklistFromSeed = (seed: string[]) =>
  seed.map<ChecklistItem>((text) => ({ id: createId(), text, completed: false }));

const createMoodboardFromSeed = (seed: Omit<MoodboardTile, 'id'>[]) =>
  seed.map((tile) => ({ ...tile, id: createId() }));

const stringifyContent = (x: unknown) => JSON.stringify(x ?? null);

//
// Hook
//
export const useWorkbook = ({ moduleId, checklistSeed = [], moodboardSeed = [] }: UseWorkbookOptions) => {
  const [entries, setEntries] = useState(createEmptyRecord);
  const entriesRef = useRef(entries);

  const [journalText, setJournalText] = useState('');
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [moodboardTiles, setMoodboardTiles] = useState<MoodboardTile[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusRef = useRef(createStatusRecord());
  const [status, setStatus] = useState(createStatusRecord);

  const lastSavedRef = useRef<Record<WorkbookEntrySectionType, string>>(
    workbookTypes.reduce((acc, t) => {
      acc[t] = 'null';
      return acc;
    }, {} as Record<WorkbookEntrySectionType, string>),
  );

  const timersRef = useRef<Record<WorkbookEntrySectionType, NodeJS.Timeout | null>>(
    workbookTypes.reduce((acc, t) => {
      acc[t] = null;
      return acc;
    }, {} as Record<WorkbookEntrySectionType, NodeJS.Timeout | null>),
  );

  //
  // Utility
  //
  const updateStatus = (type: WorkbookEntrySectionType, value: SaveStatus) => {
    statusRef.current[type] = value;
    setStatus((prev) => ({ ...prev, [type]: value }));
  };

  const resetTimers = useCallback(() => {
    workbookTypes.forEach((type) => {
      const t = timersRef.current[type];
      if (t) clearTimeout(t);
      timersRef.current[type] = null;
    });
  }, []);

  //
  // Save entry to backend
  //
  const persistEntry = useCallback(
    async (type: WorkbookEntrySectionType, content: unknown) => {
      if (!moduleId) return;

      updateStatus(type, 'saving');

      try {
        const existing = entriesRef.current[type];
        const res = existing
          ? await api.patch(`/api/workbook/update/${existing.id}`, { content })
          : await api.post('/api/workbook/create', { moduleId, type, content });

        setEntries((prev) => ({ ...prev, [type]: res.data }));
        lastSavedRef.current[type] = stringifyContent(content);
        updateStatus(type, 'saved');
      } catch (err: any) {
        updateStatus(type, 'error');
        setError(err?.response?.data?.error || err?.message || 'Unable to save workbook section');
      }
    },
    [moduleId],
  );

  //
  // Debounced autosave
  //
  const scheduleSave = useCallback(
    (type: WorkbookEntrySectionType, payload: unknown) => {
      if (!ready) return;

      const serialized = stringifyContent(payload);
      if (lastSavedRef.current[type] === serialized) return;

      const timer = timersRef.current[type];
      if (timer) clearTimeout(timer);

      timersRef.current[type] = setTimeout(() => {
        persistEntry(type, payload);
      }, 850);
    },
    [persistEntry, ready],
  );

  //
  // Load entries (FIXED dependency array — no infinite loop)
  //
  useEffect(() => {
    let mounted = true;
    if (!moduleId) return;

    resetTimers();
    setReady(false);
    setError(null);

    const load = async () => {
      try {
        const res = await api.get(`/api/workbook/list?moduleId=${encodeURIComponent(moduleId)}`);
        if (!mounted) return;

        const raw: WorkbookEntryRecord[] = res.data?.entries ?? [];
        const map = createEmptyRecord();

        raw.forEach((entry) => {
          map[entry.type] = entry;
        });

        setEntries(map);
        entriesRef.current = map;

        workbookTypes.forEach((t) => {
          lastSavedRef.current[t] = map[t] ? stringifyContent(map[t]!.content) : 'null';
        });

        // journal
        const journalContent = map.journal?.content as { text?: string } | undefined;
        setJournalText(journalContent?.text ?? '');

        // reflection
        const reflectionContent = map.reflection?.content as { notes?: string } | undefined;
        setReflectionNotes(reflectionContent?.notes ?? '');

        // moodboard
        const moodboardContent = map.moodboard?.content as { tiles?: MoodboardTile[] } | undefined;
        if (map.moodboard) {
          setMoodboardTiles(moodboardContent?.tiles ?? []);
        } else {
          setMoodboardTiles(moodboardSeed.length ? createMoodboardFromSeed(moodboardSeed) : []);
        }

        // checklist
        const checklistContent = map.checklist?.content as { items?: ChecklistItem[] } | undefined;
        if (map.checklist) {
          setChecklistItems(checklistContent?.items ?? []);
        } else {
          setChecklistItems(checklistSeed.length ? createChecklistFromSeed(checklistSeed) : []);
        }

        const fresh = createStatusRecord();
        statusRef.current = fresh;
        setStatus(fresh);

        setReady(true);
      } catch (err: any) {
        if (mounted) {
          setError(err?.response?.data?.error || err?.message || 'Unable to load workbook');
        }
      }
    };

    load();

    return () => {
      mounted = false;
      resetTimers();
    };
    // ONLY triggers when moduleId changes (fixes your infinite loop)
  }, [moduleId, resetTimers]);

  //
  // Autosave watchers
  //
  useEffect(() => {
    scheduleSave('journal', { text: journalText });
  }, [journalText, scheduleSave]);

  useEffect(() => {
    scheduleSave('reflection', { notes: reflectionNotes });
  }, [reflectionNotes, scheduleSave]);

  useEffect(() => {
    scheduleSave('moodboard', { tiles: moodboardTiles });
  }, [moodboardTiles, scheduleSave]);

  useEffect(() => {
    scheduleSave('checklist', { items: checklistItems });
  }, [checklistItems, scheduleSave]);

  //
  // Public API
  //
  const addChecklistItem = (text: string) => {
    setChecklistItems((prev) => [...prev, { id: createId(), text, completed: false }]);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i)),
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addMoodboardTile = (tile: Omit<MoodboardTile, 'id'>) => {
    setMoodboardTiles((prev) => [...prev, { ...tile, id: createId() }]);
  };

  const updateMoodboardTile = (id: string, updates: Partial<MoodboardTile>) => {
    setMoodboardTiles((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const reorderMoodboardTiles = (sourceId: string, targetId: string) => {
    setMoodboardTiles((prev) => {
      const s = prev.findIndex((t) => t.id === sourceId);
      const t = prev.findIndex((t) => t.id === targetId);
      if (s === -1 || t === -1) return prev;

      const arr = [...prev];
      const [moved] = arr.splice(s, 1);
      arr.splice(t, 0, moved);
      return arr;
    });
  };

  return {
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
    setChecklistItems,
  };
};
