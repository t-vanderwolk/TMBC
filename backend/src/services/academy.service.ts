export interface AcademyLesson {
  id: string;
  title: string;
  status: 'available' | 'coming_soon';
  description: string;
}

const lessons: AcademyLesson[] = [
  {
    id: 'prep-101',
    title: 'Concierge Prep 101',
    status: 'available',
    description: 'Onboarding to the TMBC approach with downloadables and mini-audios.',
  },
  {
    id: 'sleep',
    title: 'Sleep Foundations',
    status: 'coming_soon',
    description: 'Mentor-led workshop covering gentle routines and troubleshooting.',
  },
  {
    id: 'registry-lab',
    title: 'Registry Lab',
    status: 'available',
    description: 'Live teardown of real member registries plus concierge office hours.',
  },
];

export const getAcademyLessons = async () => {
  return lessons;
};
