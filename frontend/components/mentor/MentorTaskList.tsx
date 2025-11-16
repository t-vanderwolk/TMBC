'use client';

import { useState } from 'react';
import { CheckCircle2, ClipboardList } from 'lucide-react';

import { api } from '@/lib/api';
import type { MentorTask } from '@/types/mentor';

type MentorTaskListProps = {
  tasks: MentorTask[];
  compact?: boolean;
};

const MentorTaskList = ({ tasks, compact }: MentorTaskListProps) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  const handleComplete = async (taskId: string) => {
    try {
      setLocalTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task)));
      await api.post(`/api/mentor/tasks/${taskId}/complete`);
      // TODO: connect optimistic update w/ SWR cache or React Query
    } catch (error) {
      console.error('Task completion placeholder error', error);
    }
  };

  if (!localTasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-tmBlush/40 bg-white/80 p-4 text-sm text-tmCharcoal/70">
        <p className="font-semibold text-tmCharcoal">No mentor tasks yet</p>
        <p className="text-xs text-tmCharcoal/60">// TODO: Connect to mentorCollab tasks feed</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {localTasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-tmBlush/30 bg-white/90 p-4 shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-tmMauve">
              <ClipboardList className="h-4 w-4 text-tmMauve" />
              {task.type.replace(/_/g, ' ')}
            </div>
            <p className="text-base font-semibold text-tmCharcoal">{task.title}</p>
            {!compact && (
              <p className="text-sm text-tmCharcoal/70">
                {task.description || '// TODO: Surface contextual description'}
              </p>
            )}
          </div>
          <button
            onClick={() => handleComplete(task.id)}
            disabled={task.completed}
            className="inline-flex items-center gap-2 rounded-full border border-tmMauve px-4 py-2 text-sm font-semibold text-tmMauve disabled:opacity-60"
          >
            <CheckCircle2 className="h-4 w-4" />
            {task.completed ? 'Completed' : 'Mark complete'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default MentorTaskList;
