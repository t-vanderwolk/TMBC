"use server";

import { getCommunityHighlights } from "@/lib/services/server/community.service";
import { getUserOrThrow } from "@/lib/auth/getUser";

export default async function CommunityHighlightsPanel() {
  const user = await getUserOrThrow();
  const highlights = await getCommunityHighlights(user.id);

  return (
    <section className="space-y-4 rounded-[2.5rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.2)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Community highlights</p>
          <h3 className="text-2xl font-semibold text-[#3E2F35]">Reflections in your studio</h3>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-2xl border border-[#F1D5DA] bg-[#FFF8F6] p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Recent reflections</p>
          {highlights.reflections.length ? (
            <div className="space-y-3">
              {highlights.reflections.map((reflection) => (
                <article key={reflection.id} className="space-y-1 rounded-2xl bg-white/80 p-3">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">{reflection.sectionLabel}</p>
                  <p className="text-[0.85rem] text-[#3E2F35]/80">{reflection.content}</p>
                  <p className="text-[0.6rem] text-[#3E2F35]/60">
                    {reflection.moduleTitle ? `${reflection.moduleTitle} · ` : ""}
                    {new Date(reflection.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#3E2F35]/60">Share a reflection to see it here.</p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-[#F1D5DA] bg-white/90 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Latest mentor note</p>
          {highlights.mentorNote ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#3E2F35]">
                {highlights.mentorNote.mentorName ?? "Mentor"} ·{" "}
                {new Date(highlights.mentorNote.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-[#3E2F35]/80">{highlights.mentorNote.content}</p>
            </div>
          ) : (
            <p className="text-xs text-[#3E2F35]/60">
              Notes from your mentor appear here once they share a reflection.
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-[#F1D5DA] bg-white/90 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Upcoming office hours</p>
          {highlights.upcomingEvent ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#3E2F35]">{highlights.upcomingEvent.title}</p>
              <p className="text-xs text-[#3E2F35]/60">
                {new Date(highlights.upcomingEvent.date).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-[#3E2F35]/60">
                Hosted by {highlights.upcomingEvent.hostName ?? "TMBC"}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#3E2F35]/60">No office hours scheduled yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
