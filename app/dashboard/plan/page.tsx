"use client";

import { useMemo, useState } from "react";

import PlanLayout from "@/components/plan/PlanLayout";
import PlanSidebar from "@/components/plan/PlanSidebar";
import PlanContent from "@/components/plan/PlanContent";
import PlanContextPanel from "@/components/plan/PlanContextPanel";

const planSections = [
  {
    key: "travel",
    title: "Travel & Mobility",
    summary:
      "Gentle reminders about bags, passes, and pacing for the journeys ahead.",
  },
  {
    key: "sleep",
    title: "Sleep & Safe Rest",
    summary: "Space for calm sleep experiments, crib checks, and rhythm notes.",
  },
  {
    key: "feeding",
    title: "Feeding",
    summary: "Track impressions, questions, and any mentor guidance about feeding.",
  },
  {
    key: "diapering",
    title: "Diapering",
    summary: "Log textures, routines, and comfort cues in this lane.",
  },
  {
    key: "nursery",
    title: "Nursery Setup",
    summary: "Mood, storage, lighting, and those thoughtful finishing touches.",
  },
  {
    key: "health",
    title: "Health & Safety",
    summary: "Vendor-ready checklists, appointments, and reference notes.",
  },
  {
    key: "play",
    title: "Play & Development",
    summary: "Soft prompts for early movement, books, and curiosity play.",
  },
];

export default function PlanPage() {
  const [activeSectionKey, setActiveSectionKey] = useState(planSections[0]?.key ?? "travel");
  const activeSection = useMemo(
    () => planSections.find((section) => section.key === activeSectionKey) ?? planSections[0],
    [activeSectionKey],
  );

  return (
    <main className="space-y-8 px-4 py-10 lg:px-10">
      <header className="mb-6 rounded-[32px] border border-[#EAE2E8] bg-white/90 p-6 text-[#3E2F35] shadow-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Plan workspace</p>
        <h1 className="mt-3 text-3xl font-serif">Your plan, gently framed.</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/80">
          This plan surface is entirely placeholder today — no logic, no APIs, just structure and future intent.
          TODO: Tell the story of the plan workspace here when the experience is ready.
        </p>
      </header>
      <PlanLayout>
        <PlanSidebar
          sections={planSections}
          activeKey={activeSectionKey}
          onSelect={(key) => setActiveSectionKey(key)}
        />
        <PlanContent section={activeSection} />
        <PlanContextPanel />
      </PlanLayout>
    </main>
  );
}
