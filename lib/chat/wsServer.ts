import { WebSocketPair } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/utils/server/jwt";
import {
  ChatMessageDTO,
  sendMessage as createChatMessage,
  toChatMessageDTO,
} from "@/lib/services/server/chat.service";

type ChatSocket = ReturnType<typeof WebSocketPair>[1];

type ChatConnection = {
  socket: ChatSocket;
  conversationId: string;
  userId: string;
};

type ChatRegisterArgs = {
  socket: ChatSocket;
  conversationId: string;
  token: string;
};

class ChatWebSocketServer {
  private connections = new Set<ChatConnection>();
  private conversationMap = new Map<string, Set<ChatConnection>>();

  async register({ socket, conversationId, token }: ChatRegisterArgs) {
    const user = await this.authenticate(token);
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { id: user.id },
        },
      },
      include: {
        participants: true,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found or access denied");
    }

    const connection: ChatConnection = {
      socket,
      conversationId,
      userId: user.id,
    };

    this.connections.add(connection);
    const bucket =
      this.conversationMap.get(conversationId) ?? new Set<ChatConnection>();
    bucket.add(connection);
    this.conversationMap.set(conversationId, bucket);

    const cleanup = () => this.unregister(connection);
    socket.addEventListener("close", cleanup);
    socket.addEventListener("error", cleanup);
    socket.addEventListener("message", (event) => {
      void this.handleSocketMessage(connection, event.data);
    });

    return connection;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ) {
    const sent = await createChatMessage({
      conversationId,
      senderId,
      content,
    });
    const payload = toChatMessageDTO(sent);
    this.broadcast(conversationId, payload);
    return payload;
  }

  private broadcast(conversationId: string, message: ChatMessageDTO) {
    const bucket = this.conversationMap.get(conversationId);
    if (!bucket || bucket.size === 0) {
      return;
    }

    const frame = JSON.stringify({ type: "message", data: message });

    for (const connection of bucket) {
      try {
        connection.socket.send(frame);
      } catch {
        this.unregister(connection);
      }
    }
  }

  private unregister(connection: ChatConnection) {
    this.connections.delete(connection);
    const bucket = this.conversationMap.get(connection.conversationId);
    if (!bucket) return;
    bucket.delete(connection);
    if (bucket.size === 0) {
      this.conversationMap.delete(connection.conversationId);
    }
  }

  private async handleSocketMessage(
    connection: ChatConnection,
    rawData: string | ArrayBuffer,
  ) {
    if (typeof rawData !== "string") return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawData);
    } catch {
      return;
    }

    if (!parsed || typeof parsed !== "object") return;
    const payload = parsed as {
      type?: string;
      data?: { content?: string };
    };

    if (payload.type !== "send-message") return;

    const content =
      typeof payload.data?.content === "string"
        ? payload.data.content.trim()
        : "";

    if (!content) {
      this.sendClientError(connection.socket, "Message cannot be empty.");
      return;
    }

    try {
      await this.sendMessage(connection.conversationId, connection.userId, content);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to send message.";
      this.sendClientError(connection.socket, message);
    }
  }

  private sendClientError(socket: ChatSocket, message: string) {
    try {
      socket.send(JSON.stringify({ type: "error", data: { message } }));
    } catch {
      // ignore silently
    }
  }

  private async authenticate(token: string) {
    const normalized = token.replace(/^Bearer\s+/i, "").trim();
    const payload = verifyToken(normalized);
    const subject = payload?.id;
    if (!subject) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: String(subject) },
    });

    if (!user) {
      throw new Error("Unauthorized");
    }

    return user;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var tmbcChatWebSocketServer: ChatWebSocketServer | undefined;
}

const getChatServer = () => {
  if (!globalThis.tmbcChatWebSocketServer) {
    globalThis.tmbcChatWebSocketServer = new ChatWebSocketServer();
  }
  return globalThis.tmbcChatWebSocketServer;
};

export const registerChatSocket = (args: ChatRegisterArgs) =>
  getChatServer().register(args);

export const createAndBroadcastMessage = (params: {
  conversationId: string;
  senderId: string;
  content: string;
}) => getChatServer().sendMessage(params.conversationId, params.senderId, params.content);
