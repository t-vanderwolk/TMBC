export type ProductSummary = {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  affiliateUrl: string;
  merchant: string;
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

export type RegistryItemStatus = 'CONSIDERING' | 'ADDED' | 'PURCHASED' | 'REMOVED';
export type RegistrySectionType = 'NURSERY' | 'GEAR' | 'FEEDING' | 'POSTPARTUM' | 'LATER';

export type RegistryItem = {
  id: string;
  productId: string | null;
  quantity: number;
  status: RegistryItemStatus;
  section: RegistrySectionType;
  notes: string | null;
  purchaseSource: string | null;
  myRegistryId: string | null;
  affiliateUrl: string;
  product: ProductSummary;
  mentorNotes: MentorNote[];
  title?: string;
  merchant?: string | null;
  category?: string | null;
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

export type ConflictField = 'quantity' | 'status' | 'customNote' | 'affiliateUrl';
export type RegistryConflict = {
  id: string;
  field: ConflictField;
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
