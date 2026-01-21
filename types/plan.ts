export type PlanRole = "member" | "mentor" | "admin";

export interface PlanWorkspaceData {
  meta: {
    role: PlanRole;
    canEdit: boolean;
    canMentor: boolean;
    canReview: boolean;
    canMessage: boolean;
    canViewCommunity: boolean;
  };
  learn: LearnModule[];
  registry: {
    sections: PlanSectionRecord[];
    items: PlanRegistryItemRecord[];
  };
  budget: {
    total: number | null;
    categories: PlanBudgetCategoryRecord[];
  };
  comparisons: ComparisonSnapshot[];
  mentorNotes: MentorNoteRecord[];
  communitySignals: CommunitySignalRecord[];
}

export interface LearnModule {
  moduleId: string;
  title: string;
  journey?: string | null;
  completed: boolean;
  linkedRegistryItems: string[];
}

export interface PlanSectionRecord {
  id: string;
  sectionKey: string;
  decisionState: string;
  readyState: string;
  memberNote?: string | null;
  mentorNote?: string | null;
  items: PlanRegistryItemRecord[];
}

export interface PlanRegistryItemRecord {
  id: string;
  sectionId: string;
  title: string;
  category: string;
  status: string;
  priceMin?: number | null;
  priceMax?: number | null;
}

export interface PlanBudgetCategoryRecord {
  id: string;
  category: string;
  allocated: number;
}

export interface ComparisonSnapshot {
  category: string;
  items: {
    itemId: string;
    retailer: string;
    price: number;
  }[];
}

export interface MentorNoteRecord {
  id: string;
  contextType: string;
  contextId: string;
  content: string;
  authorRole: string;
  createdAt: string;
}

export interface CommunitySignalRecord {
  id: string;
  topic: string;
  summary: string;
  sourceCount: number;
}
