"use server";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { saveMemberDetails } from "@/lib/services/server/memberSettings.service";

const profilePayloadSchema = z.object({
  firstName: z.string().max(50).optional().or(z.literal("").transform(() => undefined)),
  lastName: z.string().max(50).optional().or(z.literal("").transform(() => undefined)),
  preferredName: z.string().max(50).optional().or(z.literal("").transform(() => undefined)),
  city: z.string().max(100).optional().or(z.literal("").transform(() => undefined)),
  state: z.string().max(100).optional().or(z.literal("").transform(() => undefined)),
  location: z.string().max(150).optional().or(z.literal("").transform(() => undefined)),
  dueDate: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined))
    .refine((value: string | undefined) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Invalid date",
    }),
});

const handleError = (error: unknown, message: string) => {
  const payload = error instanceof Error ? { error: error.message } : { error: message };
  return NextResponse.json(payload, { status: 400 });
};

export async function POST(request: NextRequest) {
  try {
    const user = await getUserOrThrow();
    const payload = profilePayloadSchema.parse(await request.json());
    await saveMemberDetails(user.id, payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error, "Unable to save profile");
  }
}
