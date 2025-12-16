"use client";

import AcademySection from "@/components/dashboard/member/learn/AcademySection";
import ModuleCard from "@/components/dashboard/member/learn/ModuleCard";
import PageHeader from "@/components/dashboard/member/ui/PageHeader";
import EmptyState from "@/components/dashboard/member/ui/EmptyState";
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

const moduleStatusLabel = (module: AcademyModuleCard) => {
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
  const journeyGroups = JOURNEY_ORDER.map((journeyId) => {
    const journeyModules = modules.filter(
      (module) => module.journey?.toLowerCase() === journeyId,
    );
    const journeyMeta = JOURNEY_META[journeyId];

    return {
      id: journeyId,
      title: journeyMeta?.title ?? "Journey",
      emotion: journeyMeta?.emotion ?? "",
      modules: journeyModules,
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
          message="Unable to load your Academy just now. Please refresh when you feel ready."
        />
      )}

      {!modules.length && !error ? (
        <EmptyState
          title="Quiet for now"
          message="Nothing here yet. This space will fill as your journey unfolds."
        />
      ) : null}

      {journeyGroups.map((journey) => (
        <AcademySection
          key={journey.id}
          title={journey.title}
          emotion={journey.emotion}
        >
          {journey.modules.length ? (
            <div className="space-y-3">
              {journey.modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  href={`/dashboard/member/learn/${module.id}`}
                  title={module.title}
                  subtitle={module.description ?? module.summary}
                  estimatedMinutes={module.estimatedMinutes ?? null}
                  stage={moduleStage(module)}
                  status={moduleStatusLabel(module)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nothing yet"
              message="We are curating this journey for you—check back once a new module appears."
            />
          )}
        </AcademySection>
      ))}
    </div>
  );
}
