import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { type PlanRole } from "@/types/plan";

export async function determinePlanRole(request: NextRequest): Promise<PlanRole> {
  try {
    const user = await getUserOrThrow(request);
    if (user.role === "MENTOR") {
      return "mentor";
    }
    return "member";
  } catch {
    return "member";
  }
}

export function respondWithRole(data: Record<string, unknown>, role: PlanRole) {
  return NextResponse.json({ ...data, role });
}
