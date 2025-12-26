import { QUESTIONNAIRE_SCHEMA } from "@/lib/onboarding/questionnaireSchema";

export type LifestyleSnapshot = {
  home: {
    livingSpaceType?: string;
    spaceSize?: string;
    stairAccess?: string;
  };
  transportation: {
    primaryVehicleType?: string;
    secondaryVehicleType?: string;
    caregiverHeightRange?: string[];
  };
  careFeeding: {
    feedingIntent?: string;
    feedingCaregivers?: string[];
  };
  familySupport: {
    supportSystem?: string[];
    olderSiblings?: string;
    siblingAgeRanges?: string[];
    animalsInHome?: string[];
  };
  registryContext: {
    gearAlreadyPurchased?: string;
    gearAlreadyGifted?: string;
    categoriesInterested?: string[];
  };
};

const buildOptionLookup = () => {
  const map = new Map<string, Map<string, string>>();
  QUESTIONNAIRE_SCHEMA.sections.forEach((section) => {
    section.questions.forEach((question) => {
      map.set(
        question.id,
        new Map(question.options.map((option) => [option.value, option.label])),
      );
    });
  });
  return map;
};

const optionLookup = buildOptionLookup();

const labelForValue = (questionId: string, value: string | undefined) => {
  if (!value) return undefined;
  return optionLookup.get(questionId)?.get(value) ?? value;
};

const labelsForValues = (questionId: string, values: string[] | undefined) => {
  if (!values?.length) return undefined;
  return values.map((value) => labelForValue(questionId, value) ?? value);
};

const parseMulti = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined;
  return value.filter((entry) => entry != null).map((entry) => String(entry));
};

const parseSingle = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  return value;
};

export const buildLifestyleSnapshot = (answers: Record<string, unknown>): LifestyleSnapshot => {
  return {
    home: {
      livingSpaceType: labelForValue("livingSpaceType", parseSingle(answers.livingSpaceType)),
      spaceSize: labelForValue("spaceSize", parseSingle(answers.spaceSize)),
      stairAccess: labelForValue("stairAccess", parseSingle(answers.stairAccess)),
    },
    transportation: {
      primaryVehicleType: labelForValue("primaryVehicleType", parseSingle(answers.primaryVehicleType)),
      secondaryVehicleType: labelForValue("secondaryVehicleType", parseSingle(answers.secondaryVehicleType)),
      caregiverHeightRange: labelsForValues("caregiverHeightRange", parseMulti(answers.caregiverHeightRange)),
    },
    careFeeding: {
      feedingIntent: labelForValue("feedingIntent", parseSingle(answers.feedingIntent)),
      feedingCaregivers: labelsForValues("feedingCaregivers", parseMulti(answers.feedingCaregivers)),
    },
    familySupport: {
      supportSystem: labelsForValues("supportSystem", parseMulti(answers.supportSystem)),
      olderSiblings: labelForValue("olderSiblings", parseSingle(answers.olderSiblings)),
      siblingAgeRanges: labelsForValues("siblingAgeRanges", parseMulti(answers.siblingAgeRanges)),
      animalsInHome: labelsForValues("animalsInHome", parseMulti(answers.animalsInHome)),
    },
    registryContext: {
      gearAlreadyPurchased: labelForValue("gearAlreadyPurchased", parseSingle(answers.gearAlreadyPurchased)),
      gearAlreadyGifted: labelForValue("gearAlreadyGifted", parseSingle(answers.gearAlreadyGifted)),
      categoriesInterested: labelsForValues("categoriesInterested", parseMulti(answers.categoriesInterested)),
    },
  };
};
