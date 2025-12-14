"use client";

export type MentorTaskItem = {
  id: string;
  type: string;
  title: string;
  member: string;
  due: string;
};

type MentorTaskBoardProps = {
  tasks: MentorTaskItem[];
};

export default function MentorTaskBoard({ tasks }: MentorTaskBoardProps) {
  if (!tasks.length) {
    return <p className="text-sm text-[#3E2F35]/60">All tasks are up to date.</p>;
  }

  return (
    <div className="mentor-task-board">
      {tasks.map((task) => (
        <article key={task.id} className="mentor-task-item">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
              {task.type}
            </p>
            <h3 className="mt-1 font-serif text-xl text-[#3E2F35]">{task.title}</h3>
            <p className="text-sm text-[#3E2F35]/70">
              {task.member} · Due {task.due}
            </p>
          </div>
          <div className="mentor-task-item__actions">
            <button type="button" className="mentor-task-item__action">
              Mark complete
            </button>
            <button type="button" className="mentor-task-item__action">
              View item
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
