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

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
};

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

const stringifyContent = (payload: unknown) => JSON.stringify(payload ?? null);

export const useWorkbook = ({ moduleId, checklistSeed = [], moodboardSeed = [] }: UseWorkbookOptions) => {
  const [entries, setEntries] = useState(createEmptyRecord);
  const entriesRef = useRef(entries);
  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  const statusRef = useRef<Record<WorkbookEntrySectionType, SaveStatus>>(createStatusRecord());
  const [status, setStatus] = useState<Record<WorkbookEntrySectionType, SaveStatus>>(createStatusRecord);
  const lastSavedRef = useRef<Record<WorkbookEntrySectionType, string>>(
    workbookTypes.reduce((acc, type) => {
      acc[type] = 'null';
      return acc;
    }, {} as Record<WorkbookEntrySectionType, string>),
  );
  const timersRef = useRef<Record<WorkbookEntrySectionType, ReturnType<typeof setTimeout> | null>>(
    workbookTypes.reduce((acc, type) => {
      acc[type] = null;
      return acc;
    }, {} as Record<WorkbookEntrySectionType, ReturnType<typeof setTimeout> | null>),
  );

  const [journalText, setJournalText] = useState('');
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [moodboardTiles, setMoodboardTiles] = useState<MoodboardTile[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetTimers = useCallback(() => {
    workbookTypes.forEach((type) => {
      const timer = timersRef.current[type];
      if (timer) {
        clearTimeout(timer);
      }
      timersRef.current[type] = null;
    });
  }, []);

  const updateStatus = (type: WorkbookEntrySectionType, value: SaveStatus) => {
    statusRef.current[type] = value;
    setStatus((prev) => ({ ...prev, [type]: value }));
  };

  const persistEntry = useCallback(
    async (type: WorkbookEntrySectionType, content: unknown) => {
      if (!moduleId) return;
      updateStatus(type, 'saving');
      try {
        const existing = entriesRef.current[type];
        const response = existing
          ? await api.patch(`/api/workbook/update/${existing.id}`, { content })
          : await api.post('/api/workbook/create', { moduleId, type, content });
        setEntries((prev) => ({ ...prev, [type]: response.data }));
        lastSavedRef.current[type] = stringifyContent(content);
        updateStatus(type, 'saved');
      } catch (err: any) {
        updateStatus(type, 'error');
        setError(err?.response?.data?.error || err?.message || 'Unable to save workbook section');
      }
    },
    [moduleId],
  );

  useEffect(() => {
    let active = true;
    if (!moduleId) return () => undefined;
    resetTimers();
    setReady(false);
    setError(null);
    const fetchEntries = async () => {
      try {
        const response = await api.get(`/api/workbook/list?moduleId=${encodeURIComponent(moduleId)}`);
        if (!active) return;
        const rawEntries: WorkbookEntryRecord[] = response.data?.entries ?? [];
        const map = createEmptyRecord();
        rawEntries.forEach((entry) => {
          map[entry.type] = entry;
        });
        setEntries(map);
        workbookTypes.forEach((type) => {
          lastSavedRef.current[type] = map[type] ? stringifyContent(map[type]!.content) : 'null';
        });
        const freshStatus = createStatusRecord();
        setStatus(freshStatus);
        statusRef.current = freshStatus;

        if (map.journal) {
          setJournalText((map.journal.content as { text?: string }).text ?? '');
        } else {
          setJournalText('');
        }

        if (map.reflection) {
          setReflectionNotes((map.reflection.content as { notes?: string }).notes ?? '');
        } else {
          setReflectionNotes('');
        }

        if (map.moodboard) {
          setMoodboardTiles((map.moodboard.content as { tiles?: MoodboardTile[] }).tiles ?? []);
        } else if (moodboardSeed.length) {
          setMoodboardTiles(createMoodboardFromSeed(moodboardSeed));
        } else {
          setMoodboardTiles([]);
        }

        if (map.checklist) {
          setChecklistItems((map.checklist.content as { items?: ChecklistItem[] }).items ?? []);
        } else if (checklistSeed.length) {
          setChecklistItems(createChecklistFromSeed(checklistSeed));
        } else {
          setChecklistItems([]);
        }

        setReady(true);
      } catch (err: any) {
        if (active) {
          setError(err?.response?.data?.error || err?.message || 'Unable to load workbook');
        }
      }
    };

    fetchEntries();

    return () => {
      active = false;
      resetTimers();
    };
  }, [moduleId, checklistSeed, moodboardSeed, persistEntry, resetTimers]);

  const scheduleSave = useCallback(
    (type: WorkbookEntrySectionType, payload: unknown) => {
      const serialized = stringifyContent(payload);
      if (lastSavedRef.current[type] === serialized || !ready) {
        return;
      }
      const timer = timersRef.current[type];
      if (timer) {
        clearTimeout(timer);
      }
      timersRef.current[type] = setTimeout(() => persistEntry(type, payload), 950);
    },
    [persistEntry, ready],
  );

  useEffect(() => {
    scheduleSave('journal', { text: journalText });
  }, [journalText, ready, scheduleSave]);

  useEffect(() => {
    scheduleSave('reflection', { notes: reflectionNotes });
  }, [reflectionNotes, ready, scheduleSave]);

  useEffect(() => {
    scheduleSave('moodboard', { tiles: moodboardTiles });
  }, [moodboardTiles, ready, scheduleSave]);

  useEffect(() => {
    scheduleSave('checklist', { items: checklistItems });
  }, [checklistItems, ready, scheduleSave]);

  useEffect(() => {
    return () => {
      resetTimers();
    };
  }, [resetTimers]);

  const addChecklistItem = (text: string) => {
    setChecklistItems((prev) => [...prev, { id: createId(), text, completed: false }]);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addMoodboardTile = (tile: Omit<MoodboardTile, 'id'>) => {
    setMoodboardTiles((prev) => [...prev, { ...tile, id: createId() }]);
  };

  const updateMoodboardTile = (id: string, updates: Partial<MoodboardTile>) => {
    setMoodboardTiles((prev) => prev.map((tile) => (tile.id === id ? { ...tile, ...updates } : tile)));
  };

  const reorderMoodboardTiles = (sourceId: string, targetId: string) => {
    setMoodboardTiles((prev) => {
      const sourceIndex = prev.findIndex((tile) => tile.id === sourceId);
      const targetIndex = prev.findIndex((tile) => tile.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) {
        return prev;
      }
      const updated = [...prev];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
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
  };
};
