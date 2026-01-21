"use client";

import StatusBadge from "./StatusBadge";
import { usePlanContext } from "../PlanContext";

export default function LearnPanel() {
  const { learn, meta } = usePlanContext();
  const headerTitle = meta.canReview ? "Member context" : "Decision studio";
  const headerCopy = meta.canReview
    ? "Anchor a calm, supportive narrative for every decision."
    : "Keep your next move soft and well-informed.";

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Learn</p>
        <h3 className="text-lg font-semibold text-[#3E2F35]">{headerTitle}</h3>
        <p className="text-sm text-[#3E2F35]/70">{headerCopy}</p>
      </header>
      <div className="space-y-3">
        {learn.length ? (
          learn.map((module) => (
            <article key={module.moduleId} className="space-y-2 rounded-[24px] border border-[#EAD4D8] bg-[#FCF9F7] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#3E2F35]">{module.title}</p>
                <StatusBadge
                  label={module.completed ? "Completed" : "In progress"}
                  variant={module.completed ? "success" : "default"}
                />
              </div>
              <p className="text-xs text-[#3E2F35]/70">
                {module.journey ? `${module.journey} journey` : "Learning rhythm incoming."} ·
                {` ${module.linkedRegistryItems.length} picks linked`}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#D7C0C5] bg-[#FBF7F5] p-4">
            <p className="text-sm text-[#3E2F35]/70">Progressive learning links appear once your plan warms up.</p>
          </div>
        )}
      </div>
    </div>
  );
}
