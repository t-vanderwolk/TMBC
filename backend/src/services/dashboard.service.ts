type DashboardOverview = {
  greeting: string;
  progress: {
    academy: number;
    registry: number;
  };
  weeklyChecklist: string[];
  affiliatePerks: Array<{
    name: string;
    code: string;
    notes: string;
  }>;
};

export const getDashboardOverview = async (userName?: string): Promise<DashboardOverview> => {
  const safeName = userName?.split(' ')[0] || 'Friend';

  // TODO: Replace placeholder data with Prisma-backed dashboard overview queries
  return {
    greeting: `Hi, ${safeName}! Let’s get you ready for baby.`,
    progress: {
      academy: 52,
      registry: 35,
    },
    weeklyChecklist: [
      'Upload nursery photos for mentor review',
      'Confirm registry handoff call',
      'Complete Feeding & Seating workbook',
      'Submit concierge availability',
    ],
    affiliatePerks: [
      {
        name: 'Maison Bébé Bassinet Bundle',
        code: 'TMBC10',
        notes: 'Complimentary rush delivery',
      },
      {
        name: 'Cocoon & Co. Nursing Capsule',
        code: 'TAYLORVIP',
        notes: 'Save 15% through Sunday',
      },
    ],
  };
};
