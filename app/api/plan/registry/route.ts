import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sections = await prisma.planRegistrySection.findMany({
      include: { items: true },
    });
    return NextResponse.json({ data: sections });
  } catch (error) {
    console.error("/api/plan/registry error", error);
    return NextResponse.json({ data: [] });
  }
}
