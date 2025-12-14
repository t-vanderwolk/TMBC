"use server";

import ResultsClient from "@/components/onboarding/ResultsClient";
import { buildCuratedRegistry, CuratedRegistry } from "@/lib/registry/recommendations";

const defaultTags = ["nesting", "intentional", "travel"];
const moodboardUploaded = true;

export default async function OnboardingResults() {
  const curated: CuratedRegistry = await buildCuratedRegistry(defaultTags);

  return (
    <ResultsClient
      initialRegistry={curated}
      defaultTags={defaultTags}
      moodboardUploaded={moodboardUploaded}
    />
  );
}
