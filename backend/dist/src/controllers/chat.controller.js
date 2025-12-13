"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessageController = exports.getMessagesController = exports.getThreadsController = void 0;
const chat_service_1 = require("../services/chat.service");
const getThreadsController = async (req, res) => {
    const user = req.user;
    const threads = await (0, chat_service_1.listThreads)({ userId: user?.userId, role: user?.role });
    res.json(threads);
};
exports.getThreadsController = getThreadsController;
const getMessagesController = async (req, res) => {
    const { threadId } = req.params;
    const items = await (0, chat_service_1.listMessages)(threadId);
    res.json(items);
};
exports.getMessagesController = getMessagesController;
const postMessageController = async (req, res) => {
    const user = req.user;
    const { threadId, text } = req.body;
    if (!threadId || !text) {
        return res.status(400).json({ error: 'threadId and text are required' });
    }
    const author = user?.role === 'mentor' ? 'mentor' : 'member';
    const message = await (0, chat_service_1.createMessage)(threadId, author, text);
    res.status(201).json(message);
};
exports.postMessageController = postMessageController;
