"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMentorNote = exports.getMentorNotesForModule = void 0;
const client_1 = require("../../prisma/client");
const mapMentorNote = (note) => ({
    id: note.id,
    moduleId: note.moduleId,
    memberId: note.memberId,
    mentorId: note.mentorId,
    mentorName: note.mentor?.name || null,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
});
const getMentorNotesForModule = async ({ memberId, moduleId }) => {
    const notes = await client_1.prisma.mentorNote.findMany({
        where: {
            memberId,
            moduleId,
        },
        orderBy: {
            createdAt: 'asc',
        },
        include: {
            mentor: {
                select: {
                    id: true,
                    name: true,
                },
            },
            member: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return notes.map(mapMentorNote);
};
exports.getMentorNotesForModule = getMentorNotesForModule;
const addMentorNote = async ({ memberId, moduleId, mentorId, content }) => {
    const note = await client_1.prisma.mentorNote.create({
        data: {
            memberId,
            moduleId,
            mentorId,
            content,
        },
        include: {
            mentor: {
                select: {
                    id: true,
                    name: true,
                },
            },
            member: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return mapMentorNote(note);
};
exports.addMentorNote = addMentorNote;
