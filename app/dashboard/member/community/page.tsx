import Link from "next/link";

import SectionWrapper from "@/components/dashboard/member/ui/SectionWrapper";
import PageHeader from "@/components/dashboard/member/ui/PageHeader";
import EmptyState from "@/components/dashboard/member/ui/EmptyState";
import { Role } from "@prisma/client";
import { getUserOrThrow } from "@/lib/auth/getUser";
import { getCommunityRooms, type CommunityRoomSummary } from "@/lib/services/server/community.service";

const LOCALE_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
};

const renderMentorPresence = (room: CommunityRoomSummary) => {
  if (room.latestPostAuthorRole && room.latestPostAuthorRole !== Role.MEMBER) {
    return "Mentor presence · Seen earlier today";
  }
  return "Mentor presence · Member-led lounge";
};

export default async function MemberCommunityHomePage() {
  const user = await getUserOrThrow();
  const rooms = await getCommunityRooms(user.role);

  return (
    <main className="space-y-6 px-4 py-8 sm:px-6">
      <PageHeader
        title="Community"
        subtitle="Thoughtful rooms"
        description="Soft spaces curated for reflections, never a feed to scroll. Mentor-led posts help keep the tone calm."
        cta={{ label: "Back to dashboard", href: "/dashboard/member" }}
      />

      <SectionWrapper
        title="Rooms to visit"
        description="Add a reflection, peek at mentor notes, or just rest in the quiet."
        action={{ label: "Start a conversation", href: "/dashboard/member/community", subtle: true }}
      >
        {rooms.length === 0 ? (
          <EmptyState
            title="The rooms are waiting"
            message="Nothing new today — that’s okay. Rest is part of preparation."
          />
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <Link
                key={room.id}
                href={`/dashboard/member/community/${room.id}`}
                className="block"
              >
                <article className="space-y-3 rounded-[28px] border border-[#E3C6D4] bg-white/90 p-4 shadow-sm transition hover:border-[#C8A1B4]">
                  <div className="flex items-center justify-between">
                    <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                      {room.moduleTitle ? `${room.moduleTitle} · Module` : "Community room"}
                    </p>
                    <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
                      {room.minRole === Role.MEMBER ? "Members" : "Mentors"}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-[#3E2F35]">{room.name}</h2>
                  {room.description && (
                    <p className="text-sm text-[#3E2F35]/70">{room.description}</p>
                  )}
                  <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/60">
                    {renderMentorPresence(room)}
                  </p>
                  {room.latestPostSnippet && (
                    <div className="rounded-2xl border border-[#F1D5DA] bg-[#FFF8F6] p-3 text-sm text-[#3E2F35]/80">
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
      </SectionWrapper>
    </main>
  );
}
