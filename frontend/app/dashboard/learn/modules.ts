export type JourneyId = 'nursery' | 'gear' | 'postpartum';

export type AcademyModule = {
  id: string;
  journey: JourneyId;
  track: string;
  title: string;
  description: string;
  order: number;
};

export const journeyMeta: Record<
  JourneyId,
  { label: string; description: string }
> = {
  nursery: {
    label: 'Nursery Journey',
    description:
      'Design serene, functional spaces with concierge-level guidance on furniture, flow, and finishing touches.',
  },
  gear: {
    label: 'Gear Journey',
    description:
      'Feel confident selecting every stroller, carrier, and travel essential with curated Taylor-Made picks.',
  },
  postpartum: {
    label: 'Postpartum Journey',
    description:
      'Map the fourth trimester with warm, realistic support for healing, feeding, relationships, and routines.',
  },
};

const trackDescriptions: Record<string, string> = {
  'nursery:Vision & Foundations':
    'Set your aesthetic direction and functional zones before buying a single piece.',
  'nursery:Core Furniture & Layout':
    'Choose investment pieces, layouts, and seating that support around-the-clock care.',
  'nursery:Atmosphere & Safety':
    'Layer lighting, airflow, and safety checkpoints for a calm, secure space.',
  'nursery:Details & Decor':
    'Elevate textiles, art, and finishing touches for an heirloom-worthy nursery.',
  'nursery:Ready for Baby':
    'Move from plan to reality with final checklists, styling, and transition prep.',
  'nursery:Sleep & Space Series':
    'Dive deeper into sleep environments, routines, and adjustments as baby grows.',
  'gear:Mobility & Bonding':
    'Navigate carriers, strollers, and mobility gear that keep your family moving.',
  'gear:Feeding & Seating':
    'Confidently set up feeding gear with ergonomics, safety, and adaptability in mind.',
  'gear:Travel & Protection':
    'Master car seats, travel systems, and crash-tested peace of mind.',
  'gear:Sleep & Comfort':
    'Curate calming textiles and comfy gear that support naps anywhere.',
  'gear:Bath & Hygiene Essentials':
    'Build spa-level hygiene rituals with smart tools and stylish storage.',
  'postpartum:Healing & Wellness':
    'Prioritize rest, nourishment, and realistic body care through recovery.',
  'postpartum:Feeding & Lactation Wellness':
    'Align feeding goals with practical lactation, pumping, and formula support.',
  'postpartum:Emotional & Relationship Wellness':
    'Protect intimacy, mental clarity, and communication as roles evolve.',
  'postpartum:Family Integration & Adjustment':
    'Gently introduce siblings and pets while rediscovering balance.',
  'postpartum:Support & Care Network':
    'Curate your village with clarity on paid support and personal asks.',
  'postpartum:Baby Health & Hygiene':
    'Decode diapers, baths, and rhythms for calm daily care.',
  'postpartum:Health & Nutrition':
    'Stay nourished with allergy awareness, solid starts, and whole-family fueling.',
};

export const trackOrder: Record<JourneyId, string[]> = {
  nursery: [
    'Vision & Foundations',
    'Core Furniture & Layout',
    'Atmosphere & Safety',
    'Details & Decor',
    'Ready for Baby',
    'Sleep & Space Series',
  ],
  gear: [
    'Mobility & Bonding',
    'Feeding & Seating',
    'Travel & Protection',
    'Sleep & Comfort',
    'Bath & Hygiene Essentials',
  ],
  postpartum: [
    'Healing & Wellness',
    'Feeding & Lactation Wellness',
    'Emotional & Relationship Wellness',
    'Family Integration & Adjustment',
    'Support & Care Network',
    'Baby Health & Hygiene',
    'Health & Nutrition',
  ],
};

