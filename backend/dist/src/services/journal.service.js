"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJournalEntry = exports.listJournalEntries = void 0;
const entries = [];
const listJournalEntries = async (userId) => {
    // TODO: Replace with Prisma journal table (append-only)
    return entries.filter((entry) => entry.userId === userId);
};
exports.listJournalEntries = listJournalEntries;
const createJournalEntry = async (userId, content) => {
    const entry = {
        id: `entry-${Date.now()}`,
        userId,
        content,
        createdAt: new Date(),
    };
    entries.push(entry);
    // TODO: Persist via Prisma and lock previous entries from editing
    return entry;
};
exports.createJournalEntry = createJournalEntry;
