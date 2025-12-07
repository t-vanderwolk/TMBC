"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initChatWebSocket = exports.broadcastChatMessage = void 0;
const ws_1 = require("ws");
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
const chat_service_1 = require("../services/chat.service");
const channelClients = new Map();
const metaStore = new WeakMap();
const getChannelKey = (mentorId, memberId) => `${mentorId}:${memberId}`;
const registerClient = (channelKey, ws, userId, role) => {
    if (!channelClients.has(channelKey)) {
        channelClients.set(channelKey, new Set());
    }
    channelClients.get(channelKey).add(ws);
    metaStore.set(ws, { channelKey, userId, role });
};
const unregisterClient = (ws) => {
    const meta = metaStore.get(ws);
    if (!meta)
        return;
    const set = channelClients.get(meta.channelKey);
    if (set) {
        set.delete(ws);
        if (!set.size) {
            channelClients.delete(meta.channelKey);
        }
    }
    metaStore.delete(ws);
};
const broadcastChatMessage = (message) => {
    const key = getChannelKey(message.mentorId, message.memberId);
    const payload = JSON.stringify({ type: 'message', data: message });
    const set = channelClients.get(key);
    if (!set)
        return;
    for (const client of set) {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(payload);
        }
    }
};
exports.broadcastChatMessage = broadcastChatMessage;
const parseToken = (token) => {
    try {
        return (0, jwt_1.verifyToken)(token);
    }
    catch {
        return null;
    }
};
const validateConnection = (mentorId, memberId, tokenPayload) => {
    if (!tokenPayload)
        return null;
    const userId = String(tokenPayload.userId ?? '');
    const normalizedRole = String(tokenPayload.role ?? '').toLowerCase();
    if ((normalizedRole === 'mentor' || normalizedRole === 'admin') && userId === mentorId) {
        return { userId, role: 'mentor' };
    }
    if (normalizedRole === 'member' && userId === memberId) {
        return { userId, role: 'member' };
    }
    return null;
};
const handleIncomingMessage = async (raw, ws) => {
    const meta = metaStore.get(ws);
    if (!meta)
        return;
    let payload;
    try {
        payload = JSON.parse(raw);
    }
    catch {
        return;
    }
    if (payload.type !== 'send-message')
        return;
    const { mentorId, memberId, content } = payload.data || {};
    if (!mentorId || !memberId || typeof content !== 'string' || !content.trim())
        return;
    const normalizedRole = meta.role === 'mentor' ? client_1.Role.MENTOR : client_1.Role.MEMBER;
    const message = await (0, chat_service_1.createChatMessage)({
        mentorId,
        memberId,
        senderId: meta.userId,
        senderRole: normalizedRole,
        content: content.trim(),
    });
    (0, exports.broadcastChatMessage)(message);
};
const initChatWebSocket = (server) => {
    const wss = new ws_1.WebSocketServer({ server, path: '/ws/chat' });
    wss.on('connection', (ws, request) => {
        const url = new URL(request.url ?? '', 'http://localhost');
        const mentorId = url.searchParams.get('mentorId');
        const memberId = url.searchParams.get('memberId');
        const token = url.searchParams.get('token');
        if (!mentorId || !memberId || !token) {
            ws.close(1008, 'Missing connection info');
            return;
        }
        const tokenPayload = parseToken(token);
        const user = validateConnection(mentorId, memberId, tokenPayload);
        if (!user) {
            ws.close(1008, 'Unauthorized');
            return;
        }
        const channelKey = getChannelKey(mentorId, memberId);
        registerClient(channelKey, ws, user.userId, user.role);
        ws.on('message', (message) => {
            const normalizedBuffer = typeof message === 'string'
                ? Buffer.from(message)
                : Buffer.isBuffer(message)
                    ? message
                    : Buffer.from(new Uint8Array(message));
            const bufferPayload = normalizedBuffer.toString();
            void handleIncomingMessage(bufferPayload, ws);
        });
        ws.on('close', () => {
            unregisterClient(ws);
        });
    });
};
exports.initChatWebSocket = initChatWebSocket;
