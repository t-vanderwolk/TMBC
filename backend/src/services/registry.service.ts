export type RegistryItem = {
  id: string;
  name: string;
  brand: string;
  status: 'Needed' | 'Reserved' | 'Purchased';
};

const registryItems: RegistryItem[] = [
  { id: 'item-1', name: 'Featherweight Stroller', brand: 'Maison Bébé', status: 'Needed' },
  { id: 'item-2', name: 'Heirloom Rocker', brand: 'Taylor Atelier', status: 'Reserved' },
  { id: 'item-3', name: 'Air Purifier', brand: 'Serein Home', status: 'Purchased' },
];

const registryRecommendations = [
  {
    id: 'rec-1',
    name: 'Cocoon Bassinet',
    reason: 'Pairs with your nursery palette and meets safety specs.',
  },
  {
    id: 'rec-2',
    name: 'Cloud Mini Carrier',
    reason: 'Great for travel days and newborn snuggles.',
  },
];

export const listRegistryItems = async () => {
  // TODO: Replace with Prisma registry table query filtered by user
  return registryItems;
};

export const listRegistryRecommendations = async () => {
  // TODO: Pull concierge recommendations from registry builder service
  return registryRecommendations;
};

export const addRegistryItem = async (payload: { name: string; brand?: string }) => {
  // TODO: Persist registry item via Prisma
  const newItem: RegistryItem = {
    id: `mock-${Date.now()}`,
    name: payload.name,
    brand: payload.brand || 'Custom',
    status: 'Needed',
  };
  registryItems.push(newItem);
  return newItem;
};

export const removeRegistryItem = async (id: string) => {
  // TODO: Remove registry item via Prisma
  const index = registryItems.findIndex((item) => item.id === id);
  if (index >= 0) {
    registryItems.splice(index, 1);
    return { success: true };
  }

  return { success: false, message: 'Item not found' };
};
