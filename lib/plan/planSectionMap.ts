export const planSectionMap = {
  "mentor-suggestions": {
    title: "Mentor guidance",
    helper: "Guidance from your mentor, based on your goals and progress. Nothing is added without your say.",
  },
  accepted: {
    title: "Decisions in place",
    helper: "Items you've already talked through and feel good about. You can revisit anything here anytime.",
  },
  "onboarding-context": {
    title: "Planning context",
    helper: "Background, preferences, and learning progress to guide planning decisions.",
  },
  "external-registries": {
    title: "Outside registries & references",
    helper: "Other lists or documents you'd like your mentor to consider while planning.",
  },
} as const;

export type PlanSectionKey = keyof typeof planSectionMap;

export const planSectionKeys = {
  mentorSuggestions: "mentor-suggestions",
  accepted: "accepted",
  onboardingContext: "onboarding-context",
  externalRegistries: "external-registries",
} as const;

export const planSectionOrder: PlanSectionKey[] = [
  planSectionKeys.mentorSuggestions,
  planSectionKeys.accepted,
  planSectionKeys.onboardingContext,
  planSectionKeys.externalRegistries,
];
