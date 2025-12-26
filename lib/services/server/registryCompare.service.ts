import { RegistryItemStatus, RegistrySection } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { emitRegistryAnalytics } from "@/lib/services/server/analytics.service";
import { getOnboardingProfile } from "@/lib/services/server/onboarding.service";
import { OnboardingIntelligenceService } from "@/lib/services/server/onboardingIntelligence.service";
import { getModulesWithProgress, getUserProgressSummary } from "@/lib/services/server/academy.service";
import { addRegistryItem } from "@/lib/services/server/registry.service";
import { ensurePriceWatchForItem } from "@/lib/services/server/priceIntelligence.service";

type CompareDecision = "accept" | "modify" | "defer";
type CompareSource = "onboarding" | "academy" | "mentor" | "member";

type CompareStartInput = {
  userId: string;
  itemIds: string[];
  source?: CompareSource;
};

type CompareDecisionInput = {
  userId: string;
  itemIds: string[];
  decision: CompareDecision;
  source?: CompareSource;
  acceptedItemId?: string | null;
  acceptedSuggestionId?: string | null;
};

type CompareItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string | null;
  merchant: string | null;
  section: string;
  status: string;
  notes: string | null;
  mentorNotes: Array<{
    id: string;
    note: string;
    mentorName: string | null;
    createdAt: string;
  }>;
  source: string | null;
};

type MentorSuggestion = {
  id: string;
  mentorId: string;
  mentorName: string | null;
  category: string;
  productId: string;
  productName: string;
  productBrand: string;
  productImageUrl: string | null;
  note: string | null;
  createdAt: string;
};

export type ComparePayload = {
  category: string;
  items: CompareItem[];
  mentorSuggestions: MentorSuggestion[];
  lifestyleTags: string[];
  academy: {
    completedCount: number;
    totalCount: number;
    relevantModules: Array<{ id: string; title: string; completed: boolean }>;
  };
  mentorInvolvement: boolean;
  registryId: string;
  source: CompareSource;
};

const normalizeCategory = (value?: string | null) => value?.trim().toLowerCase() ?? "";
const VALID_DECISIONS = new Set<CompareDecision>(["accept", "modify", "defer"]);
const VALID_SOURCES = new Set<CompareSource>(["onboarding", "academy", "mentor", "member"]);

const normalizeSource = (source?: CompareSource) =>
  source && VALID_SOURCES.has(source) ? source : "member";

const resolveCategory = (item: { category?: string | null; product: { category?: string | null } }) =>
  item.category ?? item.product.category ?? "unassigned";

const unique = <T>(items: T[]) => Array.from(new Set(items));

const getRegistryForUser = async (userId: string) => {
  const registry = await prisma.registry.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!registry) {
    throw new Error("Registry not found.");
  }

  return registry;
};

const inferSectionFromCategory = (category?: string | null): RegistrySection => {
  const normalized = normalizeCategory(category);
  if (normalized.includes("nursery")) return RegistrySection.NURSERY;
  if (normalized.includes("feed") || normalized.includes("bottle") || normalized.includes("nursing")) {
    return RegistrySection.FEEDING;
  }
  if (normalized.includes("postpartum") || normalized.includes("healing") || normalized.includes("wellness")) {
    return RegistrySection.POSTPARTUM;
  }
  if (normalized.includes("later")) return RegistrySection.LATER;
  return RegistrySection.GEAR;
};

