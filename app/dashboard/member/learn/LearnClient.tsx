"use client";

import Link from "next/link";

import SectionNav from "@/components/dashboard/SectionNav";
import type { AcademyModuleCard } from "@/lib/academyClient";

type LearnClientProps = {
  modules: AcademyModuleCard[];
  error?: string;
};

const JOURNEY_META: Record<
  Lowercase<string>,
  { title: string; subtitle: string; accent: string }
> = {
  nursery: {
    title: "Nursery Journey",
    subtitle: "Anchor the nest with soft light, soothing textures, and confident flow.",
    accent: "from-[#FDEEE7] to-[#FFF8F6]",
  },
  gear: {
    title: "Gear Journey",
    subtitle: "Select mobility and daily tools that feel practical and deliberate.",
    accent: "from-[#F8EEF7] to-[#FFF6F8]",
  },
  postpartum: {
    title: "Postpartum Journey",
    subtitle: "Support recovery, rituals, and relationships with honest care.",
    accent: "from-[#F7F4FF] to-[#FDF9FE]",
  },
};

const JOURNEY_ORDER: Lowercase<string>[] = ["nursery", "gear", "postpartum"];

const renderModuleStatus = (module: AcademyModuleCard) => {
  const progress = module.progress ?? (module.completed ? 100 : 0);
  if (progress >= 100) {
    return { label: "Completed ✓", tone: "text-[#4E2B40]" };
  }
  if (progress > 0) {
    return { label: "Continue", tone: "text-[#A4556A]" };
  }
  return { label: "Start module", tone: "text-[#8F7C94]" };
};

export default function LearnClient({ modules, error }: LearnClientProps) {
  const firstModule = modules[0];
  const isFreshStart =
    modules.length > 0 &&
    modules.every((module) => !(module.completed || (module.progress ?? 0) >= 100));

  const journeyGroups = JOURNEY_ORDER.map((journeyId) => {
    const journeyModules = modules.filter((module) => {
      const journey = (module.journey ?? module.stage ?? "").toLowerCase();
      return journey === journeyId || module.id.toLowerCase().includes(journeyId);
    });

    const completed = journeyModules.filter(
      (module) => module.completed || (module.progress ?? 0) >= 100,
    ).length;

    return {
      id: journeyId,
      title: JOURNEY_META[journeyId]?.title ?? journeyId,
      subtitle: JOURNEY_META[journeyId]?.subtitle ?? "",
      accent: JOURNEY_META[journeyId]?.accent ?? "from-[#FDEEE7] to-[#FFF8F6]",
      modules: journeyModules,
      completed,
      total: journeyModules.length,
    };
  });

  return (
    <div className="space-y-10">
      <section className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/70">Academy journal</p>
        <h1 className="mt-3 font-serif text-3xl text-[#3E2F35]">Your curated studio for learning</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Calmly move through Nursery, Gear, and Postpartum journeys. Start with the next module, return
          to a ritual, or explore a new insight whenever it feels right.
        </p>
        {isFreshStart && firstModule ? (
          <div className="mt-4 rounded-2xl border border-[#F1D5DA] bg-white/80 p-4 text-sm text-[#3E2F35]/80">
            <p className="text-sm font-medium text-[#4E2B40]">Ready for your first lesson?</p>
            <p className="text-sm text-[#3E2F35]/70">
              Begin with {firstModule.title} and let the studio guide you through each journey.
            </p>
            <Link
              href={`/dashboard/member/learn/${firstModule.id}`}
              className="mt-3 inline-flex items-center rounded-full border border-[#C8A1B4] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35] transition hover:border-[#B98AA5]"
            >
              Start your first module
            </Link>
          </div>
        ) : null}
      </section>

      <SectionNav />

      {error ? (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!modules.length && !error ? (
        <div className="rounded-[2.25rem] border border-dashed border-[#EAD4D8] bg-white/90 p-6 text-sm text-[#3E2F35]/70">
          <p className="text-lg font-semibold text-[#3E2F35]">Modules are on their way.</p>
          <p className="mt-2">
            We are curating the Academy content for you—please check back momentarily or explore the
            journeys above as they fill out.
          </p>
        </div>
      ) : null}

      {journeyGroups.map((journey) => {
        const hasContent = journey.modules.length > 0;
        const journeyComplete = hasContent && journey.completed === journey.total;
        const progressWidth = journey.total ? `${Math.round((journey.completed / journey.total) * 100)}%` : "0%";

        return (
          <section
            key={journey.id}
            className="space-y-6 rounded-[2.5rem] border border-[#E9D8DE] bg-white/80 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.15)]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">{journey.title}</p>
                  <p className="text-sm text-[#3E2F35]/70">{journey.subtitle}</p>
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A4556A]">
                  {journey.total ? `${journey.completed} of ${journey.total} complete` : "Curating journey"}
                </span>
              </div>
              <div className="overflow-hidden rounded-full bg-[#FFEAF0]">
                <div
                  className={`h-2 bg-gradient-to-r ${journey.accent}`}
                  style={{ width: progressWidth }}
                />
              </div>
            </div>

            {hasContent ? (
              <div className="grid gap-4 md:grid-cols-2">
                {journey.modules.map((module) => {
                  const progress = module.progress ?? (module.completed ? 100 : 0);
                  const status = renderModuleStatus(module);
                  return (
                    <Link
                      key={module.id}
                      href={`/dashboard/member/learn/${module.id}`}
                      className="group flex flex-col rounded-[2rem] border border-[#E3C6D4] bg-white/90 px-5 py-6 transition hover:-translate-y-0.5 hover:border-[#C8A1B4] hover:shadow-[0_24px_60px_rgba(180,143,164,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A1B4]"
                    >
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">
                        <span>{status.label}</span>
                        <span className={status.tone}>
                          {progress >= 100 ? "Complete" : progress > 0 ? "In progress" : "New"}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-[#3E2F35]">{module.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#3E2F35]/70">
                        {module.description ?? module.summary ?? "Calm guidance curated for you."}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs tracking-[0.35em] text-[#3E2F35]/60">
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#C8A1B4] text-transparent">.</span>
                          {module.stage ?? "Studio ritual"}
                        </span>
                        <span className="text-[#A4556A]">{status.label}</span>
                      </div>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F5ECF0]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#C8A1B4] to-[#B98AA5]"
                          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#E3C6D4] p-6 text-sm text-[#3E2F35]/70">
                <p className="text-lg font-medium text-[#4E2B40]">No modules yet in this journey.</p>
                <p className="mt-2 text-sm text-[#3E2F35]/70">
                  We are curating this journey for you—check back soon or explore another chapter while we tidy this section.
                </p>
              </div>
            )}

            {journeyComplete ? (
              <p className="text-sm text-[#3E2F35]/70">
                All modules in this journey are complete. Celebrate with a journal entry.
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
