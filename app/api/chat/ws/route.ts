import { NextRequest, NextResponse, WebSocketPair } from "next/server";

import { registerChatSocket } from "@/lib/chat/wsServer";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const upgradeHeader = request.headers.get("upgrade");
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
    return NextResponse.json(
      { error: "WebSocket upgrade request expected." },
      { status: 400 },
    );
  }

  const url = new URL(request.url);
  const token =
    url.searchParams.get("token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const conversationId = url.searchParams.get("conversationId");

  if (!token || !conversationId) {
    return NextResponse.json(
      { error: "Missing conversationId or token." },
      { status: 401 },
    );
  }

  const pair = new WebSocketPair();
  const [, server] = Object.values(pair);
  server.accept();

  try {
    await registerChatSocket({ socket: server, conversationId, token });
  } catch (error) {
    server.close(1008, "Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return new NextResponse(null, { status: 101, webSocket: server });
}
