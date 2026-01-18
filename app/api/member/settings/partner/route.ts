"use server";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { updatePartnerProfile } from "@/lib/services/server/memberSettings.service";

const PARTNER_ROLE_OPTIONS = ["PARTNER", "SPOUSE", "COPARENT"] as const;

const partnerPayloadSchema = z.object({
  name: z.string().max(120).optional().or(z.literal("").transform(() => undefined)),
  roleLabel: z.enum(PARTNER_ROLE_OPTIONS).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().max(600).optional().or(z.literal("").transform(() => undefined)),
});

const handleError = (error: unknown, message: string) => {
  const payload = error instanceof Error ? { error: error.message } : { error: message };
  return NextResponse.json(payload, { status: 400 });
};

export async function POST(request: NextRequest) {
  try {
    const user = await getUserOrThrow();
    const payload = partnerPayloadSchema.parse(await request.json());
    await updatePartnerProfile(user.id, payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error, "Unable to save partner details");
  }
}
