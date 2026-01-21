import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notes = await prisma.planMentorNote.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: notes });
  } catch (error) {
    console.error("/api/plan/mentor-notes GET error", error);
    return NextResponse.json({ data: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const note = await prisma.planMentorNote.create({ data: body });
    return NextResponse.json({ data: note });
  } catch (error) {
    console.error("/api/plan/mentor-notes POST error", error);
    return NextResponse.json({ data: null });
  }
}
