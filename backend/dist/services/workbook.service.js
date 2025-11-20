"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkbookEntry = exports.updateWorkbookEntry = exports.listWorkbookEntries = exports.createWorkbookEntry = void 0;
const prisma_1 = require("../utils/prisma");
const sectionToEnumMap = {
    journal: 'JOURNAL',
    moodboard: 'MOODBOARD',
    checklist: 'CHECKLIST',
    reflection: 'REFLECTION',
};
const enumToSectionMap = {
    JOURNAL: 'journal',
    MOODBOARD: 'moodboard',
    CHECKLIST: 'checklist',
    REFLECTION: 'reflection',
};
const mapEntry = (entry) => ({
    id: entry.id,
    moduleId: entry.moduleId,
    type: enumToSectionMap[entry.type],
    content: entry.content,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
});
const createWorkbookEntry = async (payload) => {
    const entry = await prisma_1.prisma.workbookEntry.create({
        data: {
            userId: payload.userId,
            moduleId: payload.moduleId,
            type: sectionToEnumMap[payload.type],
            content: payload.content,
        },
    });
    return mapEntry(entry);
};
exports.createWorkbookEntry = createWorkbookEntry;
const listWorkbookEntries = async (params) => {
    const entries = await prisma_1.prisma.workbookEntry.findMany({
        where: { userId: params.userId, moduleId: params.moduleId },
    });
    return entries.map(mapEntry);
};
exports.listWorkbookEntries = listWorkbookEntries;
const updateWorkbookEntry = async (payload) => {
    const existing = await prisma_1.prisma.workbookEntry.findUnique({
        where: { id: payload.id },
    });
    if (!existing || existing.userId !== payload.userId) {
        throw new Error('Workbook entry not found');
    }
    const entry = await prisma_1.prisma.workbookEntry.update({
        where: { id: payload.id },
        data: {
            content: payload.content,
        },
    });
    return mapEntry(entry);
};
exports.updateWorkbookEntry = updateWorkbookEntry;
const deleteWorkbookEntry = async (payload) => {
    const existing = await prisma_1.prisma.workbookEntry.findUnique({
        where: { id: payload.id },
    });
    if (!existing || existing.userId !== payload.userId) {
        throw new Error('Workbook entry not found');
    }
    await prisma_1.prisma.workbookEntry.delete({ where: { id: payload.id } });
    return true;
};
exports.deleteWorkbookEntry = deleteWorkbookEntry;
