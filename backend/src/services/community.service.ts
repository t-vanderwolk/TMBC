export type CommunityTopic = {
  id: string;
  title: string;
  replies: number;
  mentor: string;
};

export const getCommunityFeed = async (): Promise<CommunityTopic[]> => {
  // TODO: Replace with Prisma-backed community topics and realtime threads
  return [
    { id: 'topic-1', title: 'Week 28 Nursery Sprint', replies: 42, mentor: 'Kara' },
    { id: 'topic-2', title: 'Feeding gear you actually used', replies: 30, mentor: 'Alex' },
    { id: 'topic-3', title: 'Postpartum boundaries that helped', replies: 18, mentor: 'Maya' },
  ];
};
