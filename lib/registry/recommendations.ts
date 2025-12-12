import { explainRecommendation } from "@/lib/services/registry.service";
export { generateLifestyleTags } from "@/lib/services/onboarding.service";

export type CuratedItem = {
  id: string;
  title: string;
  price?: string;
  reason: string;
  image?: string;
};

export type CuratedCategory = {
  id: string;
  title: string;
  reason: string;
  priority: number;
  items: CuratedItem[];
};

export type CuratedRegistry = {
  tags: string[];
  categories: CuratedCategory[];
};

const CATEGORY_MAP: Record<string, { title: string; tags: string[] }> = {
  stroller: { title: "Mobility", tags: ["travel_friendly", "rugged_terrain"] },
  nursery: { title: "Nursery", tags: ["neutral_aesthetic", "low-storage"] },
  feeding: { title: "Feeding", tags: ["pumping_heavy", "intentional"] },
  soothing: { title: "Soothing", tags: ["calm", "low-storage"] },
  travel: { title: "Travel", tags: ["travel_friendly", "sunny_routine"] },
  daily: { title: "Daily care", tags: ["calm"] },
};

export async function buildCuratedRegistry(tags: string[]): Promise<CuratedRegistry> {
  const categories = Object.entries(CATEGORY_MAP)
    .map(([key, { title, tags: tagSet }]) => {
      const priority = tags.filter((tag) => tagSet.includes(tag)).length;
      const reasonTag = tags.find((tag) => tagSet.includes(tag)) ?? "intentional";
      return {
        id: key,
        title,
        reason: explainRecommendation(reasonTag),
        priority,
        items: [
          {
            id: `${key}-hero`,
            title: `${title} staple`,
            price: `$${(priority + 2) * 120}`,
            reason: explainRecommendation(reasonTag),
          },
        ],
      };
    })
    .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title));

  return { tags, categories };
}
