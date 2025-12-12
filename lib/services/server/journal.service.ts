type JournalEntry = {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
};

const entries: JournalEntry[] = [];

export const listJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  // TODO: Replace with Prisma journal table (append-only)
  return entries.filter((entry) => entry.userId === userId);
};

export const createJournalEntry = async (userId: string, content: string) => {
  const entry: JournalEntry = {
    id: `entry-${Date.now()}`,
    userId,
    content,
    createdAt: new Date(),
  };
  entries.push(entry);
  // TODO: Persist via Prisma and lock previous entries from editing
  return entry;
};
