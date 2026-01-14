import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== Role.MENTOR) {
      console.warn("[MentorTasks] unauthorized access", { userId: user.id, role: user.role });
      return NextResponse.json({ error: "Mentor access required." }, { status: 403 });
    }

    return NextResponse.json({
      tasks: [],
      message: "Mentor tasks placeholder",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to validate mentor identity.";
    console.warn("[MentorTasks] auth failed", { error: message });
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
