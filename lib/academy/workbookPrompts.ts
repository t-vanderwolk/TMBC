export type AcademyModuleSectionSnapshot = {
  title?: string;
  content?: string;
  body?: string;
};

import type { WorkbookSection } from '@prisma/client';

export type WorkbookPrompt = {
  id: string;
  title: string;
  prompt: string;
  section: WorkbookSection;
};

// TMBC Canon:
// Workbook prompts collect planning intelligence shared with mentors.
// They are not private journaling and are not keepsakes.
// Responses inform mentor judgment but never trigger automation.
export function deriveWorkbookPrompts(sections?: AcademyModuleSectionSnapshot[]) {
  if (!Array.isArray(sections) || sections.length < 3) {
    return [];
  }

  const prompts = sections
    .map((section) => {
      if (!section?.title) return null;
      const prompt = (section.body ?? section.content ?? "").trim();
      if (!prompt) return null;
      const normalized = section.title.toLowerCase();
      let sectionType: WorkbookSection = 'REFLECT';
      if (normalized.includes('apply')) sectionType = 'APPLY';
      else if (normalized.includes('integrate')) sectionType = 'INTEGRATE';
      return {
        id: section.title.toLowerCase(),
        title: section.title,
        prompt,
        section: sectionType,
      };
    })
    .filter((entry): entry is WorkbookPrompt => Boolean(entry));

  if (prompts.length !== sections.length) {
    return [];
  }

  const supplementalPrompts: WorkbookPrompt[] = [
    {
      id: 'space-photo',
      title: 'Photo or sketch',
      prompt: 'Add a link to a photo or describe the space you are planning for.',
      section: 'APPLY',
    },
    {
      id: 'key-measurements',
      title: 'Key measurements',
      prompt: 'Capture the key measurements (room size, door widths, or furniture dimensions).',
      section: 'APPLY',
    },
  ];

  return [...prompts, ...supplementalPrompts];
}
