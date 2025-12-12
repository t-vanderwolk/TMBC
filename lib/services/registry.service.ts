import { prisma } from '@/lib/prisma';

export type RegistryItemInput = {
  category: string;
  title: string;
  image?: string;
  affiliateUrl?: string;
  price?: number;
  reasoning?: string;
  mentorNotes?: string;
  url?: string;
};

const RECOMMENDATION_MAP: Record<string, string> = {
  stroller: 'Designed for nimble walks and city streets.',
  neonatal: 'Cozy details for the first nights home.',
  feeding: 'Gear for intuitive feedings whenever you need calm.',
  soothing: 'Tools to keep evenings fragrant and soft.',
  travel: 'Built for weekend escapes and airport lounges.',
  nursery: 'Soft, layered textiles that feel thoughtful.',
};

export async function getUserRegistry(userId: string) {
  return prisma.registryItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addRegistryItem(userId: string, item: RegistryItemInput) {
  return prisma.registryItem.create({
    data: {
      userId,
      ...item,
      url: item.url ?? item.affiliateUrl ?? 'https://taylor-madebaby.com',
    },
  });
}

export async function removeRegistryItem(userId: string, itemId: string) {
  await prisma.registryItem.deleteMany({
    where: { userId, id: itemId },
  });
}

export async function updateRegistryItem(userId: string, itemId: string, fields: Partial<RegistryItemInput>) {
  return prisma.registryItem.updateMany({
    where: { userId, id: itemId },
    data: fields,
  });
}

export async function syncWithMyRegistry(userId: string) {
  return {
    syncedAt: new Date().toISOString(),
    itemsSynced: 3,
    message: 'Mock sync complete. Mentor updated your map.',
  };
}

export function explainRecommendation(tag: string) {
  return RECOMMENDATION_MAP[tag] ?? 'A thoughtful pick based on your preferences.';
}
