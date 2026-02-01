import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import ModuleClient from "./ModuleClient";
import { fetchModuleServerSide } from "@/lib/academyClient";

type ModulePageProps = {
  params: {
    moduleId: string;
  };
};

export default async function ModulePage({ params }: ModulePageProps) {
  const cookieHeader = cookies().toString();
  let moduleData = null;

  try {
    const response = await fetchModuleServerSide({
      moduleId: params.moduleId,
      cookie: cookieHeader,
    });
    moduleData = response.module;
  } catch {
    moduleData = null;
  }

  if (!moduleData) {
    return notFound();
  }

  // TMBC Canon:
  // Academy Learn is mobile-first by design.
  // UI prioritizes calm, vertical flow, and one clear action per screen
  // to reduce overwhelm and support mentor-led planning.
  return (
    <div className="space-y-8 px-4 pb-12 pt-6 text-[#3E2F35] sm:px-6">
      <ModuleClient module={moduleData} />
    </div>
  );
}
