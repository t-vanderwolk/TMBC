"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { AcademyModuleDetail } from "@/lib/academyClient";
import WorkbookClient from "./WorkbookClient";

type ModuleClientProps = {
  module: AcademyModuleDetail;
};

type ModuleTab = "explore" | "learn" | "workbook" | "community";

export default function ModuleClient({ module }: ModuleClientProps) {
  const [isCompleted, setIsCompleted] = useState(module.completed ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<ModuleTab>("explore");
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
  const sections = module.sections ?? [];
  const objectiveList = module.objectives ?? [];
  const filteredSections = sections.filter(
    (section) => section.title && section.title.toLowerCase() !== "apply",
  );

  const exploreNotes = useMemo(() => {
    const notes: { title: string; body: string }[] = [];
    if (module.description) {
      notes.push({ title: "What actually matters", body: module.description });
    }
    if (objectiveList.length) {
      notes.push({
        title: "Most parents wonder",
        body: objectiveList.join(" "),
      });
    }
    return notes;
  }, [module.description, objectiveList]);

  const learnNotes = useMemo(() => {
    const notes: { title: string; body: string }[] = [];
    if (module.lecture) {
      notes.push({ title: "Taylor-Made tip", body: module.lecture });
    }
    filteredSections.forEach((section) => {
      notes.push({ title: section.title, body: section.content });
    });
    return notes;
  }, [module.lecture, filteredSections]);

  const actionButtonClasses =
    "w-full rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#B98AA5] disabled:opacity-60";

  const TabButton = ({
    label,
    value,
  }: {
    label: string;
    value: ModuleTab;
  }) => (
    <button
      type="button"
      onClick={() => setTab(value)}
      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition ${
        tab === value
          ? "bg-[#F6E7ED] text-[#A4556A]"
          : "text-[#3E2F35]/60 hover:text-[#A4556A]"
      }`}
      aria-pressed={tab === value}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 rounded-[32px] bg-[#FFF9F5] p-6 shadow-sm">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">{journeyLabel}</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">{module.title}</h1>
        <span className="inline-flex items-center rounded-full border border-[#F1D5DA] px-3 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">
          {progressLabel}
        </span>
      </header>

      <section className="space-y-3 rounded-2xl bg-white/80 p-5 shadow-sm">
        <p className="text-sm leading-relaxed text-[#3E2F35]/70">
          {module.description ?? "Lean into calmer guidance crafted for you."}
        </p>
        {module.estimatedMinutes ? (
          <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">
            Estimated time · {module.estimatedMinutes} min
          </p>
        ) : (
          <p className="text-xs uppercase tracking-[0.4em] text-[#3E2F35]/60">Flexible pace</p>
        )}
      </section>

      <div className="sticky top-0 z-20 -mx-6 border-y border-[#F1D5DA] bg-[#FFF9F5]/95 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <TabButton label="Explore" value="explore" />
          <TabButton label="Learn" value="learn" />
          <TabButton label="Workbook" value="workbook" />
          <TabButton label="Community" value="community" />
        </div>
      </div>

      {tab === "explore" && (
        <section className="space-y-4">
          {exploreNotes.length ? (
            exploreNotes.map((note) => (
              <article key={note.title} className="rounded-2xl bg-white/90 p-5 shadow-sm">
                <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-[#A4556A]">
                  {note.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#3E2F35]/80">{note.body}</p>
              </article>
            ))
          ) : (
            <article className="rounded-2xl bg-white/90 p-5 shadow-sm">
              <p className="text-sm text-[#3E2F35]/70">
                This module is ready when you are. Your mentor can help you decide the best starting point.
              </p>
            </article>
          )}
          <div className="sticky bottom-4 z-10">
            <button type="button" onClick={() => setTab("learn")} className={actionButtonClasses}>
              Continue to Learn
            </button>
          </div>
        </section>
      )}

      {tab === "learn" && (
        <section className="space-y-4">
          {learnNotes.length ? (
            learnNotes.map((note) => (
              <details key={note.title} className="rounded-2xl bg-white/90 p-5 shadow-sm">
                <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.4em] text-[#A4556A]">
                  {note.title}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#3E2F35]/80 whitespace-pre-line">
                  {note.body}
                </p>
              </details>
            ))
          ) : (
            <article className="rounded-2xl bg-white/90 p-5 shadow-sm">
              <p className="text-sm text-[#3E2F35]/70">Learning notes are on the way.</p>
            </article>
          )}
          <article className="rounded-2xl bg-white/90 p-5 text-sm text-[#3E2F35]/70 shadow-sm">
            <p>Want more context? This is a good moment to check in.</p>
            <div className="mt-3 flex items-center justify-between text-xs text-[#A4556A]">
              <Link href="/dashboard/member/messages" className="hover:text-[#7C3B53]">
                Ask your mentor
              </Link>
              <Link href="/dashboard/plan" className="hover:text-[#7C3B53]">
                View your Plan
              </Link>
            </div>
          </article>
          <div className="sticky bottom-4 z-10">
            <button type="button" onClick={() => setTab("workbook")} className={actionButtonClasses}>
              Go to Workbook
            </button>
          </div>
        </section>
      )}

      {tab === "workbook" && (
        <section className="space-y-4">
          {workbookPrompts.length ? (
            <WorkbookClient moduleId={module.id} prompts={workbookPrompts} />
          ) : (
            <article className="rounded-2xl bg-white/90 p-5 shadow-sm">
              <p className="text-sm text-[#3E2F35]/70">Workbook prompts are on the way.</p>
            </article>
          )}
          <div className="sticky bottom-4 z-10 space-y-2">
            <button
              type="button"
              onClick={handleComplete}
              disabled={isCompleted || saving}
              className={actionButtonClasses}
            >
              {isCompleted ? "Completed" : saving ? "Saving..." : "Mark as complete"}
            </button>
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
          </div>
        </section>
      )}

      {tab === "community" && (
        <section className="space-y-4">
          <article className="rounded-2xl bg-white/90 p-5 shadow-sm">
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
              Community
            </p>
            <p className="mt-2 text-sm text-[#3E2F35]/70">
              Share what feels clear or uncertain so mentors and peers can support your next step.
            </p>
          </article>
          <div className="sticky bottom-4 z-10">
            <Link
              href={`/dashboard/member/community/module/${module.id}`}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#E3C6D4] bg-[#FFF8F6] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:border-[#C8A1B4] hover:bg-[#FDF3EF]"
            >
              Ask a question
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
