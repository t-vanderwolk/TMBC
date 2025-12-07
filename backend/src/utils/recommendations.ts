export type OnboardingAnswers = {
  dueDate?: string;
  expecting?: 'single' | 'twins' | 'multiples' | string;
  primaryHandler?: 'parent' | 'petite' | 'grandparent' | 'nanny' | 'custom' | string;
  heightConsideration?: string;
  floors?: string;
  stairs?: 'yes' | 'no' | boolean | string;
  entryNotes?: string;
  nurserySize?: string;
  flooring?: string;
  vehicleType?: 'small_sedan' | 'sedan' | 'suv' | 'minivan' | 'truck' | string;
  parking?: string;
  terrain?: string[];
  travelFrequency?: number | string;
  routine?: string;
  pets?: boolean | string;
  helpers?: string[] | string;
  gearStyle?: 'minimalist' | 'moderate' | 'everything' | string;
};

export type RecommendationsResult = {
  strollers: string[];
  carSeats: string[];
  nursery: string[];
  travel: string[];
};

const baseStrollers = [
  'UPPAbaby Vista',
  'Cybex Gazelle S',
  'Nuna TRVL',
  'Babyzen YOYO²',
  'Silver Cross Reef',
  'UPPAbaby Cruz V2',
  'Bugaboo Fox 5',
  'Libelle Compact',
];

const baseCarSeats = ['Nuna Pipa', 'Cybex Cloud Z', 'UPPAbaby MESA', 'Chicco KeyFit 30'];
const baseNursery = [
  'Convertible crib + organic mattress',
  'Smart bassinet with breathable liner',
  'Soft storage baskets',
  'Breathable sleep sacks',
];
const baseTravel = ['Car seat travel bag', 'Portable playard', 'Lightweight travel bassinet'];

const uniqueArray = <T,>(items: T[]): T[] => Array.from(new Set(items));

export function generateRecommendations(answers: OnboardingAnswers): RecommendationsResult {
  let strollers = [...baseStrollers];
  let carSeats = [...baseCarSeats];
  let nursery = [...baseNursery];
  let travel = [...baseTravel];

  const terrainValues = answers.terrain ?? [];
  const terrainNeedsRough = terrainValues.some((option) => /rough|uneven|gravel/i.test(option));
  if (terrainNeedsRough) {
    strollers = strollers.concat(['Bugaboo Fox 5', 'UPPAbaby Vista', 'Silver Cross Reef']);
  }

  const lightweightHandlers = new Set(['petite', 'grandparent', 'nanny']);
  if (answers.primaryHandler && lightweightHandlers.has(answers.primaryHandler)) {
    strollers = strollers.concat(['Nuna TRVL', 'Babyzen YOYO²', 'Libelle Compact']);
  }

  const stairsSensitive = answers.stairs === 'yes' || answers.stairs === true || answers.stairs === 'true';
  if (stairsSensitive) {
    nursery.push('Lightweight rolling bassinet');
  }

  const vehicleType = answers.vehicleType;
  if (vehicleType === 'small_sedan' || vehicleType === 'sedan') {
    strollers = strollers.filter((stroller) => stroller !== 'UPPAbaby Vista' && stroller !== 'Silver Cross Reef');
    strollers = strollers.concat(['UPPAbaby Cruz V2', 'Nuna TRVL']);
  }

  const travelFreq = Number(answers.travelFrequency ?? 0);
  if (!Number.isNaN(travelFreq) && travelFreq >= 2) {
    travel = travel.concat(['Babyzen YOYO² Travel Edition', 'Car seat travel bag', 'Doona Car Seat Stroller']);
    carSeats = carSeats.concat(['Car seat travel bag', 'Doona Car Seat']);
  }

  if (terrainNeedsRough && vehicleType === 'minivan') {
    travel.push('Cargo-ready travel organizer');
  }

  return {
    strollers: uniqueArray(strollers),
    carSeats: uniqueArray(carSeats),
    nursery: uniqueArray(nursery),
    travel: uniqueArray(travel),
  };
}
