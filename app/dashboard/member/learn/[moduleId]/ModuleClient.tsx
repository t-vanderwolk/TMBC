"use client";

import Link from "next/link";
import { useState } from "react";

import type { AcademyModuleDetail } from "@/lib/academyClient";
import WorkbookClient from "./WorkbookClient";

type ModuleClientProps = {
  module: AcademyModuleDetail;
};

export default function ModuleClient({ module }: ModuleClientProps) {
  const [isCompleted, setIsCompleted] = useState(module.completed ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const workbookPrompts = module.workbookPrompts ?? [];

  const journeyLabel = (() => {
    const journey = module.journey?.toLowerCase();
    if (journey === "nursery") return "Nursery";
    if (journey === "gear") return "Gear";
    if (journey === "postpartum") return "Postpartum";
    return "Journey";
  })();

  const handleComplete = async () => {
    if (isCompleted) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/academy/modules/${module.id}/complete`, {
        method: "POST",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Unable to complete module");
      }
      setIsCompleted(true);
    } catch (err) {
      setError("We could not mark this module complete right now.");
    } finally {
      setSaving(false);
    }
  };

  const progressLabel = isCompleted ? "Completed" : module.progress ? "In progress" : "Not started";

  return (
    <div className="space-y-8 rounded-[2.5rem] border border-[#EAD4D8] bg-white/90 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.15)]">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">{journeyLabel}</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">{module.title}</h1>
        <span className="inline-flex items-center rounded-full border border-[#F1D5DA] px-3 py-1 text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">
          {progressLabel}
        </span>
      </header>

      <section className="space-y-3 rounded-2xl bg-[#FFF8F6] p-5 text-[#3E2F35]">
        <p className="text-sm leading-relaxed text-[#3E2F35]/70">
          {module.description ?? "Lean into calmer guidance crafted for you."}
        </p>
        {module.estimatedMinutes ? (
          <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">
            Estimated time · {module.estimatedMinutes} min
          </p>
        ) : null}
      </section>

      <section className="space-y-3 rounded-2xl border border-[#E3C6D4] bg-white/90 p-5">
        <h2 className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Lecture</h2>
        {module.lecture ? (
          <p className="text-sm leading-relaxed text-[#3E2F35]/80 whitespace-pre-line">
            {module.lecture}
          </p>
        ) : (
          <p className="text-sm italic text-[#3E2F35]/60">Lecture content coming soon.</p>
        )}
      </section>

      {module.objectives && module.objectives.length ? (
        <section className="space-y-3 rounded-2xl border border-[#E3C6D4] bg-white/80 p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Learning objectives</p>
          <ul className="space-y-2 text-sm text-[#3E2F35]/80">
            {module.objectives.map((objective) => (
              <li key={objective} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#C8A1B4]" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {module.sections && module.sections.length ? (
        <section className="space-y-5">
          {module.sections
            .filter((section) => section.title.toLowerCase() !== "lecture")
            .map((section) => (
              <article
                key={section.title}
                className="space-y-2 rounded-2xl border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_10px_40px_rgba(200,160,180,0.15)]"
              >
                <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-[#A4556A]">
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#3E2F35]/80">{section.content}</p>
              </article>
            ))}
        </section>
      ) : null}

      {workbookPrompts.length ? (
        <WorkbookClient moduleId={module.id} prompts={workbookPrompts} />
      ) : null}

      <section className="space-y-3 rounded-2xl border border-[#E3C6D4] bg-white/90 p-5">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
          Discuss this module
        </p>
        <p className="text-sm text-[#3E2F35]/70">
          Keep your reflections alive by sharing how this work resonates with your journey. Mentors read along in every room.
        </p>
        <Link
          href={`/dashboard/member/community/module/${module.id}`}
          className="inline-flex items-center justify-center rounded-full border border-[#E3C6D4] bg-[#FFF8F6] px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:border-[#C8A1B4] hover:bg-[#FDF3EF]"
        >
          Open module discussion
        </Link>
      </section>

      <section className="space-y-3 rounded-2xl border border-[#E3C6D4] bg-white/90 p-5">
        <button
          type="button"
          onClick={handleComplete}
          disabled={isCompleted || saving}
          className="w-full rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#B98AA5] disabled:opacity-60"
        >
          {isCompleted ? "Completed" : saving ? "Saving…" : "Mark as complete"}
        </button>
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </section>
    </div>
  );
}
