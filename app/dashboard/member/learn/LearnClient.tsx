"use client";

import Link from "next/link";
import AcademySection from "@/components/dashboard/member/learn/AcademySection";
import ModuleCard from "@/components/dashboard/member/learn/ModuleCard";
import PageHeader from "@/components/dashboard/member/ui/PageHeader";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import type { AcademyModuleCard } from "@/lib/academyClient";

type LearnClientProps = {
  modules: AcademyModuleCard[];
  error?: string;
};

const JOURNEY_META: Record<
  Lowercase<string>,
  { title: string; emotion: string }
> = {
  nursery: {
    title: "Nursery Journey",
    emotion: "Create a space that supports how you actually live.",
  },
  gear: {
    title: "Gear Journey",
    emotion: "Choose tools that work for your body, space, and rhythm.",
  },
  postpartum: {
    title: "Postpartum Journey",
    emotion: "Support yourself with the same care you give your baby.",
  },
};

const JOURNEY_ORDER: Lowercase<string>[] = ["nursery", "gear", "postpartum"];

const moduleStatusLabel = (module: AcademyModuleCard, lockedLabel?: string) => {
  if (lockedLabel) {
    return lockedLabel;
  }
  const progress = module.progress ?? (module.completed ? 100 : 0);
  if (progress >= 100 || module.completed) {
    return "Completed";
  }
  if (progress > 0) {
    return "In progress";
  }
  return "Ready when you are";
};

const moduleStage = (module: AcademyModuleCard) =>
  module.stage ?? "Studio moment";

export default function LearnClient({ modules, error }: LearnClientProps) {
  const safeModules = Array.isArray(modules) ? modules : [];
  const continueModule = safeModules.find((module) => {
    const progress = module.progress ?? (module.completed ? 100 : 0);
    return progress > 0 && progress < 100;
  }) ?? safeModules.find((module) => !module.completed);

  if (!safeModules.length && !error) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        <p className="text-lg font-serif">Your Academy is preparing…</p>
        <p className="mt-2 text-sm">
          Your learning journey will appear here shortly.
        </p>
      </div>
    );
  }

  const journeyState = JOURNEY_ORDER.reduce<Record<string, { unlocked: boolean; completed: boolean }>>(
    (acc, journeyId, index) => {
      const journeyModules = safeModules.filter(
        (module) => module.journey?.toLowerCase() === journeyId,
      );
      const completed =
        journeyModules.length === 0 ||
        journeyModules.every((module) => {
          const progress = module.progress ?? (module.completed ? 100 : 0);
          return progress >= 100 || module.completed;
        });
      const previousJourneyId = JOURNEY_ORDER[index - 1];
      const unlocked = index === 0 || acc[previousJourneyId]?.completed === true;
      acc[journeyId] = { unlocked, completed };
      return acc;
    },
    {},
  );

  const journeyGroups = JOURNEY_ORDER.map((journeyId, index) => {
    const journeyModules = safeModules.filter(
      (module) => module.journey?.toLowerCase() === journeyId,
    );
    const journeyMeta = JOURNEY_META[journeyId];
    const previousJourneyId = JOURNEY_ORDER[index - 1];
    const previousJourneyTitle = JOURNEY_META[previousJourneyId]?.title ?? "previous journey";

    return {
      id: journeyId,
      title: journeyMeta?.title ?? "Journey",
      emotion: journeyMeta?.emotion ?? "",
      modules: journeyModules,
      unlocked: journeyState[journeyId]?.unlocked ?? index === 0,
      lockLabel:
        index === 0
          ? null
          : `Locked until ${previousJourneyTitle} is complete`,
    };
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your Academy"
        subtitle="Learning library"
        description="This is your space to learn, reflect, and prepare—at your pace."
      />

      {error && (
        <EmptyState
          title="Something is off"
          description="Unable to load your Academy just now. Please refresh when you feel ready."
        />
      )}

      {!safeModules.length && !error ? (
        <EmptyState
          title="Quiet for now"
          description="Nothing here yet. This space will fill as your journey unfolds."
        />
      ) : null}

      {continueModule ? (
        <section className="rounded-[28px] bg-white/95 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Continue where you left off</p>
          <h2 className="mt-2 font-serif text-2xl text-[#3E2F35]">{continueModule.title}</h2>
          <p className="mt-2 text-sm text-[#3E2F35]/70">
            Pick up the next small step when you feel ready.
          </p>
          <Link
            href={`/dashboard/member/learn/${continueModule.id}`}
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#C8A1B4] px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#B98AA5]"
          >
            Continue
          </Link>
        </section>
      ) : null}

      {journeyGroups.map((journey) => (
        <AcademySection
          key={journey.id}
          title={journey.title}
          emotion={journey.emotion}
        >
          {journey.modules.length ? (
            <div className="space-y-3">
              {journey.modules.map((module) => {
                const isLocked = !journey.unlocked && !module.completed;
                const statusLabel = moduleStatusLabel(
                  module,
                  isLocked ? journey.lockLabel ?? "Locked" : undefined,
                );
                return (
                  <ModuleCard
                    key={module.id}
                    href={`/dashboard/member/learn/${module.id}`}
                    title={module.title}
                    subtitle={module.description ?? module.summary}
                    estimatedMinutes={module.estimatedMinutes ?? null}
                    stage={moduleStage(module)}
                    status={statusLabel}
                    disabled={isLocked}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Nothing yet"
              description="We are curating this journey for you—check back once a new module appears."
            />
          )}
        </AcademySection>
      ))}
    </div>
  );
}
