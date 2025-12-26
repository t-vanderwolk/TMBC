"use server";

import Link from "next/link";
import CategoryTile from "@/components/tmbc/CategoryTile";
import SectionHeader from "@/components/tmbc/SectionHeader";
import StyledButton from "@/components/tmbc/StyledButton";
import { buildCuratedRegistry } from "@/lib/registry/recommendations";

export default async function DashboardOnboardingResults() {
  const curated = await buildCuratedRegistry(["nesting", "care", "travel"]);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Dashboard registry results"
        subtitle="Your mentor reviewed your onboarding answers."
        actions={
          <Link href="/dashboard/plan">
            <StyledButton variant="ghost">Go to registry</StyledButton>
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        {curated.categories.map((category) => (
          <CategoryTile
            key={category.id}
            title={category.title}
            description={category.reason}
            href="/dashboard/plan"
            accent={<span>{category.priority ? "Priority" : "Fresh"}</span>}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StyledButton title="You’re about to feel productive.">Review with mentor</StyledButton>
        <StyledButton variant="secondary">Customize</StyledButton>
        <StyledButton variant="ghost">View reasoning</StyledButton>
      </div>
    </div>
  );
}
