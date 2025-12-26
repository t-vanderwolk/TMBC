export type QuestionOption = {
  label: string;
  value: string;
};

export type QuestionnaireQuestionType = "single" | "multi";

export type QuestionnaireQuestion = {
  id: string;
  label: string;
  description?: string;
  type: QuestionnaireQuestionType;
  options: QuestionOption[];
  required?: boolean;
  dependsOn?: {
    id: string;
    value: string | string[];
  };
};

export type QuestionnaireSection = {
  id: string;
  title: string;
  summary: string;
  questions: QuestionnaireQuestion[];
};

export type QuestionnaireSchema = {
  version: string;
  sections: QuestionnaireSection[];
};

export const QUESTIONNAIRE_SCHEMA: QuestionnaireSchema = {
  version: "2.0",
  sections: [
    {
      id: "home_environment",
      title: "Home & environment",
      summary: "Tell us about your living space so we can tailor your setup.",
      questions: [
        {
          id: "livingSpaceType",
          label: "Living space type",
          type: "single",
          required: true,
          options: [
            { label: "Apartment", value: "APARTMENT" },
            { label: "Condo", value: "CONDO" },
            { label: "Townhome", value: "TOWNHOME" },
            { label: "House", value: "HOUSE" },
          ],
        },
        {
          id: "spaceSize",
          label: "Home size",
          type: "single",
          required: true,
          options: [
            { label: "Small", value: "SMALL" },
            { label: "Medium", value: "MEDIUM" },
            { label: "Large", value: "LARGE" },
          ],
        },
        {
          id: "stairAccess",
          label: "Stairs present",
          type: "single",
          required: true,
          options: [
            { label: "None", value: "NONE" },
            { label: "A few steps", value: "FEW" },
            { label: "Full flight", value: "FULL_FLIGHT" },
          ],
        },
      ],
    },
    {
      id: "transportation",
      title: "Transportation",
      summary: "Share your daily travel setup for gear fit and portability.",
      questions: [
        {
          id: "primaryVehicleType",
          label: "Primary vehicle type",
          type: "single",
          required: true,
          options: [
            { label: "Sedan", value: "SEDAN" },
            { label: "SUV", value: "SUV" },
            { label: "Minivan", value: "MINIVAN" },
            { label: "Truck", value: "TRUCK" },
            { label: "No vehicle", value: "NONE" },
          ],
        },
        {
          id: "secondaryVehicleType",
          label: "Secondary vehicle type (optional)",
          type: "single",
          options: [
            { label: "Sedan", value: "SEDAN" },
            { label: "SUV", value: "SUV" },
            { label: "Minivan", value: "MINIVAN" },
            { label: "Truck", value: "TRUCK" },
            { label: "No secondary vehicle", value: "NONE" },
          ],
        },
        {
          id: "caregiverHeightRange",
          label: "Caregiver height range",
          description: "Select all that apply for the caregivers using daily gear.",
          type: "multi",
          required: true,
          options: [
            { label: "Under 5'4\"", value: "UNDER_5_4" },
            { label: "5'4\" to 5'8\"", value: "FIVE_4_TO_FIVE_8" },
            { label: "5'8\" to 6'0\"", value: "FIVE_8_TO_SIX" },
            { label: "Over 6'0\"", value: "OVER_6" },
          ],
        },
      ],
    },
    {
      id: "care_feeding",
      title: "Care & feeding",
      summary: "Feeding rhythms help us tailor comfort and support essentials.",
      questions: [
        {
          id: "feedingIntent",
          label: "Feeding intent",
          type: "single",
          required: true,
          options: [
            { label: "Breastfeeding", value: "BREASTFEEDING" },
            { label: "Formula", value: "FORMULA" },
            { label: "Combination", value: "COMBO" },
            { label: "Undecided", value: "UNDECIDED" },
          ],
        },
        {
          id: "feedingCaregivers",
          label: "Primary caregivers feeding baby",
          description: "Choose everyone who may share feeding responsibilities.",
          type: "multi",
          required: true,
          options: [
            { label: "Parent", value: "PARENT" },
            { label: "Partner", value: "PARTNER" },
            { label: "Family member", value: "FAMILY" },
            { label: "Night nurse", value: "NIGHT_NURSE" },
            { label: "Doula", value: "DOULA" },
            { label: "Nanny", value: "NANNY" },
          ],
        },
      ],
    },
    {
      id: "family_support",
      title: "Family & support",
      summary: "Knowing your support network helps us prioritize what matters.",
      questions: [
        {
          id: "supportSystem",
          label: "Support system",
          type: "multi",
          required: true,
          options: [
            { label: "Partner", value: "PARTNER" },
            { label: "Family nearby", value: "FAMILY_NEARBY" },
            { label: "Friends", value: "FRIENDS" },
            { label: "Night nurse", value: "NIGHT_NURSE" },
            { label: "Doula", value: "DOULA" },
          ],
        },
        {
          id: "olderSiblings",
          label: "Older siblings in the home",
          type: "single",
          required: true,
          options: [
            { label: "Yes", value: "YES" },
            { label: "No", value: "NO" },
          ],
        },
        {
          id: "siblingAgeRanges",
          label: "Sibling age ranges",
          type: "multi",
          options: [
            { label: "Under 3", value: "UNDER_3" },
            { label: "3 to 5", value: "THREE_TO_FIVE" },
            { label: "6 to 8", value: "SIX_TO_EIGHT" },
            { label: "9 and up", value: "NINE_PLUS" },
          ],
          dependsOn: {
            id: "olderSiblings",
            value: "YES",
          },
        },
        {
          id: "animalsInHome",
          label: "Animals in the home",
          description: "Select all that apply.",
          type: "multi",
          options: [
            { label: "Dog", value: "DOG" },
            { label: "Cat", value: "CAT" },
            { label: "Other", value: "OTHER" },
          ],
        },
      ],
    },
    {
      id: "registry_context",
      title: "Registry context",
      summary: "Let us know what you already have so we can fill the gaps.",
      questions: [
        {
          id: "gearAlreadyPurchased",
          label: "Have you already purchased gear?",
          type: "single",
          required: true,
          options: [
            { label: "Yes", value: "YES" },
            { label: "No", value: "NO" },
          ],
        },
        {
          id: "gearAlreadyGifted",
          label: "Have you already been gifted gear?",
          type: "single",
          required: true,
          options: [
            { label: "Yes", value: "YES" },
            { label: "No", value: "NO" },
          ],
        },
        {
          id: "categoriesInterested",
          label: "Categories already interested in",
          type: "multi",
          options: [
            { label: "Mobility", value: "MOBILITY" },
            { label: "Nursery", value: "NURSERY" },
            { label: "Feeding", value: "FEEDING" },
            { label: "Soothing", value: "SOOTHING" },
            { label: "Travel", value: "TRAVEL" },
            { label: "Daily care", value: "DAILY_CARE" },
          ],
        },
      ],
    },
  ],
};
