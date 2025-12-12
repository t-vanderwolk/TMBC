'use client';

import { useCallback, useEffect, useState } from 'react';

import { loadSession } from '@/lib/auth';
import type { WorkbookEntrySectionType } from '@/hooks/useWorkbook';

export type ModuleStep = WorkbookEntrySectionType;
export type StepStatus = 'not-started' | 'in-progress' | 'completed';

const moduleProgressSteps: { id: ModuleStep; label: string }[] = [
  { id: 'journal', label: 'Journal' },
  { id: 'moodboard', label: 'Moodboard' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'reflection', label: 'Reflection' },
];

const statusRank: Record<StepStatus, number> = {
  'not-started': 0,
  'in-progress': 1,
  completed: 2,
};

const getUserId = () => {
  const session = loadSession();
  return (
    session?.payload?.sub ??
    session?.payload?.id ??
    session?.payload?.email ??
    session?.payload?.name ??
    'guest'
  );
};

const buildProgressKey = (userId: string, moduleId: string, step: ModuleStep) =>
  `tmbc:progress:${userId}:${moduleId}:${step}`;

const readStatus = (userId: string, moduleId: string, step: ModuleStep): StepStatus => {
  if (typeof window === 'undefined') return 'not-started';
  const raw = window.localStorage.getItem(buildProgressKey(userId, moduleId, step));
  return raw === 'in-progress' || raw === 'completed' ? raw : 'not-started';
};

const createEmptyProgress = () =>
  moduleProgressSteps.reduce<Record<ModuleStep, StepStatus>>((acc, step) => {
    acc[step.id] = 'not-started';
    return acc;
  }, {} as Record<ModuleStep, StepStatus>);

export const useModuleProgress = (moduleId: string) => {
  const [userId, setUserId] = useState(getUserId);
  const [progress, setProgress] = useState(createEmptyProgress);

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  useEffect(() => {
    if (!moduleId) return;

    const hydrate = () => {
      const snapshot = createEmptyProgress();
      moduleProgressSteps.forEach((step) => {
        snapshot[step.id] = readStatus(userId, moduleId, step.id);
      });
      setProgress(snapshot);
    };

    hydrate();

    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (!event.key) return;
      const prefix = `tmbc:progress:${userId}:${moduleId}:`;
      if (!event.key.startsWith(prefix)) return;
      const stepId = event.key.split(':').pop() as ModuleStep;
      if (!moduleProgressSteps.some((step) => step.id === stepId)) return;
      setProgress((prev) => ({
        ...prev,
        [stepId]:
          event.newValue === 'completed' || event.newValue === 'in-progress'
            ? (event.newValue as StepStatus)
            : 'not-started',
      }));
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [moduleId, userId]);

  const markStep = useCallback(
    (step: ModuleStep, status: StepStatus) => {
      if (!moduleId) return;
      setProgress((prev) => {
        const current = prev[step];
        if (statusRank[status] < statusRank[current]) return prev;
        const next = { ...prev, [step]: status };
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(buildProgressKey(userId, moduleId, step), status);
        }
        return next;
      });
    },
    [moduleId, userId],
  );

  return {
    progress,
    markStep,
    moduleProgressSteps,
  };
};

export { moduleProgressSteps };
