"use client";

import { Fragment } from "react";

type PlanSection = {
  key: string;
  title: string;
  summary: string;
};

type PlanSidebarProps = {
  sections: PlanSection[];
  activeKey: string;
  onSelect: (key: string) => void;
};

export default function PlanSidebar({ sections, activeKey, onSelect }: PlanSidebarProps) {
  return (
    <aside className="space-y-3 rounded-[28px] border border-[#EAE2E8] bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Sections</p>
        <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
          TODO
        </span>
      </div>
      {sections.map((section) => (
        <Fragment key={section.key}>
          <button
            type="button"
            onClick={() => onSelect(section.key)}
            className={`w-full text-left ${
              activeKey === section.key ? "text-[#3E2F35]" : "text-[#8B4A61]"
            } flex flex-col gap-1 rounded-[20px] border px-4 py-2 transition hover:border-[#E3C6D4]`}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.3em]">
              {section.title}
            </span>
            <span className="text-[0.65rem] text-[#8B4A61]/80">{section.summary}</span>
          </button>
          <div className="space-y-1 text-[0.6rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
            <p>TODO: Show mentor-reviewed state</p>
            <p>TODO: Load sections dynamically per member</p>
          </div>
        </Fragment>
      ))}
    </aside>
  );
}
