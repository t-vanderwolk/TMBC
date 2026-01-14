import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";

const NOTES_PATH = join(process.cwd(), "data", "admin-affiliate-notes.json");

type NotesSchema = {
  partners: Record<string, string | null>;
};

const DEFAULT_CONTENT: NotesSchema = {
  partners: {},
};

const ensureNotesFile = async () => {
  try {
    await readFile(NOTES_PATH, { encoding: "utf-8" });
  } catch {
    await mkdir(dirname(NOTES_PATH), { recursive: true });
    await writeFile(NOTES_PATH, JSON.stringify(DEFAULT_CONTENT, null, 2), { encoding: "utf-8" });
  }
};

const readNotes = async (): Promise<NotesSchema> => {
  await ensureNotesFile();
  try {
    const raw = await readFile(NOTES_PATH, { encoding: "utf-8" });
    return JSON.parse(raw) as NotesSchema;
  } catch {
    await writeFile(NOTES_PATH, JSON.stringify(DEFAULT_CONTENT, null, 2), { encoding: "utf-8" });
    return DEFAULT_CONTENT;
  }
};

export const getPartnerNote = async (partnerId: string): Promise<string | null> => {
  const notes = await readNotes();
  return notes.partners[partnerId] ?? null;
};

export const getAllPartnerNotes = async (): Promise<Record<string, string | null>> => {
  const notes = await readNotes();
  return notes.partners;
};

export const setPartnerNote = async (partnerId: string, note: string | null): Promise<void> => {
  const notes = await readNotes();
  notes.partners[partnerId] = note;
  await writeFile(NOTES_PATH, JSON.stringify(notes, null, 2), { encoding: "utf-8" });
};
