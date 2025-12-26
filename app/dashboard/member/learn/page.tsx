import { cookies } from "next/headers";

import LearnClient from "./LearnClient";
import type { AcademyModuleCard } from "@/lib/academyClient";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const cookieHeader = cookies().toString();
  let modules: AcademyModuleCard[] = [];
  let error = "";

  try {
    const baseUrl =
      process.env.NEXTAUTH_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";
    const url = new URL("/api/academy/modules", baseUrl);
    const response = await fetch(url.toString(), {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to fetch academy modules");
    }

    const data = await response.json();
    modules = data?.modules ?? [];
    console.log('[Academy] modules loaded:', modules.length);
  } catch {
    error = "Unable to load your academy modules right now.";
  }

  // TMBC Canon:
  // Academy Learn is mobile-first by design.
  // UI prioritizes calm, vertical flow, and one clear action per screen
  // to reduce overwhelm and support mentor-led planning.
  return (
    <main className="space-y-10 px-4 pb-12 text-[#3E2F35] sm:px-6">
      <LearnClient modules={modules} error={error} />
    </main>
  );
}
