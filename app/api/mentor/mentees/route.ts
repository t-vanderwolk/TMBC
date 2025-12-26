import { NextResponse } from "next/server";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { getMenteeList } from "@/lib/services/server/mentorCollab.service";

const requireMentor = async () => {
  const user = await getUserOrThrow();
  if (user.role !== "MENTOR" && user.role !== "ADMIN") {
    throw new Error("Only mentors can access mentee lists.");
  }
  return user;
};

const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to load mentees.";
  const status = message.includes("Only mentors") ? 403 : 400;
  return NextResponse.json({ error: message }, { status });
};

export async function GET() {
  try {
    const user = await requireMentor();
    const result = await getMenteeList(user.id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ data: result.data });
  } catch (error) {
    return handleError(error);
  }
}
