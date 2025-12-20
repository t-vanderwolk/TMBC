export enum WorkbookEntryType {
  JOURNAL = 'JOURNAL',
  MOODBOARD = 'MOODBOARD',
  CHECKLIST = 'CHECKLIST',
  REFLECTION = 'REFLECTION',
}

export type WorkbookEntrySectionType = 'journal' | 'moodboard' | 'checklist' | 'reflection';

export const WORKBOOK_ENTRY_SECTION_TYPES: WorkbookEntrySectionType[] = [
  'journal',
  'moodboard',
  'checklist',
  'reflection',
];
