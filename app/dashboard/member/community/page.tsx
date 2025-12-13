import Link from "next/link";

import { Role } from "@prisma/client";

import { getUserOrThrow } from "@/lib/auth/getUser";
import { getCommunityRooms, type CommunityRoomSummary } from "@/lib/services/server/community.service";

const LOCALE_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
};

export default async function MemberCommunityHomePage() {
  const user = await getUserOrThrow();
  const rooms = await getCommunityRooms(user.role);

  const renderMentorPresence = (room: CommunityRoomSummary) => {
    if (room.latestPostAuthorRole && room.latestPostAuthorRole !== Role.MEMBER) {
      return "Mentor presence · Seen earlier today";
    }
    return "Mentor presence · Member-led lounge";
  };

  return (
    <main className="space-y-6">
      <header className="space-y-3 rounded-[2.5rem] border border-[#EAD4D8] bg-[#FFF8F6]/80 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.2)]">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
          Community
        </p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Quiet rooms, calm sharing</h1>
        <p className="text-sm leading-relaxed text-[#3E2F35]/80">
          This is a soft place to share what the Academy sparks today. Posts stay chronological so the tone stays steady.
        </p>
      </header>

      <section className="space-y-4">
        {rooms.length === 0 ? (
          <div className="rounded-2xl border border-[#E3C6D4] bg-white/90 p-6 text-sm text-[#3E2F35]/70">
            We are gently standing by to welcome you into the community. Start a thread from your Academy module to see your room appear here.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {rooms.map((room) => (
              <Link
                key={room.id}
                href={`/dashboard/member/community/${room.id}`}
                className="group"
              >
                <article className="relative h-full space-y-4 rounded-[2.5rem] border border-transparent bg-white/90 p-5 shadow-[0_10px_40px_rgba(200,160,180,0.2)] transition hover:border-[#E3C6D4] hover:shadow-[0_15px_50px_rgba(200,160,180,0.25)]">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                      {room.moduleTitle ? `${room.moduleTitle} · Module` : "Community room"}
                    </p>
                    <span className="text-[0.55rem] uppercase tracking-[0.5em] text-[#3E2F35]/60">
                      {room.minRole === Role.MEMBER ? "Members" : "Mentors"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-[#3E2F35]">{room.name}</h2>
                    {room.description && (
                      <p className="text-sm text-[#3E2F35]/70">{room.description}</p>
                    )}
                    <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
                      {renderMentorPresence(room)}
                    </p>
                  </div>
                  {room.latestPostSnippet && (
                    <div className="space-y-1 rounded-2xl border border-[#F1D5DA] bg-[#FFF8F6] p-4 text-sm text-[#3E2F35]/80">
                      <p className="font-semibold text-[#3E2F35]">Latest</p>
                      <p className="text-sm leading-relaxed">{room.latestPostSnippet}</p>
                      <p className="text-[0.65rem] tracking-[0.3em] text-[#3E2F35]/60">
                        {room.latestPostAuthor || "Member"} ·{" "}
                        {room.latestPostAt
                          ? new Date(room.latestPostAt).toLocaleDateString(undefined, LOCALE_OPTIONS)
                          : "moments ago"}
                      </p>
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
