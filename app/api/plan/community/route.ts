import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const signals = await prisma.communitySignal.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: signals });
  } catch (error) {
    console.error("/api/plan/community error", error);
    return NextResponse.json({ data: [] });
  }
}
