type JournalEntry = {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
};

const entries: JournalEntry[] = [];

export const listJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  // INTENTIONAL: In-memory journal entries stay until the append-only journal table ships.
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
  // INTENTIONAL: Persist via Prisma and lock previous entries once journal storage is available.
  return entry;
};
