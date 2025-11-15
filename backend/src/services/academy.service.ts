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

export type AcademyModule = {
  id: string;
  trackId: string;
  title: string;
  estTime: string;
  status: 'not_started' | 'in_progress' | 'complete';
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

const modules: AcademyModule[] = [
  {
    id: 'vision-style',
    trackId: 'nursery-foundations',
    title: 'Vision & Style Foundations',
    estTime: '25 min',
    status: 'in_progress',
  },
  {
    id: 'strollers-101',
    trackId: 'gear-mobility',
    title: 'Strollers 101',
    estTime: '30 min',
    status: 'not_started',
  },
  {
    id: 'rest-recovery',
    trackId: 'postpartum-healing',
    title: 'Rest & Recovery',
    estTime: '20 min',
    status: 'complete',
  },
];

export const getAcademyJourneys = async () => {
  // TODO: Replace with Prisma queries once academy tables are ready
  return journeys;
};

export const getAcademyTracks = async () => {
  // TODO: Replace with Prisma track data and relationships
  return tracks;
};

export const getAcademyModules = async () => {
  // TODO: Replace with Prisma module data
  return modules;
};

export const getRecommendedModule = async () => {
  // TODO: Build recommendation engine tied to user progress
  return modules[0];
};
