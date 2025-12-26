"use server";

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Onboarding results are mentor-only context; no registry suggestions are generated." },
    { status: 410 },
  );
}
