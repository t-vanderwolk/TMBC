"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMentorConversationsController = exports.getCurrentConversationController = exports.postMessageController = exports.getConversationController = void 0;
const client_1 = require("@prisma/client");
const chat_server_1 = require("../ws/chat.server");
const chat_service_1 = require("../services/chat.service");
const client_2 = require("../../prisma/client");
const getUser = (req) => req.user || {};
const normalizeRole = (value) => {
    const upper = (value || '').toUpperCase();
    if (upper === 'MENTOR' || upper === 'ADMIN') {
        return client_1.Role.MENTOR;
    }
    return client_1.Role.MEMBER;
};
const isParticipant = (user, mentorId, memberId) => {
    const userId = String(user?.userId ?? user?.id ?? '');
    const role = String(user?.role ?? '').toLowerCase();
    return (role === 'mentor' && userId === mentorId) || (role === 'member' && userId === memberId);
};
const getConversationController = async (req, res) => {
    const { mentorId, memberId } = req.params;
    if (!mentorId || !memberId) {
        return res.status(400).json({ error: 'mentorId and memberId are required' });
    }
    const user = getUser(req);
    if (!isParticipant(user, mentorId, memberId)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const conversation = await (0, chat_service_1.getConversation)(mentorId, memberId);
    return res.json(conversation);
};
exports.getConversationController = getConversationController;
const postMessageController = async (req, res) => {
    const { mentorId, memberId, content } = req.body || {};
    if (!mentorId || !memberId || typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ error: 'mentorId, memberId, and content are required' });
    }
    const user = getUser(req);
    if (!isParticipant(user, mentorId, memberId)) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const senderId = String(user?.userId ?? user?.id ?? '');
    const senderRole = normalizeRole(user?.role);
    const message = await (0, chat_service_1.createChatMessage)({
        mentorId,
        memberId,
        senderId,
        senderRole,
        content: content.trim(),
    });
    (0, chat_server_1.broadcastChatMessage)(message);
    return res.status(201).json(message);
};
exports.postMessageController = postMessageController;
const getCurrentConversationController = async (req, res) => {
    const user = getUser(req);
    const role = String(user?.role ?? '').toLowerCase();
    const memberId = String(user?.userId ?? user?.id ?? '');
    if (role === 'mentor') {
        return res.status(400).json({ error: 'Mentors should use the mentor conversations list' });
    }
    const settings = await client_2.prisma.adminSettings.findUnique({ where: { id: 1 } });
    const mentorId = settings?.defaultMentorId ?? process.env.DEFAULT_MENTOR_ID ?? 'user-mentor';
    const messages = await (0, chat_service_1.getConversation)(mentorId, memberId);
    return res.json({ mentorId, memberId, messages });
};
exports.getCurrentConversationController = getCurrentConversationController;
const getMentorConversationsController = async (req, res) => {
    const user = getUser(req);
    const mentorId = String(user?.userId ?? user?.id ?? '');
    const conversations = await (0, chat_service_1.getMentorConversations)(mentorId);
    return res.json(conversations);
};
exports.getMentorConversationsController = getMentorConversationsController;
