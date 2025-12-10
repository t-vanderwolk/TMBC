"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { requireMentor } from "@/lib/auth/requireMentor";
import { useRequireRole } from "@/lib/auth/useRequireRole";

import ChatPanel from "@/components/chat/ChatPanel";
import ConversationList from "@/components/messaging/ConversationList";
import { getMentorDashboard, getMentorMentees } from "@/lib/api/community";
import { getConversations } from "@/lib/api/chat";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";

type MentorOverview = {
  menteesCount: number;
  cohortsCount: number;
  cohorts?: number;
  mentees?: number;
  averageProgress?: number;
  avgProgress?: number;
  mentorNotes?: string[];
  cohortUpdates?: string[];
};

type MentorMentee = {
  id: string;
  name: string;
  journeyStage?: string;
  focus?: string;
  registrySummary?: string;
  progress?: number;
};

const summaryTiles = (overview: MentorOverview | null) => {
  const progressValue = Math.round(
    overview?.averageProgress ?? overview?.avgProgress ?? 0,
  );

  return [
    {
      label: "Active mentees",
      value: overview?.menteesCount ?? overview?.mentees ?? 0,
      detail: "On your roster this season",
    },
    {
      label: "Cohorts",
      value: overview?.cohortsCount ?? overview?.cohorts ?? 0,
      detail: "Concurrent groups you guide",
    },
    {
      label: "Avg progress",
      value: `${progressValue}%`,
      detail: "Across your mentees",
    },
  ];
};

