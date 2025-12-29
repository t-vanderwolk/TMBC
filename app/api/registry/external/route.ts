import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { createExternalRegistry } from "@/lib/services/server/externalRegistry.service";

export async function POST(request: Request) {
  const user = await getUserOrThrow();
  if (user.role !== "MEMBER") {
    return NextResponse.json({ error: "Only members can add external registries." }, { status: 403 });
  }

  try {
    const payload = (await request.json()) as {
      provider?: string;
      title?: string;
      url?: string;
      documentUrl?: string;
      documentLabel?: string;
    };

    const registry = await createExternalRegistry({
      memberId: user.id,
      provider: String(payload.provider ?? ""),
      title: payload.title ?? null,
      url: payload.url ?? null,
      documentUrl: payload.documentUrl ?? null,
      documentLabel: payload.documentLabel ?? null,
    });

    return NextResponse.json({ registry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to add external registry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
