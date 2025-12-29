import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { addExternalRegistryNote } from "@/lib/services/server/externalRegistry.service";

export async function POST(
  request: Request,
  { params }: { params: { registryId?: string } },
) {
  const registryId = params?.registryId;
  if (!registryId) {
    return NextResponse.json({ error: "Registry id is required." }, { status: 400 });
  }

  const user = await getUserOrThrow();
  if (user.role !== "MENTOR" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only mentors can add registry notes." }, { status: 403 });
  }

  try {
    const payload = (await request.json()) as { note?: string };
    const note = typeof payload.note === "string" ? payload.note : "";
    const created = await addExternalRegistryNote({
      registryId,
      authorId: user.id,
      note,
    });
    return NextResponse.json({ note: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to add note.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
