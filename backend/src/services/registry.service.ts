export interface RegistryPick {
  category: string;
  name: string;
  highlight: string;
}

const picks: RegistryPick[] = [
  { category: 'Travel', name: 'Stroller A', highlight: 'Lightweight travel system vetted by mentors.' },
  { category: 'Sleep', name: 'Bassinet B', highlight: 'Breathable materials with concierge-approved setup.' },
  { category: 'Care', name: 'Carrier C', highlight: 'Hands-free newborn carrier sourced from small business.' },
];

export const getRegistryPicks = async () => picks;
