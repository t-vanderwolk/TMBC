"use client";

import { useEffect, useMemo, useState } from "react";

import PlanLayout from "@/components/plan/PlanLayout";
import PlanSidebar from "@/components/plan/PlanSidebar";
import PlanContent, { type PlanContentSection } from "@/components/plan/PlanContent";
import PlanContextPanel from "@/components/plan/PlanContextPanel";
import MemberBottomNav from "@/components/dashboard/member/nav/MemberBottomNav";
import { planSectionMap, type PlanSectionKey } from "@/lib/plan/planSectionMap";
import type { PlanDecisionState } from "@/lib/services/server/planSections.service";

type ApiSection = {
  id: string;
  sectionKey: string;
  decisionState?: PlanDecisionState | null;
  memberNote?: string | null;
  mentorNote?: string | null;
  updatedAt?: string | null;
  memberAcknowledgement?: string | null;
};

type LoadStatus = "idle" | "loading" | "success" | "error";

const toLabel = (value: string) =>
  value
    .split(/[-_]/)
    .map((fragment) => fragment.charAt(0).toUpperCase() + fragment.slice(1).toLowerCase())
    .join(" ");

export default function PlanPage() {
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [sections, setSections] = useState<ApiSection[]>([]);
  const [error, setError] = useState("");
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSections = async () => {
      setStatus("loading");
      setError("");
      try {
        const response = await fetch("/api/plan/sections");
        if (!response.ok) {
          throw new Error("Unable to load plan sections.");
        }
        const payload = await response.json();
        const loaded = Array.isArray(payload?.sections) ? payload.sections : [];
        if (!isMounted) return;
        setSections(loaded);
        setStatus("success");
      } catch (err) {
        console.error("Plan sections load failed", err);
        if (!isMounted) return;
        setError("Your plan workspace is unavailable right now. Please try again later.");
        setStatus("error");
      }
    };
    void loadSections();
    return () => {
      isMounted = false;
    };
  }, []);

  const displaySections: PlanContentSection[] = useMemo(() => {
    return sections.map((section) => {
      const meta = planSectionMap[section.sectionKey as PlanSectionKey];
      return {
        ...section,
        title: meta?.title ?? toLabel(section.sectionKey),
        summary: meta?.helper ?? "Your mentor can add context here once the section is ready.",
      };
    });
  }, [sections]);

  useEffect(() => {
    if (!activeSectionKey && displaySections.length) {
      const firstSection = displaySections[0];
      if (firstSection) {
        setActiveSectionKey(firstSection.sectionKey);
      }
    }
  }, [displaySections, activeSectionKey]);

  return (
    <div className="relative pb-[96px]">
      <main className="space-y-8 px-4 py-10 lg:px-10">
        <header className="mb-6 space-y-2 rounded-[32px] border border-[#EAE2E8] bg-white/90 p-6 text-[#3E2F35] shadow-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Plan workspace</p>
        <h1 className="text-3xl font-serif">Your plan, gently framed.</h1>
        <p className="text-sm text-[#3E2F35]/80">
          Daily plan notes and decision states live here once your Academy paths activate. Move through the experience
          to unlock the workspace and keep your mentor aligned.
        </p>
      </header>
      <PlanLayout>
        <PlanSidebar
          sections={displaySections}
          activeKey={activeSectionKey}
          onSelect={(key) => setActiveSectionKey(key)}
        />
        <PlanContent
          sections={displaySections}
          expandedKey={activeSectionKey}
          onToggle={(key) => setActiveSectionKey((prev) => (prev === key ? null : key))}
          status={status}
          errorMessage={error}
        />
        <PlanContextPanel />
      </PlanLayout>
      </main>
      <MemberBottomNav />
    </div>
  );
}
