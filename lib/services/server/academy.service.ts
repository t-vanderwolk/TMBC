export type AcademyJourney = {
  id: string;
  title: string;
  description: string;
};

export type AcademyTrack = {
  id: string;
  journeyId: string;
  title: string;
  summary: string;
};

import { ProductResponse, getProductsByCategories, getProductsByIds } from './product.service';
import { prisma } from '@/lib/prisma';

type AcademyModuleDefinition = {
  id: string;
  trackId: string;
  title: string;
  estTime: string;
  status: 'not_started' | 'in_progress' | 'complete';
  categories: string[];
  recommendedProducts: string[];
  stage: string;
  mentorNotes?: string;
};

export type AcademyModule = Omit<AcademyModuleDefinition, 'recommendedProducts'> & {
  recommendedProducts: ProductResponse[];
};

export type AcademyModuleWithProgress = AcademyModule & {
  completed?: boolean;
};

export type AcademyProgressSummary = {
  completed: number;
  total: number;
};

const journeys: AcademyJourney[] = [
  { id: 'nursery', title: 'Nursery Journey', description: 'Design serene spaces with concierge-level detail.' },
  { id: 'gear', title: 'Gear Journey', description: 'Master mobility, feeding, and travel essentials.' },
  { id: 'postpartum', title: 'Postpartum Journey', description: 'Support healing, nourishment, and adjustment.' },
];

const tracks: AcademyTrack[] = [
  { id: 'nursery-foundations', journeyId: 'nursery', title: 'Vision & Foundations', summary: 'Mood boards, layouts, and rituals.' },
  { id: 'gear-mobility', journeyId: 'gear', title: 'Mobility & Bonding', summary: 'Strollers, carriers, and adventures.' },
  { id: 'postpartum-healing', journeyId: 'postpartum', title: 'Healing & Wellness', summary: 'Rest, nourishment, and mindset.' },
];

const modules: AcademyModuleDefinition[] = [
  {
    id: 'car-seat-masterclass',
    trackId: 'gear-mobility',
    title: 'Car Seat Masterclass',
    estTime: '35 min',
    status: 'in_progress',
    categories: ['infant-car-seat', 'convertible-car-seat', 'travel-car-seat'],
    recommendedProducts: ['nuna-pipa-rx', 'uppababy-mesa-max', 'cybex-cloud-g'],
    stage: '0-12 months',
    mentorNotes: 'Focus on compatibility with your stroller chassis + base installation.',
  },
  {
    id: 'safe-sleep-nursery',
    trackId: 'nursery-foundations',
    title: 'Safe Sleep & Nursery Setup',
    estTime: '28 min',
    status: 'not_started',
    categories: ['bedside-sleeper', 'sound-machine', 'swaddle', 'lounger'],
    recommendedProducts: ['hatch-rest-plus', 'snuggle-me-organic'],
    stage: '3rd trimester prep',
    mentorNotes: 'Layer soothing cues + dimmable lighting for easy overnight feeds.',
  },
  {
    id: 'feeding-essentials',
    trackId: 'postpartum-healing',
    title: 'Feeding Essentials Intensive',
    estTime: '30 min',
    status: 'not_started',
    categories: ['pumping', 'bottle', 'feeding-accessory'],
    recommendedProducts: ['elvie-stride'],
    stage: '0-6 months',
    mentorNotes: 'Keep a pumping cart near your nightstand for easier overnight sessions.',
  },
  {
    id: 'travel-system-lab',
    trackId: 'gear-mobility',
    title: 'Travel System Lab',
    estTime: '32 min',
    status: 'complete',
    categories: ['stroller', 'travel-car-seat'],
    recommendedProducts: ['nuna-pipa-rx'],
    stage: 'Weeks 20-32',
    mentorNotes: 'Compare fold + trunk fit before making the final call.',
  },
  {
    id: 'essentials-refresh',
    trackId: 'postpartum-healing',
    title: 'Fourth Trimester Essentials',
    estTime: '22 min',
    status: 'complete',
    categories: ['essentials', 'lounger'],
    recommendedProducts: ['snuggle-me-organic'],
    stage: 'Weeks 30-40',
    mentorNotes: 'Stock duplicate kits for primary + backup changing zones.',
  },
];

