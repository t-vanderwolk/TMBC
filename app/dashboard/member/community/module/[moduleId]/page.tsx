import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getUserOrThrow } from "@/lib/auth/getUser";
import CommunityRoomThread from "../../CommunityRoomThread";
import { ensureModuleRoom, getCommunityRoom } from "@/lib/services/server/community.service";
import { fetchModuleServerSide } from "@/lib/academyClient";

type ModuleDiscussionPageProps = {
  params: {
    moduleId: string;
  };
};

export default async function ModuleDiscussionPage({ params }: ModuleDiscussionPageProps) {
  const cookieHeader = cookies().toString();
  let moduleData = null;

  try {
    const response = await fetchModuleServerSide({
      moduleId: params.moduleId,
      cookie: cookieHeader,
    });
    moduleData = response.module;
  } catch (error) {
    console.error("Failed to load module", error);
  }

  if (!moduleData) {
    return notFound();
  }

  const user = await getUserOrThrow();
  const mentorPrompt = moduleData.subtitle ?? moduleData.description;
  const room = await ensureModuleRoom(moduleData.id, moduleData.title, mentorPrompt);
  const detail = await getCommunityRoom(user.role, room.id);

  return (
    <div className="space-y-6">
      <header className="space-y-3 rounded-[2.5rem] border border-[#EAD4D8] bg-white/90 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.2)]">
        <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#C8A1B4]">Module discussion</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">{moduleData.title}</h1>
        {moduleData.subtitle || moduleData.description ? (
          <p className="text-sm text-[#3E2F35]/70">
            {moduleData.subtitle ?? moduleData.description}
          </p>
        ) : null}
      </header>

      <CommunityRoomThread
        initialRoom={detail}
        userRole={user.role}
        contextLabel={`Module · ${moduleData.title}`}
      />
    </div>
  );
}
