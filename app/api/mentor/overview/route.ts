import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handleError = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unable to load mentor overview.";
  const status = message.includes("Unauthorized") ? 401 : 400;
  return NextResponse.json({ error: message }, { status });
};

export async function GET(request: NextRequest) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== Role.MENTOR && user.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Mentor access required." }, { status: 403 });
    }

    const mentorId = user.id;
    const now = new Date();

    const menteeWhere = { role: Role.MEMBER, mentorId };

    const [
      totalMentees,
      onboardingMentees,
      planningMentees,
      activeMentees,
      journalsShared,
      modulesNeedingReview,
      plansNeedingUpdate,
      upcomingCount,
      nextSession,
      latestMessages,
    ] = await Promise.all([
      prisma.user.count({ where: menteeWhere }),
      prisma.user.count({ where: { ...menteeWhere, onboardingComplete: false } }),
      prisma.user.count({
        where: { ...menteeWhere, onboardingComplete: true, mentorCollabConfirmedAt: null },
      }),
      prisma.user.count({ where: { ...menteeWhere, mentorCollabConfirmedAt: { not: null } } }),
      prisma.journalShare.count({
        where: { mentorId, allowed: true },
      }),
      prisma.mentorTask.count({
        where: {
          mentorId,
          completed: false,
          OR: [
            { type: { contains: "module", mode: "insensitive" } },
            { type: { contains: "academy", mode: "insensitive" } },
            { title: { contains: "module", mode: "insensitive" } },
          ],
        },
      }),
      prisma.mentorTask.count({
        where: {
          mentorId,
          completed: false,
          OR: [
            { type: { contains: "plan", mode: "insensitive" } },
            { type: { contains: "registry", mode: "insensitive" } },
            { title: { contains: "plan", mode: "insensitive" } },
            { title: { contains: "registry", mode: "insensitive" } },
          ],
        },
      }),
      prisma.event.count({
        where: {
          hostId: mentorId,
          status: "scheduled",
          startTime: { gt: now },
        },
      }),
      prisma.event.findFirst({
        where: {
          hostId: mentorId,
          status: "scheduled",
          startTime: { gt: now },
        },
        orderBy: { startTime: "asc" },
        select: { startTime: true },
      }),
      prisma.conversationMessage.findMany({
        where: {
          conversation: {
            participants: {
              some: {
                id: mentorId,
              },
            },
          },
        },
        distinct: ["conversationId"],
        orderBy: [{ conversationId: "asc" }, { createdAt: "desc" }],
        select: {
          sender: { select: { role: true } },
        },
      }),
    ]);

    const messagesNeedingReply = latestMessages.filter(
      (message) => message.sender?.role === Role.MEMBER,
    ).length;

    return NextResponse.json({
      mentor: {
        id: user.id,
        role: user.role,
        status: user.disabled ? "inactive" : "active",
      },
      dailyFocus: {
        messagesNeedingReply,
        // TODO: Track journal review completion instead of using share count.
        journalsShared,
        // TODO: Replace task-type matching with an explicit feedbackRequired flag.
        modulesNeedingReview,
        // TODO: Replace task-type matching with plan status when available.
        plansNeedingUpdate,
      },
      mentees: {
        total: totalMentees,
        onboarding: onboardingMentees,
        planning: planningMentees,
        active: activeMentees,
      },
      circles: {
        upcomingCount,
        nextSessionAt: nextSession?.startTime ?? undefined,
      },
    });
  } catch (error) {
    console.error("[MentorOverview] load failed", { error });
    return handleError(error);
  }
}
