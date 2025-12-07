"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatMessage = exports.getMentorConversations = exports.getConversation = void 0;
const client_1 = require("../../prisma/client");
const mapMessage = (message) => ({
    id: message.id,
    mentorId: message.mentorId,
    memberId: message.memberId,
    senderId: message.senderId,
    senderRole: message.senderRole.toLowerCase(),
    senderName: message.sender?.name ?? null,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
});
const buildThreadId = (mentorId, memberId) => `${mentorId}:${memberId}`;
const getConversation = async (mentorId, memberId) => {
    const messages = await client_1.prisma.chatMessage.findMany({
        where: { mentorId, memberId },
        orderBy: { createdAt: 'asc' },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return messages.map(mapMessage);
};
exports.getConversation = getConversation;
const getMentorConversations = async (mentorId) => {
    const messages = await client_1.prisma.chatMessage.findMany({
        where: { mentorId },
        orderBy: { createdAt: 'desc' },
    });
    const seen = new Map();
    for (const message of messages) {
        if (seen.has(message.memberId))
            continue;
        seen.set(message.memberId, {
            threadId: buildThreadId(message.mentorId, message.memberId),
            mentorId: message.mentorId,
            memberId: message.memberId,
            lastMessage: message.content,
            updatedAt: message.createdAt.toISOString(),
        });
    }
    return Array.from(seen.values());
};
exports.getMentorConversations = getMentorConversations;
const createChatMessage = async ({ mentorId, memberId, senderId, senderRole, content }) => {
    const message = await client_1.prisma.chatMessage.create({
        data: {
            mentorId,
            memberId,
            senderId,
            senderRole,
            content,
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    return mapMessage(message);
};
exports.createChatMessage = createChatMessage;
