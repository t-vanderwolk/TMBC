import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { BLOG_SESSION_COOKIE, BLOG_IMPACT_SLUG } from "@/lib/constants/blogAnalytics";
import { recordBlogInfluenceAction } from "@/lib/services/server/blogInfluence.service";
import { BlogInfluenceActionType } from "@prisma/client";

export const dynamic = "force-dynamic";

const splitFullName = (name: string) => {
  const normalized = name.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return { firstName: null, lastName: null };
  }

  const [firstName, ...rest] = normalized.split(" ");
  const lastName = rest.join(" ");
  return {
    firstName: firstName || null,
    lastName: lastName || null,
  };
};

const formatMessage = (city?: string | null, dueDate?: string | null, referral?: string | null) => {
  const parts: string[] = [];
  if (city) parts.push(`City: ${city}`);
  if (dueDate) parts.push(`Due date: ${dueDate}`);
  if (referral) parts.push(`Referral: ${referral}`);
  return parts.length > 0 ? parts.join(" · ") : null;
};

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown> | null = null;
  try {
    payload = await request.json();
  } catch (_error) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 },
    );
  }

  const email = String(payload?.email ?? "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 },
    );
  }

  const name = String(payload?.name ?? "").trim();
  const { firstName, lastName } = splitFullName(name);
  const city = typeof payload?.city === "string" ? payload.city.trim() : undefined;
  const dueDate = typeof payload?.dueDate === "string" ? payload.dueDate.trim() : undefined;
  const referral = typeof payload?.referral === "string" ? payload.referral.trim() : undefined;
  const message = formatMessage(city, dueDate, referral);

  const sessionId = cookies().get(BLOG_SESSION_COOKIE)?.value ?? null;
  const existing = await prisma.inviteRequest.findUnique({ where: { email } });
  if (existing) {
    void recordBlogInfluenceAction({
      slug: BLOG_IMPACT_SLUG,
      action: BlogInfluenceActionType.INVITE_REQUEST,
      referenceId: existing.id,
      sessionId,
    });
    return NextResponse.json({ ok: true, requestId: existing.id });
  }

  const created = await prisma.inviteRequest.create({
    data: {
      email,
      firstName,
      lastName,
      message,
    },
  });

  void recordBlogInfluenceAction({
    slug: BLOG_IMPACT_SLUG,
    action: BlogInfluenceActionType.INVITE_REQUEST,
    referenceId: created.id,
    sessionId,
  });

  return NextResponse.json({ ok: true, requestId: created.id });
}
