export type ModuleSection = {
  title: string;
  detail: string;
};

export type JourneyId = "nursery" | "gear" | "postpartum";

export type JourneyMeta = {
  label: string;
  description: string;
};

export const journeyMeta: Record<JourneyId, JourneyMeta> = {
  nursery: {
    label: "Nursery Vision",
    description: "Craft restful spaces with low-light palettes and cozy textures.",
  },
  gear: {
    label: "Gear Atelier",
    description: "Choose carrying, sleeping, and feeding gear with mentor-backed confidence.",
  },
  postpartum: {
    label: "Postpartum Rhythm",
    description: "Restore your body, rituals, and support system with calm coaching.",
  },
};

export type AcademyModule = {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  journey?: JourneyId;
  stage?: string;
  sections?: ModuleSection[];
  bullets?: string[];
  resources?: string[];
  mentorNotes?: string[] | string;
  registryFocus?: string;
  track?: string;
  estimatedMinutes?: number;
  order?: string | number;
  accentColor?: string;
  content?: {
    apply?: string[];
    explore?: string | string[];
    lecture?: string | string[];
    lectureSlides?: string[];
    journalPrompt?: string;
  };
  progress?: number;
  completed?: boolean;
};

export const fallbackModules: AcademyModule[] = [
  {
    id: "nursery",
    title: "Nursery Vision & Mood",
    description: "Design a soothing haven that feels like your own story and nestles your baby in calm.",
    journey: "nursery",
    subtitle: "Mood, layout, and natural light for dreamy naps.",
    registryFocus: "Calm textures & heirloom essentials",
    track: "Design & Comfort",
    estimatedMinutes: 45,
    order: 1,
    accentColor: "#CBA6D6",
    sections: [
      {
        title: "Mood curation",
        detail: "Curate palettes, textures, and scents that echo your family's vibe.",
      },
      {
        title: "Flow & layout",
        detail: "Map traffic, storage, and lighting for restful days and restless nights.",
      },
    ],
    bullets: ["Palette guidance", "Lighting rituals", "Storage map"],
    resources: ["Mood board workbook", "Night-sleep checklist"],
    mentorNotes: ["Remember to soften edges with textiles.", "Light management keeps dreams gentle."],
    content: {
      apply: ["Map lighting preferences", "Choose soft textiles", "Schedule a mentor chat"],
    },
    progress: 50,
    completed: false,
  },
  {
    id: "feeding",
    title: "Feeding Foundations",
    description: "Plan nourishing rituals, pantry staples, and staffing so feeding feels intimate and intentional.",
    journey: "gear",
    subtitle: "Feeding, carrying, and kitchen rituals.",
    registryFocus: "Pantry + prep gear",
    track: "Nourishment",
    estimatedMinutes: 35,
    order: 2,
    accentColor: "#F1C0C7",
    sections: [
      {
        title: "Ritual design",
        detail: "Schedule lactation, pumping, and bottle prep with calm pacing.",
      },
    ],
    bullets: ["Feeding timeline", "Pantry list", "Support tech"],
    resources: ["Feeding log template", "Mentor Q&A deck"],
    mentorNotes: ["Track sensations, not just ounces."],
    content: {
      apply: ["Plan pantry restock", "Set a feeding log", "Book postpartum meal prep"],
    },
    progress: 20,
    completed: false,
  },
];

export const academyModules: AcademyModule[] = fallbackModules;
