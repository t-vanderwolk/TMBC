import http, { IncomingMessage } from 'http';
import { WebSocket, WebSocketServer, Data } from 'ws';

import { verifyToken } from '../utils/jwt';
import { Role } from '@prisma/client';
import { createChatMessage, ChatMessagePayload } from '../services/chat.service';

const channelClients = new Map<string, Set<WebSocket>>();
const metaStore = new WeakMap<WebSocket, { channelKey: string; userId: string; role: string }>();

const getChannelKey = (mentorId: string, memberId: string) => `${mentorId}:${memberId}`;

const registerClient = (channelKey: string, ws: WebSocket, userId: string, role: string) => {
  if (!channelClients.has(channelKey)) {
    channelClients.set(channelKey, new Set());
  }
  channelClients.get(channelKey)!.add(ws);
  metaStore.set(ws, { channelKey, userId, role });
};

const unregisterClient = (ws: WebSocket) => {
  const meta = metaStore.get(ws);
  if (!meta) return;
  const set = channelClients.get(meta.channelKey);
  if (set) {
    set.delete(ws);
    if (!set.size) {
      channelClients.delete(meta.channelKey);
    }
  }
  metaStore.delete(ws);
};

export const broadcastChatMessage = (message: ChatMessagePayload) => {
  const key = getChannelKey(message.mentorId, message.memberId);
  const payload = JSON.stringify({ type: 'message', data: message });
  const set = channelClients.get(key);
  if (!set) return;
  for (const client of set) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
};

const parseToken = (token: string) => {
  try {
    return verifyToken(token) as { userId?: string; role?: string };
  } catch {
    return null;
  }
};

const validateConnection = (mentorId: string, memberId: string, tokenPayload: { userId?: string; role?: string } | null) => {
  if (!tokenPayload) return null;
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

const handleIncomingMessage = async (raw: string, ws: WebSocket) => {
  const meta = metaStore.get(ws);
  if (!meta) return;

  let payload: { type?: string; data?: any };
  try {
    payload = JSON.parse(raw);
  } catch {
    return;
  }

  if (payload.type !== 'send-message') return;

  const { mentorId, memberId, content } = payload.data || {};
  if (!mentorId || !memberId || typeof content !== 'string' || !content.trim()) return;

  const normalizedRole = meta.role === 'mentor' ? Role.MENTOR : Role.MEMBER;
  const message = await createChatMessage({
    mentorId,
    memberId,
    senderId: meta.userId,
    senderRole: normalizedRole,
    content: content.trim(),
  });

  broadcastChatMessage(message);
};

export const initChatWebSocket = (server: http.Server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const pathname = request.url ? new URL(request.url, 'http://localhost').pathname : '';
    if (pathname !== '/ws/chat') {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
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

    ws.on('message', (message: Data) => {
      const normalizedBuffer =
        typeof message === 'string'
          ? Buffer.from(message)
          : Buffer.isBuffer(message)
          ? message
          : Buffer.from(new Uint8Array(message as ArrayBufferLike));
      const bufferPayload = normalizedBuffer.toString();
      void handleIncomingMessage(bufferPayload, ws);
    });

    ws.on('close', () => {
      unregisterClient(ws);
    });
  });
};
