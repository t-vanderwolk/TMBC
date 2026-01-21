import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const budget = await prisma.planBudget.findFirst({
      include: { categories: true },
    });
    return NextResponse.json({ data: budget ?? null });
  } catch (error) {
    console.error("/api/plan/budget error", error);
    return NextResponse.json({ data: null });
  }
}
