"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ChatPanel from "@/components/chat/ChatPanel";
import DashboardHero from "@/components/dashboard/DashboardHero";
import ProgressFlower from "@/components/dashboard/ProgressFlower";
import { getDashboard } from "@/lib/api/dashboard";
import { EventItem } from "@/lib/api/events";
import { requireMember } from "@/lib/auth/requireMember";
import { useRequireRole } from "@/lib/auth/useRequireRole";

type CommunityUpdate = {
  id: string;
  roomName: string;
  content: string;
  createdAt: string;
};

type ChatPreview = {
  mentorId: string;
  memberId: string;
  lastMessage: string;
  updatedAt: string;
  senderName: string | null;
};

type DashboardOverview = {
  greeting: string;
  progress: {
    academy: number;
    registry: number;
  };
  completedModules: number;
  totalModules: number;
  registryCount: number;
  communityUpdates: CommunityUpdate[];
  suggestions: {
    nextModuleTitle: string | null;
    nextModuleId: string | null;
    needsRegistry: boolean;
    encourageCommunity: boolean;
  };
  weeklyChecklist: string[];
  affiliatePerks: Array<{
    name: string;
    code: string;
    notes: string;
  }>;
  events: EventItem[];
  chatPreview?: ChatPreview | null;
};

const TASKS = [
  {
    id: "academy",
    label: "Continue Academy",
    href: "/dashboard/learn",
    copy: "Revisit your academy rituals.",
  },
  {
    id: "registry",
    label: "Registry Rhythm",
    href: "/dashboard/registry",
    copy: "Track the essentials for your registry.",
  },
  {
    id: "community",
    label: "Community Rooms",
    href: "/dashboard/community",
    copy: "Play with friends in curated rooms.",
  },
  {
    id: "mentor",
    label: "Mentor Circles",
    href: "/dashboard/messages",
    copy: "Mentor events and reminders for you.",
  },
];

const DEFAULT_MENTOR_ID = process.env.NEXT_PUBLIC_DEFAULT_MENTOR_ID ?? "user-mentor";

const formatEventDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

type StoredUser = {
  id: string;
  name?: string;
  role?: string;
  token?: string;
};

