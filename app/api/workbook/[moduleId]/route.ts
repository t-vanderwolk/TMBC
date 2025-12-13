import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getUserOrThrow } from "@/lib/auth/getUser";
import { WorkbookEntryType } from "@prisma/client";

type ReflectionContent = {
  responses: Record<string, string>;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { moduleId: string } },
) {
  const user = await getUserOrThrow(request);
  const entry = await prisma.workbookEntry.findUnique({
    where: {
      userId_moduleId_type: {
        userId: user.id,
        moduleId: params.moduleId,
        type: WorkbookEntryType.REFLECTION,
      },
    },
  });

  const responses: Record<string, string> = entry
    ? ((entry.content as ReflectionContent)?.responses ?? {})
    : {};

  const entries = Object.entries(responses).map(([prompt, response]) => ({
    id: entry?.id ?? `${params.moduleId}-${prompt}`,
    prompt,
    response,
  }));

  return NextResponse.json({ entries });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } },
) {
  const user = await getUserOrThrow(request);
  const body = await request.json();
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const responseText = typeof body?.response === "string" ? body.response.trim() : "";

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const existing = await prisma.workbookEntry.findUnique({
    where: {
      userId_moduleId_type: {
        userId: user.id,
        moduleId: params.moduleId,
        type: WorkbookEntryType.REFLECTION,
      },
    },
  });

  const currentResponses: Record<string, string> = existing
    ? ((existing.content as ReflectionContent)?.responses ?? {})
    : {};
  currentResponses[prompt] = responseText;

  const upserted = await prisma.workbookEntry.upsert({
    where: {
      userId_moduleId_type: {
        userId: user.id,
        moduleId: params.moduleId,
        type: WorkbookEntryType.REFLECTION,
      },
    },
    update: {
      content: { responses: currentResponses },
    },
    create: {
      userId: user.id,
      moduleId: params.moduleId,
      type: WorkbookEntryType.REFLECTION,
      content: { responses: currentResponses },
    },
  });

  return NextResponse.json({
    entry: {
      id: upserted.id,
      prompt,
      response: responseText,
    },
  });
}
