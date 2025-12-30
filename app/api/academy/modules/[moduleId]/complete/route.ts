import { NextRequest, NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } },
) {
  const user = await getUserOrThrow(request);
  await prisma.academyProgress.upsert({
    where: {
      userId_moduleId: {
        userId: user.id,
        moduleId: params.moduleId,
      },
    },
    update: {
      completed: true,
    },
    create: {
      userId: user.id,
      moduleId: params.moduleId,
      completed: true,
    },
  });

  return NextResponse.json({ completed: true });
}