export const getAcademyJourneys = async () => {
  // INTENTIONAL: Academy journeys are static until the curriculum tables land.
  return journeys;
};

export const getAcademyTracks = async () => {
  // INTENTIONAL: Tracks remain static until the curriculum tables land.
  return tracks;
};

export const getAcademyModules = async () => {
  const hydrated = await Promise.all(
    modules.map(async (module) => {
      const recommended = await getProductsByIds(module.recommendedProducts);
      return {
        ...module,
        recommendedProducts: recommended,
      };
    }),
  );

  return hydrated;
};

export const getRecommendedModule = async () => {
  const [first] = await getAcademyModules();
  return first;
};

const normalizeModuleId = (input: string) => input.trim().toLowerCase();

const findModule = (moduleCode: string) => {
  const normalizedCode = normalizeModuleId(moduleCode);
  return modules.find((module) => module.id === normalizedCode);
};

export const getModuleProducts = async (moduleCode: string) => {
  const module = findModule(moduleCode);
  if (!module) {
    throw new Error(`Module ${moduleCode} not found`);
  }

  const products = await getProductsByCategories(module.categories);

  return {
    module,
    products,
  };
};

const dedupeProducts = (products: ProductResponse[]) => {
  const seen = new Set<string>();
  const ordered: ProductResponse[] = [];

  for (const product of products) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    ordered.push(product);
  }

  return ordered;
};

export const getModuleRecommendations = async (moduleCode: string) => {
  const module = findModule(moduleCode);
  if (!module) {
    throw new Error(`Module ${moduleCode} not found`);
  }

  const curated = await getProductsByIds(module.recommendedProducts);
  const categoryProducts = await getProductsByCategories(module.categories);
  const combined = dedupeProducts([...curated, ...categoryProducts]);

  const categoryGroups = module.categories.map((category) => ({
    category,
    products: categoryProducts.filter((product) => product.category === category),
  }));

  return {
    module,
    products: combined,
    categoryGroups,
  };
};

export const getModuleRecommendedProductsList = async (moduleCode: string) => {
  const module = findModule(moduleCode);
  if (!module) {
    throw new Error(`Module ${moduleCode} not found`);
  }

  return getProductsByIds(module.recommendedProducts);
};

export const getModulesWithProgress = async (userId?: string): Promise<AcademyModuleWithProgress[]> => {
  const baseModules = await getAcademyModules();
  if (!userId) return baseModules;

  const progressRecords = await prisma.academyProgress.findMany({
    where: { userId },
    select: {
      moduleId: true,
      completed: true,
    },
  });

  const completedSet = new Set(
    progressRecords.filter((record) => record.completed).map((record) => record.moduleId),
  );

  return baseModules.map((module) => ({
    ...module,
    completed: completedSet.has(module.id),
  }));
};

export const getUserProgressSummary = async (userId?: string): Promise<AcademyProgressSummary> => {
  const total = modules.length;
  if (!userId) {
    return { completed: 0, total };
  }

  const completed = await prisma.academyProgress.count({
    where: {
      userId,
      completed: true,
    },
  });

  return { completed, total };
};

export const completeModuleForUser = async (userId: string, moduleId: string) => {
  const normalized = normalizeModuleId(moduleId);
  const moduleExists = modules.some((module) => module.id === normalized);
  if (!moduleExists) {
    throw new Error(`Module ${moduleId} not found`);
  }

  await prisma.academyProgress.upsert({
    where: {
      userId_moduleId: {
        userId,
        moduleId: normalized,
      },
    },
    update: { completed: true },
    create: { userId, moduleId: normalized, completed: true },
  });

  return normalized;
};