export const academyModules: AcademyModule[] = [
  {
    id: 'nursery-vision-style-foundations',
    journey: 'nursery',
    track: 'Vision & Foundations',
    title: 'Vision & Style Foundations',
    description:
      'Define your aesthetic direction, lifestyle needs, and nursery functional zones.',
    order: 1,
  },
  {
    id: 'nursery-comfort-care-stations',
    journey: 'nursery',
    track: 'Vision & Foundations',
    title: 'Comfort & Care Stations',
    description:
      'Plan soothing touchpoints for feeding, changing, and late-night snuggles.',
    order: 2,
  },
  {
    id: 'nursery-organization-storage',
    journey: 'nursery',
    track: 'Vision & Foundations',
    title: 'Nursery Organization & Storage',
    description:
      'Design intuitive storage that keeps diapers, textiles, and keepsakes streamlined.',
    order: 3,
  },
  {
    id: 'nursery-cribs-sleep-spaces',
    journey: 'nursery',
    track: 'Core Furniture & Layout',
    title: 'Cribs & Sleep Spaces',
    description:
      'Choose the right crib, bassinet alternatives, and sleep setups for every room.',
    order: 4,
  },
  {
    id: 'nursery-changing-stations',
    journey: 'nursery',
    track: 'Core Furniture & Layout',
    title: 'Changing Stations',
    description:
      'Build ergonomic, safe stations with storage flows for day and night feeds.',
    order: 5,
  },
  {
    id: 'nursery-seating-gliders',
    journey: 'nursery',
    track: 'Core Furniture & Layout',
    title: 'Seating & Gliders',
    description:
      'Compare gliders, recliners, and chairs that support posture and bonding.',
    order: 6,
  },
  {
    id: 'nursery-dressers-storage',
    journey: 'nursery',
    track: 'Core Furniture & Layout',
    title: 'Dressers & Storage',
    description:
      'Select investment dressers, armoires, and shelving that grow with baby.',
    order: 7,
  },
  {
    id: 'nursery-lighting-sound',
    journey: 'nursery',
    track: 'Atmosphere & Safety',
    title: 'Lighting & Sound',
    description:
      'Layer ambient, task, and night lighting with acoustics that cue rest.',
    order: 8,
  },
  {
    id: 'nursery-sound-machine',
    journey: 'nursery',
    track: 'Atmosphere & Safety',
    title: 'Sound Machine Strategy',
    description:
      'Dial in frequencies, placement, and routines for white-noise harmony.',
    order: 9,
  },
  {
    id: 'nursery-temperature-airflow',
    journey: 'nursery',
    track: 'Atmosphere & Safety',
    title: 'Temperature & Airflow',
    description:
      'Balance humidity, fans, and monitors for safe, cozy sleep environments.',
    order: 10,
  },
  {
    id: 'nursery-safety-zones-hazards',
    journey: 'nursery',
    track: 'Atmosphere & Safety',
    title: 'Safety Zones & Hazards',
    description:
      'Map hazard-free zones and anchoring checklists for every square foot.',
    order: 11,
  },
  {
    id: 'nursery-textiles',
    journey: 'nursery',
    track: 'Details & Decor',
    title: 'Textiles & Layers',
    description:
      'Curate textiles—from sheets to rugs—that elevate comfort and cleanability.',
    order: 12,
  },
  {
    id: 'nursery-wall-decor',
    journey: 'nursery',
    track: 'Details & Decor',
    title: 'Wall Decor',
    description:
      'Blend art, mirrors, and shelving with heirloom quality and safety.',
    order: 13,
  },
  {
    id: 'nursery-theme-cohesion',
    journey: 'nursery',
    track: 'Details & Decor',
    title: 'Theme Cohesion',
    description:
      'Create a cohesive story with palettes, motifs, and sensory elements.',
    order: 14,
  },
  {
    id: 'nursery-personalized-touches',
    journey: 'nursery',
    track: 'Details & Decor',
    title: 'Personalized Touches',
    description:
      'Infuse meaningful customs, keepsakes, and signage that feel bespoke.',
    order: 15,
  },
  {
    id: 'nursery-setup-checklist',
    journey: 'nursery',
    track: 'Ready for Baby',
    title: 'Setup Checklist',
    description:
      'Follow a concierge-approved checklist that keeps install day calm.',
    order: 16,
  },
  {
    id: 'nursery-final-safety-audit',
    journey: 'nursery',
    track: 'Ready for Baby',
    title: 'Final Safety Audit',
    description:
      'Audit anchors, monitor placement, and cords before baby arrives.',
    order: 17,
  },
  {
    id: 'nursery-photo-ready-prep',
    journey: 'nursery',
    track: 'Ready for Baby',
    title: 'Photo-Ready Prep',
    description:
      'Style vignettes, swaddles, and florals for keepsake-worthy shoots.',
    order: 18,
  },
  {
    id: 'nursery-transition-planning',
    journey: 'nursery',
    track: 'Ready for Baby',
    title: 'Transition Planning',
    description:
      'Plan room shifts, shared spaces, and storage for future milestones.',
    order: 19,
  },
  {
    id: 'nursery-choosing-sleep-space',
    journey: 'nursery',
    track: 'Sleep & Space Series',
    title: 'Choosing Sleep Space',
    description:
      'Compare bassinets, mini-cribs, and travel solutions for every room.',
    order: 20,
  },
  {
    id: 'nursery-furniture-toys',
    journey: 'nursery',
    track: 'Sleep & Space Series',
    title: 'Nursery Furniture & Toys',
    description:
      'Select developmentally savvy furniture and curated toy rotations.',
    order: 21,
  },
  {
    id: 'nursery-sleep-training-routines',
    journey: 'nursery',
    track: 'Sleep & Space Series',
    title: 'Sleep Training & Routines',
    description:
      'Learn gentle routines, cue readings, and mentor-approved scripts.',
    order: 22,
  },
  {
    id: 'nursery-adjustment-periods',
    journey: 'nursery',
    track: 'Sleep & Space Series',
    title: 'Adjustment Periods',
    description:
      'Navigate regressions, room moves, and furniture transitions gracefully.',
    order: 23,
  },
  {
    id: 'gear-strollers-101',
    journey: 'gear',
    track: 'Mobility & Bonding',
    title: 'Strollers 101',
    description:
      'Demystify frames, wheels, and city vs. travel builds for daily ease.',
    order: 24,
  },
  {
    id: 'gear-carriers',
    journey: 'gear',
    track: 'Mobility & Bonding',
    title: 'Carriers & Wearable Bonding',
    description:
      'Compare wraps, slings, and structured carriers with fit hacks and safety cues.',
    order: 25,
  },
  {
    id: 'gear-balance-bikes-trikes',
    journey: 'gear',
    track: 'Mobility & Bonding',
    title: 'Balance Bikes & Trikes',
    description:
      'Plan future mobility milestones with mentorship on sizing and storage.',
    order: 26,
  },
  {
    id: 'gear-travel-systems',
    journey: 'gear',
    track: 'Mobility & Bonding',
    title: 'Travel Systems Basics',
    description:
      'Pair strollers, car seats, and accessories for seamless transfers.',
    order: 27,
  },
  {
    id: 'gear-highchair-essentials',
    journey: 'gear',
    track: 'Feeding & Seating',
    title: 'Highchair Essentials',
    description:
      'Discover ergonomic seating, adjustability, and add-ons for every stage.',
    order: 28,
  },
  {
    id: 'gear-choking-awareness',
    journey: 'gear',
    track: 'Feeding & Seating',
    title: 'Choking Awareness & Safe Feeding',
    description:
      'Learn safety frameworks, pacing, and readiness cues for solids.',
    order: 29,
  },
  {
    id: 'gear-bottles-sterilizers',
    journey: 'gear',
    track: 'Feeding & Seating',
    title: 'Bottles & Sterilizers',
    description:
      'Compare bottle systems, sterilizing workflows, and storage solutions.',
    order: 30,
  },
  {
    id: 'gear-feeding-accessories',
    journey: 'gear',
    track: 'Feeding & Seating',
    title: 'Feeding Accessories',
    description:
      'Stock bibs, mats, and prep tools that support BLW, purees, and beyond.',
    order: 31,
  },
  {
    id: 'gear-car-seats-101',
    journey: 'gear',
    track: 'Travel & Protection',
    title: 'Car Seats 101',
    description:
      'Decode infant, convertible, and booster seats with expert-level clarity.',
    order: 32,
  },
  {
    id: 'gear-car-seat-masterclass',
    journey: 'gear',
    track: 'Travel & Protection',
    title: 'The Car Seat Masterclass',
    description:
      'Deep dive into installation, travel hacks, and longevity decisions.',
    order: 33,
  },
  {
    id: 'gear-travel-bags-solutions',
    journey: 'gear',
    track: 'Travel & Protection',
    title: 'Travel Bags & Solutions',
    description:
      'Protect gear with cases, gate-check plans, and concierge packing lists.',
    order: 34,
  },
  {
    id: 'gear-pack-and-play',
    journey: 'gear',
    track: 'Travel & Protection',
    title: 'Pack & Play Essentials',
    description:
      'Choose portable sleep, play, and change setups for every trip.',
    order: 35,
  },
  {
    id: 'gear-wagon-module',
    journey: 'gear',
    track: 'Travel & Protection',
    title: 'Wagon Module',
    description:
      'Compare wagons for adventures, storage hacks, and sibling logistics.',
    order: 36,
  },
  {
    id: 'gear-swaddle-blankets',
    journey: 'gear',
    track: 'Sleep & Comfort',
    title: 'Swaddle Blankets',
    description:
      'Weigh fabrics, closures, and seasonal options for better sleep.',
    order: 37,
  },
  {
    id: 'gear-play-mats-changing-pads',
    journey: 'gear',
    track: 'Sleep & Comfort',
    title: 'Play Mats & Changing Pads',
    description:
      'Style safe play zones with easy-clean materials and storage.',
    order: 38,
  },
  {
    id: 'gear-wearable-sleepers',
    journey: 'gear',
    track: 'Sleep & Comfort',
    title: 'Wearable Sleepers',
    description:
      'Transition from swaddles to sleep sacks with togs and fit tips.',
    order: 39,
  },
  {
    id: 'gear-travel-sleepers',
    journey: 'gear',
    track: 'Sleep & Comfort',
    title: 'Travel Sleepers',
    description:
      'Compare compact sleepers for hotels, grandparents, and road trips.',
    order: 40,
  },
  {
    id: 'gear-baby-tub',
    journey: 'gear',
    track: 'Bath & Hygiene Essentials',
    title: 'Baby Tub Essentials',
    description:
      'Review tub types, supports, and rituals that feel spa-like.',
    order: 41,
  },
  {
    id: 'gear-grooming-tools',
    journey: 'gear',
    track: 'Bath & Hygiene Essentials',
    title: 'Grooming Tools',
    description:
      'Curate gentle clippers, thermometers, and skincare staples.',
    order: 42,
  },
  {
    id: 'gear-diapering-bathroom-setup',
    journey: 'gear',
    track: 'Bath & Hygiene Essentials',
    title: 'Diapering & Bathroom Setup',
    description:
      'Organize diapering carts, pails, and bathroom supports for any home.',
    order: 43,
  },
  {
    id: 'postpartum-rest-recovery',
    journey: 'postpartum',
    track: 'Healing & Wellness',
    title: 'Rest & Recovery',
    description:
      'Create rest rituals, boundaries, and support requests for healing.',
    order: 44,
  },
  {
    id: 'postpartum-pre-baby-body-map',
    journey: 'postpartum',
    track: 'Healing & Wellness',
    title: 'Realistic Pre-Baby Body Map',
    description:
      'Normalize body changes and map gentle re-entry goals with grace.',
    order: 45,
  },
  {
    id: 'postpartum-nutrition-foundations',
    journey: 'postpartum',
    track: 'Healing & Wellness',
    title: 'Nutrition Foundations',
    description:
      'Fuel recovery with pantry staples, meal-train ideas, and hydration.',
    order: 46,
  },
  {
    id: 'postpartum-mood-support',
    journey: 'postpartum',
    track: 'Healing & Wellness',
    title: 'Mood Support',
    description:
      'Spot emotional cues early and line up supportive care plans.',
    order: 47,
  },
  {
    id: 'postpartum-breastfeeding-module',
    journey: 'postpartum',
    track: 'Feeding & Lactation Wellness',
    title: 'Breastfeeding Foundations',
    description:
      'Set up latch support, supplies, and mentor-backed troubleshooting.',
    order: 48,
  },
  {
    id: 'postpartum-pumping-basics',
    journey: 'postpartum',
    track: 'Feeding & Lactation Wellness',
    title: 'Pumping Basics',
    description:
      'Build pumping stations, schedules, and storage game plans.',
    order: 49,
  },
  {
    id: 'postpartum-formula-education',
    journey: 'postpartum',
    track: 'Feeding & Lactation Wellness',
    title: 'Formula Education',
    description:
      'Navigate formulas, prep safety, and combo-feeding confidence.',
    order: 50,
  },
  {
    id: 'postpartum-troubleshooting-issues',
    journey: 'postpartum',
    track: 'Feeding & Lactation Wellness',
    title: 'Troubleshooting Feeding Issues',
    description:
      'Tackle supply dips, clogs, and bottle refusal with concierge tips.',
    order: 51,
  },
  {
    id: 'postpartum-intimacy-relationship',
    journey: 'postpartum',
    track: 'Emotional & Relationship Wellness',
    title: 'Intimacy & Relationship',
    description:
      'Support emotional and physical closeness with scripts and rituals.',
    order: 52,
  },
  {
    id: 'postpartum-communication-tools',
    journey: 'postpartum',
    track: 'Emotional & Relationship Wellness',
    title: 'Communication Tools',
    description:
      'Use TMBC frameworks for alignment, calendars, and expectation setting.',
    order: 53,
  },
  {
    id: 'postpartum-mental-load-management',
    journey: 'postpartum',
    track: 'Emotional & Relationship Wellness',
    title: 'Mental Load Management',
    description:
      'Redistribute invisible labor with concierge-approved delegation plans.',
    order: 54,
  },
  {
    id: 'postpartum-animal-sibling-introduction',
    journey: 'postpartum',
    track: 'Family Integration & Adjustment',
    title: 'Animal & Sibling Introduction',
    description:
      'Prepare pets and siblings for the new baby with gentle scripts.',
    order: 55,
  },
  {
    id: 'postpartum-identity-transitions',
    journey: 'postpartum',
    track: 'Family Integration & Adjustment',
    title: 'Identity Transitions',
    description:
      'Honor shifting identities with journaling and mentor reflection.',
    order: 56,
  },
  {
    id: 'postpartum-rebalancing-roles',
    journey: 'postpartum',
    track: 'Family Integration & Adjustment',
    title: 'Rebalancing Roles',
    description:
      'Co-create household roles, budgets, and routines with clarity.',
    order: 57,
  },
  {
    id: 'postpartum-doulas-nannies',
    journey: 'postpartum',
    track: 'Support & Care Network',
    title: 'Doulas, Wet Nurses & Nannies',
    description:
      'Learn how to vet, hire, and support your professional care team.',
    order: 58,
  },
  {
    id: 'postpartum-how-to-ask-for-help',
    journey: 'postpartum',
    track: 'Support & Care Network',
    title: 'How to Ask for Help',
    description:
      'Craft mentor-tested scripts for friends, family, and support circles.',
    order: 59,
  },
  {
    id: 'postpartum-when-to-call-professional',
    journey: 'postpartum',
    track: 'Support & Care Network',
    title: 'When to Call a Professional',
    description:
      'Spot red flags and know when to loop in pros for medical or emotional care.',
    order: 60,
  },
  {
    id: 'postpartum-baby-poop-hygiene',
    journey: 'postpartum',
    track: 'Baby Health & Hygiene',
    title: 'Baby Poop & Hygiene',
    description:
      'Decode diapers, rash prevention, and bath rituals without anxiety.',
    order: 61,
  },
  {
    id: 'postpartum-bathing-basics',
    journey: 'postpartum',
    track: 'Baby Health & Hygiene',
    title: 'Bathing Basics',
    description:
      'Learn sink vs. tub setups, skincare support, and calming cues.',
    order: 62,
  },
  {
    id: 'postpartum-day-night-routines',
    journey: 'postpartum',
    track: 'Baby Health & Hygiene',
    title: 'Day/Night Routines',
    description:
      'Craft rhythms that protect circadian cues for the whole family.',
    order: 63,
  },
  {
    id: 'postpartum-allergies-module',
    journey: 'postpartum',
    track: 'Health & Nutrition',
    title: 'Allergies Module',
    description:
      'Introduce allergens with confidence and track reactions calmly.',
    order: 64,
  },
  {
    id: 'postpartum-introducing-solids',
    journey: 'postpartum',
    track: 'Health & Nutrition',
    title: 'Introducing Solids',
    description:
      'Build a solids roadmap with portion ideas and sensory exploration.',
    order: 65,
  },
  {
    id: 'postpartum-nutrition-mom-baby',
    journey: 'postpartum',
    track: 'Health & Nutrition',
    title: 'Nutrition for Mom & Baby',
    description:
      'Nourish the whole family with menu templates and supplement clarity.',
    order: 66,
  },
];

export const getTrackDescription = (journey: JourneyId, track: string) =>
  trackDescriptions[`${journey}:${track}`] || '';

export const findModuleById = (moduleId: string) =>
  academyModules.find((module) => module.id === moduleId);