export default function DashboardPage() {
  useRequireRole("MEMBER");

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState("Friend");
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const upcomingEvents = overview?.events ?? [];
  const { user: guardUser, loading: guardLoading } = requireMember();

  useEffect(() => {
    if (!guardUser) return;
    setToken(guardUser.token ?? null);
    setCurrentUser(guardUser);
    setUserName(guardUser.name ?? "Friend");
  }, [guardUser]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    getDashboard(token)
      .then((response) => {
        setOverview(response.data);
      })
      .catch(() => {
        setError("Unable to refresh your calm space right now.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const tasks = useMemo(() => {
    if (!overview) return TASKS;
    const nextModuleText = overview.suggestions.nextModuleTitle
      ? `Next up · ${overview.suggestions.nextModuleTitle}`
      : "Continue your Academy bloom.";
    return [
      {
        ...TASKS[0],
        copy: nextModuleText,
        href: overview.suggestions.nextModuleId
          ? `/dashboard/learn/${overview.suggestions.nextModuleId}`
          : TASKS[0].href,
      },
      {
        ...TASKS[1],
        copy: overview.registryCount
          ? `${overview.registryCount} curated pieces`
          : "Add essentials for baby bliss.",
      },
      {
        ...TASKS[2],
        copy: overview.communityUpdates?.[0]
          ? `"${overview.communityUpdates[0].content.slice(0, 80)}"`
          : "Check in with your circles for today.",
      },
      {
        ...TASKS[3],
        copy: overview.weeklyChecklist?.[0] ?? "Mentor invites arriving soon.",
      },
    ];
  }, [overview]);

  const petalTotal = Math.max(overview?.totalModules ?? 6, 1);
  const isMentor = (currentUser?.role ?? "member").toLowerCase() === "mentor";
  const previewMentorId = overview?.chatPreview?.mentorId;
  const previewMemberId = overview?.chatPreview?.memberId;
  const chatPreviewSnippet = overview?.chatPreview?.lastMessage ?? null;
  const chatPreviewSenderName = overview?.chatPreview?.senderName ?? (isMentor ? "Member" : "Mentor");
  const chatMentorId = isMentor
    ? currentUser?.id ?? DEFAULT_MENTOR_ID
    : previewMentorId ?? DEFAULT_MENTOR_ID;
  const chatMemberId = isMentor
    ? previewMemberId ?? currentUser?.id ?? ""
    : currentUser?.id ?? "";

  if (guardLoading || (!token && !overview)) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm uppercase tracking-[0.6em] text-[#C8A1B4]">
        Loading your calm space…
      </div>
    );
  }

  return (
    <main className="space-y-8 px-4 py-8 sm:px-6 text-[#3E2F35]">
      <DashboardHero name={userName} />
      {loading && (
        <div className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-8 text-sm text-[#3E2F35]/70 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
          Fetching the latest from the studio...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)] md:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <p className="text-[0.65rem] uppercase tracking-[0.5em] text-[#3E2F35]/70">
            Academy Bloom
          </p>
          <h2 className="font-serif text-3xl text-[#3E2F35]">
            {overview?.greeting ?? "Welcome"}
          </h2>
          <p className="text-sm text-[#3E2F35]/70">
            Your studio is curated with mauve moments, soft glow, and the intuition you bring to this
            journey.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-[#3E2F35]/80">
            <span>Academy {overview?.progress.academy ?? 0}%</span>
            <span>Registry {overview?.progress.registry ?? 0} items</span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <ProgressFlower completed={overview?.completedModules ?? 0} total={petalTotal} />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold uppercase tracking-[0.4em] text-[#3E2F35]/60">
            Your next invitations
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="flex flex-col justify-between gap-4 rounded-[2rem] border border-[#E3C6D4] bg-white/80 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.25)] transition hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(180,143,164,0.3)]"
            >
              <div className="space-y-2">
                <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                  {task.label}
                </p>
                <p className="text-sm text-[#3E2F35]/80">{task.copy}</p>
              </div>
              <Link
                href={task.href}
                className="text-xs font-semibold uppercase tracking-[0.4em] text-[#3E2F35] transition hover:text-[#C8A1B4]"
              >
                Open →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="space-y-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.25)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#3E2F35]/60">Events</p>
              <h3 className="text-2xl font-semibold text-[#3E2F35]">Upcoming gatherings</h3>
            </div>
            <Link
              href="/dashboard/events"
              className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4] hover:text-[#B98AA5]"
            >
              See all events →
            </Link>
          </div>
          {loading ? (
            <p className="text-sm uppercase tracking-[0.45em] text-[#C8A1B4]">Loading events…</p>
          ) : !upcomingEvents.length ? (
            <p className="text-sm text-[#3E2F35]/60">We’re crafting something special soon.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="rounded-[1.75rem] border border-[#E3C6D4] bg-[#FFFAF8]/80 p-4 shadow-[0_10px_30px_rgba(180,143,164,0.15)]"
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">
                      {event.format ?? event.type ?? "Studio session"}
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#3E2F35]/50">
                      {event.status ?? "Scheduled"}
                    </span>
                  </div>
                  <h4 className="mt-2 text-lg font-semibold text-[#3E2F35]">{event.title ?? event.id}</h4>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">
                    {formatEventDate(event.date)}
                  </p>
                  <p className="mt-1 text-sm text-[#3E2F35]/70">{event.description}</p>
                  <p className="mt-1 text-xs text-[#3E2F35]/60">Host: {event.hostName ?? "TMBC"}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="space-y-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.25)]">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#3E2F35]/60">Mentor chat</p>
            <h3 className="text-2xl font-semibold text-[#3E2F35]">Stay aligned with your mentor</h3>
            <p className="text-sm text-[#3E2F35]/70">
              Whisper updates, get quick approvals, or share wins through a private thread.
            </p>
            {chatPreviewSnippet && (
              <p className="text-sm text-[#3E2F35]/65">
                Last from {chatPreviewSenderName}: “{chatPreviewSnippet}”
              </p>
            )}
          </div>
          {token && currentUser?.id ? (
            <ChatPanel
              mentorId={chatMentorId}
              memberId={chatMemberId}
              token={token}
              currentUserId={currentUser.id}
              currentUserRole={isMentor ? "mentor" : "member"}
              currentUserName={currentUser.name ?? userName}
              label={isMentor ? "Mentor concierge" : "Member chat"}
            />
          ) : (
            <p className="text-sm uppercase tracking-[0.45em] text-[#C8A1B4]">Connecting chat…</p>
          )}
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.25)]">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Community whispers</p>
          <h3 className="mt-2 text-2xl font-semibold text-[#3E2F35]">Latest posts</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#3E2F35]/80">
            {overview?.communityUpdates?.length ? (
              overview.communityUpdates.map((update) => (
                <li key={update.id}>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]/80">
                    {update.roomName}
                  </p>
                  <p className="mt-1 leading-snug">{update.content}</p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-[#3E2F35]/50">
                    {new Date(update.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-sm text-[#3E2F35]/60">
                Community pulses are still bubbling. Post a note to keep things glowing.
              </li>
            )}
          </ul>
        </article>
        <article className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_20px_60px_rgba(180,143,164,0.25)]">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
            Weekly checklist
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-[#3E2F35]">Studio rituals</h3>
          <div className="mt-4 space-y-3 text-sm text-[#3E2F35]/80">
            {overview?.weeklyChecklist.map((item) => (
              <p key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#C8A1B4]" />
                {item}
              </p>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
