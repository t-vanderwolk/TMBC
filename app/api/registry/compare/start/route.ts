import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { startRegistryCompare } from "@/lib/services/server/registryCompare.service";

const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to start compare.";
  return NextResponse.json({ error: message }, { status: 400 });
};

export async function POST(request: Request) {
  try {
    const user = await getUserOrThrow(request);
    if (user.role !== "MEMBER") {
      return NextResponse.json({ error: "Only members can compare registry items." }, { status: 403 });
    }
    const payload = (await request.json()) as { itemIds?: string[]; source?: string };
    const itemIds = Array.isArray(payload?.itemIds) ? payload.itemIds.filter(Boolean) : [];
    const uniqueIds = Array.from(new Set(itemIds));
    if (!uniqueIds.length) {
      return NextResponse.json({ error: "Choose at least two items to compare." }, { status: 400 });
    }
    const compare = await startRegistryCompare({
      userId: user.id,
      itemIds: uniqueIds,
      source: payload?.source as any,
    });
    return NextResponse.json(compare);
  } catch (error) {
    return handleError(error);
  }
}
