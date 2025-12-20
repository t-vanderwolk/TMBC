export type QuestionnaireFieldType = "text" | "textarea";

export type QuestionnaireField = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  type: QuestionnaireFieldType;
};

export type QuestionnaireSection = {
  id: string;
  title: string;
  summary: string;
  fields: QuestionnaireField[];
};

export type QuestionnaireSchema = {
  version: string;
  sections: QuestionnaireSection[];
};

export const QUESTIONNAIRE_SCHEMA: QuestionnaireSchema = {
  version: "1.2",
  sections: [
    {
      id: "philosophy",
      title: "Philosophy",
      summary: "What drives your care rhythm during this season?",
      fields: [
        {
          name: "philosophy",
          label: "Describe the core value that guides your parenting practice.",
          placeholder: "Presence, ease, ritual, playful intention…",
          type: "textarea",
          rows: 3,
        },
      ],
    },
    {
      id: "home",
      title: "Home & lifestyle",
      summary: "Tell us about your rituals so we can reflect them in your registry.",
      fields: [
        {
          name: "homeFeeling",
          label: "How would you describe the feeling of your home?",
          placeholder: "Warm blush, collected woods, airy modern, etc.",
          type: "textarea",
          rows: 3,
        },
      ],
    },
    {
      id: "mobility",
      title: "Mobility & outings",
      summary: "Share how often you travel, attend events, or dream of effortless outings.",
      fields: [
        {
          name: "outings",
          label: "What kind of outings do you plan in the first 6 months?",
          placeholder: "Park strolls, city visits, weekend escapes…",
          type: "textarea",
          rows: 3,
        },
      ],
    },
    {
      id: "emotional",
      title: "Emotional check-in",
      summary: "How can we keep your inner rhythm calm and resilient?",
      fields: [
        {
          name: "emotion",
          label: "What emotion are you carrying most right now?",
          placeholder: "Joy, overwhelmed, hopeful…",
          type: "text",
        },
      ],
    },
    {
      id: "budget",
      title: "Budget & focus",
      summary: "Let us know what feels luxe vs. practical so intel lands where it matters.",
      fields: [
        {
          name: "splurge",
          label: "Where do you want to splurge?",
          placeholder: "Nursery armchair, mentor consultations…",
          type: "textarea",
          rows: 3,
        },
      ],
    },
  ],
};
