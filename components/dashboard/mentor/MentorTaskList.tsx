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
      await api.post(`/mentor/tasks/${taskId}/complete`);
      // INTENTIONAL: Keep optimistic UI without a cache layer until mentorCollab endpoints stabilize.
    } catch (error) {
      console.error('Task completion placeholder error', error);
    }
  };

  if (!localTasks.length) {
    return (
      <div className="rounded-2xl border border-member-border-soft bg-member-background-soft p-4 text-sm text-member-text-secondary">
        <p className="font-semibold text-member-text-primary">No mentor tasks yet</p>
        <p className="mt-1 text-xs text-member-text-secondary">
          This section will populate as mentee work requests come in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {localTasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-member-border-soft bg-member-background-card p-4 shadow-sm"
        >
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-member-accent-secondary">
              <ClipboardList className="h-4 w-4 text-member-accent-primary" />
              {task.type.replace(/_/g, " ")}
            </div>
            <p className="text-base font-semibold text-member-text-primary">{task.title}</p>
            {!compact && (
              <p className="text-sm text-member-text-secondary">
                {task.description || "No additional details for this task yet."}
              </p>
            )}
          </div>
          <button
            onClick={() => handleComplete(task.id)}
            disabled={task.completed}
            className="inline-flex items-center gap-2 rounded-full border border-member-accent-secondary bg-member-background-card px-4 py-2 text-sm font-semibold text-member-accent-primary disabled:border-member-state-disabled disabled:text-member-text-muted disabled:bg-member-background-soft"
          >
            <CheckCircle2 className="h-4 w-4" />
            {task.completed ? "Completed" : "Mark complete"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default MentorTaskList;
