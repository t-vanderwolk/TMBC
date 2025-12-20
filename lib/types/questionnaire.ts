export const questionnaireStatusValues = ["DRAFT", "COMPLETED", "ARCHIVED"] as const;
export type QuestionnaireStatusValue = (typeof questionnaireStatusValues)[number];

export const QuestionnaireStatus: Record<QuestionnaireStatusValue, QuestionnaireStatusValue> = {
  DRAFT: "DRAFT",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
};

export const questionnaireSourceValues = ["INITIAL", "SETTINGS", "ADMIN_OVERRIDE"] as const;
export type QuestionnaireSourceValue = (typeof questionnaireSourceValues)[number];

export const QuestionnaireSource: Record<QuestionnaireSourceValue, QuestionnaireSourceValue> = {
  INITIAL: "INITIAL",
  SETTINGS: "SETTINGS",
  ADMIN_OVERRIDE: "ADMIN_OVERRIDE",
};
