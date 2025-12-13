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

  return prompts;
}
