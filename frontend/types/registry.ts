export type ProductSummary = {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  merchant: string;
  moduleCodes: string[];
  price: number | null;
  inStock: boolean;
};

export type MentorNote = {
  id: string;
  note: string;
  mentorId: string;
  mentorName: string | null;
  productId: string;
  createdAt: string;
};

export type RegistryItem = {
  id: string;
  productId: string | null;
  quantity: number;
  status: 'ACTIVE' | 'NEEDED' | 'RESERVED' | 'PURCHASED' | 'PURCHASED_ELSEWHERE' | 'REMOVED_REMOTE';
  notes: string | null;
  purchaseSource: string | null;
  myRegistryId: string | null;
  affiliateUrl: string;
  product: ProductSummary;
  mentorNotes: MentorNote[];
  isCustom: boolean;
  title?: string;
  merchant?: string | null;
  category?: string | null;
  moduleCode?: string | null;
  image?: string | null;
  price?: number | null;
};

export type AcademyModuleMeta = {
  id: string;
  trackId: string;
  title: string;
  estTime: string;
  status: 'not_started' | 'in_progress' | 'complete';
  categories: string[];
  recommendedProducts: ProductSummary[];
  stage: string;
  mentorNotes?: string;
};

export type ModuleRecommendationsResponse = {
  module: AcademyModuleMeta;
  products: ProductSummary[];
  categoryGroups: {
    category: string;
    products: ProductSummary[];
  }[];
};

export type RegistryConflict = {
  id: string;
  field: 'quantity' | 'status' | 'customNote' | 'affiliateUrl';
  localValue: string | null;
  remoteValue: string | null;
  item: {
    id: string;
    title: string;
    myRegistryId: string | null;
    status: RegistryItem['status'];
    url: string;
  };
};

export type RegistrySyncState = {
  lastSyncedAt: string | null;
  conflicts: RegistryConflict[];
};
