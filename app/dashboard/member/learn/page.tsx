import { cookies } from "next/headers";

import LearnClient from "./LearnClient";
import { AcademyModuleCard, fetchModulesServerSide } from "@/lib/academyClient";

export default async function LearnPage() {
  const cookieHeader = cookies().toString();
  let modules: AcademyModuleCard[] = [];
  let error = "";

  try {
    const response = await fetchModulesServerSide({ cookie: cookieHeader });
    modules = response.modules ?? [];
  } catch (err) {
    console.error("Academy modules fetch failed:", err);
    error = "Unable to load your academy modules right now.";
  }

  return (
    <main className="space-y-10 px-4 pb-12 text-[#3E2F35] sm:px-6">
      <LearnClient modules={modules} error={error} />
    </main>
  );
}
