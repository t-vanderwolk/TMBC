"use server";

import CategoryTile from "@/components/tmbc/CategoryTile";
import SectionHeader from "@/components/tmbc/SectionHeader";
import StyledButton from "@/components/tmbc/StyledButton";
import { buildCuratedRegistry, CuratedRegistry } from "@/lib/registry/recommendations";

const defaultTags = ["nesting", "intentional", "travel"];
const moodboardUploaded = true;

async function generateCuratedRegistry(formData: FormData) {
  "use server";
  const tagsValue = formData.get("tags")?.toString() ?? "[]";
  const tags: string[] = JSON.parse(tagsValue);
  const registry = await buildCuratedRegistry(tags);
  console.log("Regenerated curated registry", registry);
  return registry;
}

export default async function OnboardingResults() {
  const curated: CuratedRegistry = await buildCuratedRegistry(defaultTags);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Curated registry"
        subtitle="Everything is pulled from your responses and mentor attention."
        actions={<StyledButton variant="ghost">Share reasoning</StyledButton>}
      />

      {moodboardUploaded && (
        <div className="rounded-[2rem] border border-[#E3C6D4] bg-[#FFFAF8] px-6 py-4 text-sm text-[#3E2F35]">
          Your nursery is already cuter than my house.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {curated.categories.map((category) => (
          <CategoryTile
            key={category.id}
            title={category.title}
            description={category.reason}
            href={`/dashboard/registry/${category.id}`}
            accent={<span>{category.priority ? "Priority" : "Explore"}</span>}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form action={generateCuratedRegistry} className="flex flex-1 min-w-[220px]">
          <input type="hidden" name="tags" value={JSON.stringify(defaultTags)} />
          <button
            type="submit"
            title="You’re about to feel productive."
            className="w-full rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.4em] transition bg-tmMauve text-white border-transparent hover:bg-[#B28FB3]"
          >
            Add all
          </button>
        </form>
        <StyledButton variant="secondary">Customize</StyledButton>
        <StyledButton variant="ghost">View reasoning</StyledButton>
      </div>
    </div>
  );
}
