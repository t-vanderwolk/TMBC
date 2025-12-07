export type OnboardingAnswers = {
  dueDate?: string;
  expecting?: 'single' | 'twins' | 'multiples';
  primaryHandler?: 'parent' | 'petite' | 'grandparent' | 'nanny' | 'custom';
  heightConsideration?: string;
  floors?: 'single_story' | 'two_story' | 'multi_story' | string;
  stairs?: 'yes' | 'no' | boolean | string;
  entryway?: string;
  nurserySize?: 'cozy' | 'standard' | 'loft' | string;
  flooring?: 'hardwood' | 'carpet' | 'mixed' | 'outdoor' | string;
  vehicleType?: 'small_sedan' | 'suv' | 'minivan' | 'truck' | 'sedan' | string;
  parking?: string;
  terrain?: string[];
  travelFrequency?: string | number;
  routine?: 'city_runner' | 'outdoor' | 'homebody' | 'hybrid' | string;
  pets?: 'none' | 'dog' | 'cat' | 'small_pet' | string;
  helpers?: string | string[];
  gearStyle?: 'minimal' | 'balanced' | 'maximalist' | string;
};

export type RecommendationsResult = {
  strollers: string[];
  carSeats: string[];
  nursery: string[];
  travel: string[];
};

export type OnboardingProfile = {
  id: string;
  userId: string;
  answers: OnboardingAnswers;
  recommendations: RecommendationsResult;
  status: 'not_started' | 'in_progress' | 'completed' | string;
  createdAt: string;
  updatedAt: string;
};
