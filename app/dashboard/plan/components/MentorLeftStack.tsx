"use client";

import StatusBadge from "./StatusBadge";
import { usePlanContext } from "../PlanContext";

export default function MentorLeftStack() {
  const { learn } = usePlanContext();

  return (
    <div className="space-y-6">
      <div className="space-y-2 rounded-[24px] border border-[#E4D5D9] bg-white/80 p-4">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Member context</p>
        <h3 className="text-lg font-semibold text-[#3E2F35]">Status snapshot</h3>
        <p className="text-sm text-[#3E2F35]/70">Read-only summary of where the member is headed.</p>
      </div>
      <div className="space-y-3 rounded-[24px] border border-[#E4D5D9] bg-[#FCF9F7] p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#3E2F35]">Learning pulse</p>
          <StatusBadge label="Modules" variant="success" />
        </div>
        <div className="space-y-3">
        {learn.length ? (
          learn.slice(0, 3).map((link) => (
            <div key={link.moduleId} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-[#3E2F35]/80">
                <span>{link.title}</span>
                <span>{link.linkedRegistryItems.length} linked</span>
              </div>
              <StatusBadge
                label={link.completed ? "Completed" : "In progress"}
                variant={link.completed ? "success" : "default"}
              />
            </div>
          ))
        ) : (
            <p className="text-xs text-[#3E2F35]/70">Academy context warms up once the plan rests in registry choices.</p>
          )}
        </div>
      </div>
      <div className="rounded-[24px] border border-[#E4D5D9] bg-white/80 p-4">
        <p className="text-sm font-semibold text-[#3E2F35]">Planning phases</p>
        <p className="text-xs text-[#3E2F35]/70">No phase is final—keep the tempo calm for members.</p>
      </div>
    </div>
  );
}