export default function MentorDashboardPage() {
  useRequireRole(["MENTOR"]);

  const [overview, setOverview] = useState<MentorOverview | null>(null);
  const [mentees, setMentees] = useState<MentorMentee[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [searchState, setSearchState] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [currentMentor, setCurrentMentor] = useState<{ id: string; name?: string } | null>(null);
  const { user: guardUser, loading: guardLoading } = requireMentor();
  const { events, isLoading: eventsLoading, error: eventsError, refresh: refreshEvents } =
    useUpcomingEvents();

  useEffect(() => {
    if (!guardUser) return;
    setToken(guardUser.token ?? null);
    setCurrentMentor({ id: guardUser.id, name: guardUser.name });
  }, [guardUser]);
  const [conversations, setConversations] = useState<{
    threadId: string;
    mentorId: string;
    memberId: string;
    lastMessage: string;
    updatedAt: string;
  }[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    Promise.all([getMentorDashboard(token), getMentorMentees(token)])
      .then(([dashboardRes, menteesRes]) => {
        setOverview(dashboardRes.data);
        setMentees(menteesRes.data);
      })
      .catch(() => {
        setError("Unable to refresh your concierge dashboard.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    setThreadsLoading(true);
    setThreadsError("");
    getConversations(token)
      .then((response) => {
        const list = response.data ?? [];
        setConversations(list);
        if (list.length) {
          setActiveConversationId(list[0].threadId);
        }
      })
      .catch(() => {
        setThreadsError("Unable to load conversation threads.");
      })
      .finally(() => {
        setThreadsLoading(false);
      });
  }, [token]);

  const filteredMentees = useMemo(() => {
    if (!searchState) return mentees;
    return mentees.filter((mentee) =>
      mentee.name.toLowerCase().includes(searchState.toLowerCase()),
    );
  }, [mentees, searchState]);

  const threadItems = useMemo(
    () =>
      conversations.map((thread, index) => ({
        id: thread.threadId,
        mentorId: thread.mentorId,
        memberId: thread.memberId,
        name: `Mentee ${index + 1}`,
        detail: thread.lastMessage,
        lastMessage: thread.lastMessage,
        time: new Date(thread.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unread: true,
      })),
    [conversations],
  );

  const activeThread = useMemo(
    () => conversations.find((thread) => thread.threadId === activeConversationId),
    [conversations, activeConversationId],
  );

  if (guardLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm uppercase tracking-[0.5em] text-[#C8A1B4]">
        Curating your mentor concierge…
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-sm text-[#C8A1B4]">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="space-y-10 px-4 py-8 sm:px-6 text-[#3E2F35]">
      <section className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/70">Mentor concierge</p>
        <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">Your Phase 2 command center</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Keep mentees steady with lilac momentum—progress petals, registry cues, and calm mentor updates.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {summaryTiles(overview).map((tile) => (
          <article
            key={tile.label}
            className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)] transition hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(180,143,164,0.35)]"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">{tile.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{tile.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">{tile.detail}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-serif text-[#3E2F35]">Mentees roster</h2>
          <input
            type="text"
            placeholder="Search mentees"
            value={searchState}
            onChange={(event) => setSearchState(event.target.value)}
            className="w-full max-w-sm rounded-full border border-[#E3C6D4] bg-[#FFFAF8]/80 px-4 py-2 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none focus:ring-2 focus:ring-[#F3D8E0]"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentees.map((mentee) => {
            const progress = mentee.progress ?? 0;
            return (
              <article
                key={mentee.id}
                className="flex h-full flex-col justify-between rounded-[2.25rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_20px_60px_rgba(180,143,164,0.25)] transition hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(180,143,164,0.35)]"
              >
                <div className="space-y-2">
                  <p className="text-2xl font-semibold text-[#3E2F35]">{mentee.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
                    {mentee.journeyStage ?? mentee.focus ?? "Journey details"}
                  </p>
                  <p className="text-sm text-[#3E2F35]/70">{mentee.registrySummary ?? "Registry rhythm pending"}</p>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-2 overflow-hidden rounded-full bg-[#FFEAF0]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C8A1B4] to-[#B98AA5]"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]/60">
                    Progress: {Math.round(Math.min(100, Math.max(0, progress)))}%
                  </p>
                  <Link
                    href={`/dashboard/mentor/workspace?memberId=${mentee.id}`}
                    className="text-xs font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:text-[#B98AA5]"
                  >
                    Open mentoring →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[0.4fr,1fr]">
          <aside className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
            <p className="text-xs uppercase tracking-[0.45em] text-[#3E2F35]/60">Conversations</p>
            {threadsLoading ? (
              <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Loading…</p>
            ) : threadsError ? (
              <p className="text-sm text-[#3E2F35]/70">{threadsError}</p>
            ) : (
              <ConversationList
                conversations={threadItems}
                activeId={activeConversationId}
                onSelect={(conversation) => setActiveConversationId(conversation.id)}
              />
            )}
          </aside>
          <div className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
            {activeThread ? (
              <ChatPanel
                mentorId={activeThread.mentorId}
                memberId={activeThread.memberId}
                token={token ?? undefined}
                currentUserId={currentMentor?.id ?? ""}
                currentUserRole="mentor"
                currentUserName={currentMentor?.name}
                label="Mentor concierge"
              />
            ) : (
              <p className="text-sm uppercase tracking-[0.45em] text-[#C8A1B4]">
                Select a thread to chat with a mentee.
              </p>
            )}
          </div>
        </div>

        <article className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
            <p className="text-xs uppercase tracking-[0.45em] text-[#3E2F35]/60">Events</p>
            <h3 className="text-2xl font-semibold text-[#3E2F35]">Upcoming salons</h3>
            {eventsLoading ? (
              <p className="text-sm uppercase tracking-[0.45em] text-[#C8A1B4]">Loading events…</p>
            ) : eventsError ? (
              <p className="text-sm text-[#C8A1B4]">{eventsError}</p>
            ) : (
              <ul className="space-y-4">
                {events.slice(0, 2).map((event) => (
                  <li
                    key={event.id}
                    className="rounded-[1.5rem] border border-[#E3C6D4] bg-[#FFFAF8]/90 p-4"
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/60">
                      {event.format ?? event.type ?? "Event"}
                    </p>
                    <h4 className="text-lg font-semibold text-[#3E2F35]">{event.title}</h4>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">
                      {new Date(event.date).toLocaleString([], { month: "short", day: "numeric" })}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => refreshEvents()}
                        className="rounded-full border border-[#C8A1B4]/60 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/70 transition hover:border-[#B98AA5]"
                      >
                        Refresh events
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-3 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
            <p className="text-xs uppercase tracking-[0.45em] text-[#3E2F35]/60">Mentor notes</p>
            <h3 className="text-2xl font-semibold text-[#3E2F35]">Insights from your studio</h3>
            <p className="text-sm text-[#3E2F35]/70">
              Encourage mentees with small rituals, update their registries, and keep events warm.
            </p>
          </div>
        </article>
      </section>
  </main>
);
}
