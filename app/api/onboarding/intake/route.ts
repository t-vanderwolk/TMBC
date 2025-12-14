"use server";

import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { saveIntakeStep as persistIntake } from "@/lib/services/onboarding.service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const payload = typeof body === "object" && body !== null ? body : {};
  const user = await getUserOrThrow();

  const step = typeof payload.step === "string" ? payload.step : "step";
  const nextStep = typeof payload.nextStep === "string" ? payload.nextStep : undefined;

  const responses: Record<string, string> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    responses[key] = value.toString();
  });

  const tags = await persistIntake(user.id, {
    step,
    responses,
  });

  return NextResponse.json({
    ok: true,
    nextStep,
    tags,
  });
}