const loadRegistryItems = async (userId: string, itemIds: string[]) => {
  const items = await prisma.registryItem.findMany({
    where: { id: { in: itemIds }, userId },
    include: {
      product: true,
    },
  });

  if (items.length !== itemIds.length) {
    throw new Error("One or more registry items could not be found.");
  }

  const productIds = unique(items.map((item) => item.productId));
  const mentorNotes = await prisma.mentorNote.findMany({
    where: { memberId: userId, productId: { in: productIds } },
    include: { mentor: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const mentorNotesMap = new Map<string, CompareItem["mentorNotes"]>();
  mentorNotes.forEach((note) => {
    if (!note.productId) return;
    const list = mentorNotesMap.get(note.productId) ?? [];
    list.push({
      id: note.id,
      note: note.content,
      mentorName: note.mentor?.name ?? null,
      createdAt: note.createdAt.toISOString(),
    });
    mentorNotesMap.set(note.productId, list);
  });

  const compareItems = items.map((item) => ({
    id: item.id,
    name: item.title ?? item.name ?? item.product.name,
    brand: item.brand ?? item.product.brand ?? "TMBC",
    category: resolveCategory(item),
    imageUrl: item.imageUrl ?? item.image ?? item.product.imageUrl ?? null,
    merchant: item.merchant ?? item.brand ?? null,
    section: item.section,
    status: item.status,
    notes: item.notes ?? null,
    mentorNotes: mentorNotesMap.get(item.productId) ?? [],
    source: item.source ?? null,
  }));

  return { items, compareItems };
};

const validateSelection = (compareItems: CompareItem[]) => {
  if (compareItems.length < 2 || compareItems.length > 3) {
    throw new Error("Select 2 or 3 items to compare.");
  }

  const categories = unique(compareItems.map((item) => normalizeCategory(item.category)));
  if (categories.length !== 1) {
    throw new Error("Compare requires items from the same category.");
  }

  const category = compareItems[0]?.category ?? "unassigned";
  return category;
};

const getLifestyleTags = async (userId: string) => {
  const profile = await getOnboardingProfile(userId);
  if (!profile) return [];

  const answers = (profile.answers ?? {}) as Record<string, unknown>;
  return OnboardingIntelligenceService.computeTagsFromAnswers(answers);
};

const getAcademySignals = async (userId: string, category: string) => {
  const [summary, modules] = await Promise.all([
    getUserProgressSummary(userId),
    getModulesWithProgress(userId),
  ]);

  const normalized = normalizeCategory(category);
  const relevantModules = modules
    .filter((module) =>
      module.categories.some((moduleCategory) => normalizeCategory(moduleCategory) === normalized),
    )
    .map((module) => ({
      id: module.id,
      title: module.title,
      completed: Boolean(module.completed),
    }));

  return {
    completedCount: summary.completed,
    totalCount: summary.total,
    relevantModules,
  };
};

const deriveSeededBy = (compareItems: CompareItem[]) => {
  const sources = unique(compareItems.map((item) => item.source).filter(Boolean) as string[]);
  return sources.length ? sources : ["manual"];
};

const loadMentorSuggestions = async (userId: string, category: string) => {
  const suggestions = await prisma.mentorProductSuggestion.findMany({
    where: {
      memberId: userId,
      category,
      acceptedAt: null,
    },
    include: {
      mentor: { select: { id: true, name: true } },
      product: { select: { id: true, name: true, brand: true, imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return suggestions.map((suggestion) => ({
    id: suggestion.id,
    mentorId: suggestion.mentorId,
    mentorName: suggestion.mentor?.name ?? null,
    category: suggestion.category,
    productId: suggestion.productId,
    productName: suggestion.product?.name ?? "Suggested product",
    productBrand: suggestion.product?.brand ?? "TMBC",
    productImageUrl: suggestion.product?.imageUrl ?? null,
    note: suggestion.note,
    createdAt: suggestion.createdAt.toISOString(),
  }));
};

export const startRegistryCompare = async ({ userId, itemIds, source }: CompareStartInput) => {
  const registry = await getRegistryForUser(userId);
  const { compareItems } = await loadRegistryItems(userId, itemIds);
  const category = validateSelection(compareItems);
  const [lifestyleTags, academy, mentorSuggestions] = await Promise.all([
    getLifestyleTags(userId),
    getAcademySignals(userId, category),
    loadMentorSuggestions(userId, category),
  ]);

  const mentorInvolvement =
    compareItems.some((item) => item.mentorNotes.length > 0) || mentorSuggestions.length > 0;
  const payload: ComparePayload = {
    category,
    items: compareItems,
    mentorSuggestions,
    lifestyleTags,
    academy,
    mentorInvolvement,
    registryId: registry.id,
    source: normalizeSource(source),
  };

  emitRegistryAnalytics("compare_started", {
    userId,
    registryId: registry.id,
    category,
    itemIds,
    seededBy: deriveSeededBy(compareItems),
    mentorInvolvement,
    academyModulesCompleted: academy.completedCount,
    academyRelevantModules: academy.relevantModules.map((module) => module.id),
    source: payload.source,
  });

  return payload;
};

export const recordCompareDecision = async ({
  userId,
  itemIds,
  decision,
  source,
  acceptedItemId,
  acceptedSuggestionId,
}: CompareDecisionInput) => {
  const registry = await getRegistryForUser(userId);
  const { compareItems } = await loadRegistryItems(userId, itemIds);
  const category = validateSelection(compareItems);
  let acceptedMentorId: string | null = null;

  if (!VALID_DECISIONS.has(decision)) {
    throw new Error("Decision must be accept, modify, or defer.");
  }

  if (decision === "accept") {
    // Decision-support only: accept marks intent but does not mutate other registry items.
    if (acceptedItemId && acceptedSuggestionId) {
      throw new Error("Choose only one accepted item.");
    }
    if (!acceptedItemId && !acceptedSuggestionId) {
      throw new Error("Choose the item you want to accept.");
    }

    if (acceptedSuggestionId) {
      // TMBC Canon: Mentors advise. Suggestions stay drafts until a member accepts.
      const suggestion = await prisma.mentorProductSuggestion.findFirst({
        where: { id: acceptedSuggestionId, memberId: userId, acceptedAt: null },
        include: {
          product: true,
          mentor: { select: { id: true, name: true } },
        },
      });

      if (!suggestion) {
        throw new Error("Mentor suggestion not found.");
      }

      if (normalizeCategory(suggestion.category) !== normalizeCategory(category)) {
        throw new Error("Mentor suggestion category must match this comparison.");
      }

      // Decision-support only: uses admin-owned product affiliate links once the member accepts.
      const created = await addRegistryItem({
        userId,
        productId: suggestion.productId,
        notes: suggestion.note ?? undefined,
        status: RegistryItemStatus.ADDED,
        section: inferSectionFromCategory(suggestion.category),
      });

      await prisma.registryItem.update({
        where: { id: created.item.id },
        data: { source: "mentor", decisionStatus: "ACCEPTED", addedByMentor: true },
      });

      await ensurePriceWatchForItem(created.item.id);

      await prisma.mentorProductSuggestion.update({
        where: { id: suggestion.id },
        data: { acceptedAt: new Date() },
      });

      acceptedMentorId = suggestion.mentorId;
      const academy = await getAcademySignals(userId, category);
      emitRegistryAnalytics("mentor_suggestion_accepted", {
        userId,
        registryId: registry.id,
        category,
        mentorId: suggestion.mentorId,
        productId: suggestion.productId,
        decision,
        academyModulesCompleted: academy.completedCount,
        source: normalizeSource(source),
      });
    } else {
      const accepted = compareItems.find((item) => item.id === acceptedItemId);
      if (!accepted) {
        throw new Error("Accepted item must be one of the compared items.");
      }

      await prisma.registryItem.update({
        where: { id: accepted.id },
        data: { decisionStatus: "ACCEPTED" },
      });

      await ensurePriceWatchForItem(accepted.id);
    }
  }

  await prisma.compareEvent.create({
    data: {
      userId,
      registryId: registry.id,
      category,
      itemIds,
      decision,
      source: normalizeSource(source),
    },
  });

  const mentorInvolvement =
    compareItems.some((item) => item.mentorNotes.length > 0) || Boolean(acceptedSuggestionId);
  const academy = await getAcademySignals(userId, category);
  emitRegistryAnalytics("compare_completed", {
    userId,
    registryId: registry.id,
    category,
    itemIds,
    decision,
    seededBy: deriveSeededBy(compareItems),
    mentorInvolvement,
    mentorId: acceptedMentorId,
    academyModulesCompleted: academy.completedCount,
    academyRelevantModules: academy.relevantModules.map((module) => module.id),
    source: normalizeSource(source),
  });

  return { ok: true };
};
