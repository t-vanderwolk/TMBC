import Link from "next/link";

import ActionButton from "@/components/dashboard/ui/ActionButton";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";
const SHOULD_SKIP_OVERVIEW_FETCH =
  process.env.npm_lifecycle_event === "build";

const mentorOverviewFallback = {
  mentor: {
    id: "placeholder",
    role: "MENTOR",
    status: "active",
  },
  dailyFocus: {
    messagesNeedingReply: 0,
    journalsShared: 0,
    modulesNeedingReview: 0,
    plansNeedingUpdate: 0,
  },
  mentees: {
    total: 0,
    onboarding: 0,
    planning: 0,
    active: 0,
  },
  circles: {
    upcomingCount: 0,
    nextSessionAt: undefined as string | undefined,
  },
};

const loadMentorOverview = async () => {
  if (SHOULD_SKIP_OVERVIEW_FETCH) {
    return mentorOverviewFallback;
  }

  try {
    const response = await fetch(new URL("/api/mentor/overview", API_BASE_URL), {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Mentor overview fetch failed: ${response.status}`);
    }
    const payload = await response.json();
    return {
      ...mentorOverviewFallback,
      ...payload,
      dailyFocus: {
        ...mentorOverviewFallback.dailyFocus,
        ...payload?.dailyFocus,
      },
      mentees: {
        ...mentorOverviewFallback.mentees,
        ...payload?.mentees,
      },
      circles: {
        ...mentorOverviewFallback.circles,
        ...payload?.circles,
      },
    };
  } catch (error) {
    console.error("Mentor overview load failed", error);
    return mentorOverviewFallback;
  }
};

const comfortGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const formatSessionDate = (value?: string) => {
  if (!value) return "No sessions scheduled yet";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Upcoming session soon";
  }
};

type MentorCard = {
  title: string;
  description: string;
  href: string;
  status: string;
  statusSecondary: string;
  progress?: number;
};

const quickAccess = [
  {
    label: "Messages",
    href: "/dashboard/messages",
    context: "A mentor reply is one tap away.",
  },
  {
    label: "Mentees",
    href: "/dashboard/mentor/mentees",
    context: "Peer notes, modules, and journals in one place.",
  },
  {
    label: "Circles",
    href: "/dashboard/mentor/circles",
    context: "Prep for shared sessions or invite new guests.",
  },
];

export default async function MentorDashboard() {
  const mentorOverview = await loadMentorOverview();
  const heroCopy = `${comfortGreeting()}, Mentor. Keep the tone steady—this space mirrors how members experience calm, reassuring structure.`;

  const menteeProgress =
    mentorOverview.mentees.total > 0
      ? mentorOverview.mentees.active / mentorOverview.mentees.total
      : undefined;

  const mentorCards: MentorCard[] = [
    {
      title: "Mentees",
      description:
        mentorOverview.mentees.total > 0
          ? "Open a mentee to review their plan, journals, and modules without losing a quiet moment."
          : "No mentees assigned yet. This card will update once people are matched.",
      href: "/dashboard/mentor/mentees",
      status: "Assigned",
      statusSecondary: `${mentorOverview.mentees.active} active · ${mentorOverview.mentees.onboarding} onboarding`,
      progress: menteeProgress,
    },
    {
      title: "Circles & events",
      description: `Shared sessions, circles, and mentor gatherings. Next up: ${formatSessionDate(
        mentorOverview.circles.nextSessionAt,
      )}.`,
      href: "/dashboard/mentor/circles",
      status: "Events",
      statusSecondary: `${mentorOverview.circles.upcomingCount} upcoming`,
    },
    {
      title: "Planning board",
      description: mentorOverview.dailyFocus.plansNeedingUpdate
        ? "Plans are waiting to be confirmed—open a board when you are ready."
        : "No plans need update yet. Stay patient and return when the rhythm wishes it.",
      href: "/dashboard/mentor/plan",
      status: "Plans",
      statusSecondary: `${mentorOverview.dailyFocus.plansNeedingUpdate} updates pending`,
    },
    {
      title: "Daily focus",
      description: "Stay in tune with the counts that matter: replies, journals, modules, and planning.",
      href: "/dashboard/mentor/messages",
      status: "Focus",
      statusSecondary: `${mentorOverview.dailyFocus.messagesNeedingReply} messages · ${mentorOverview.dailyFocus.modulesNeedingReview} modules`,
    },
  ];

  return (
    <main className="space-y-10 py-10">
      <section className="space-y-4 rounded-[28px] border border-[#EAD4D8] bg-white/90 p-6 md:p-10">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#A4556A]">Mentor studio</p>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-[#3E2F35]">Calm command center</h1>
          <p className="text-sm text-[#3E2F35]/70">{heroCopy}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ActionButton href="/dashboard/mentor/mentees">Open mentees</ActionButton>
          <ActionButton href="/dashboard/mentor/messages" variant="ghost">
            Continue to messages
          </ActionButton>
        </div>
      </section>

      <section className="space-y-4 rounded-[28px] border border-[#EAD4D8] bg-white/90 p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Mentor blog</p>
            <h2 className="text-xl font-semibold text-[#3E2F35]">Draft a new story</h2>
            <p className="text-sm text-[#3E2F35]/70">
              Open the editor once you have a calm, confident idea. Admins will review before publishing.
            </p>
          </div>
          <ActionButton href="/dashboard/mentor/blog/new">Open blog editor</ActionButton>
        </div>
      </section>

      <section>
        <div className="grid gap-6 lg:grid-cols-2">
          {mentorCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="flex h-full flex-col justify-between rounded-[28px] border border-[#EAD4D8] bg-[#FFFAF8]/80 p-6 transition hover:border-[#C8A1B4]"
            >
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">{card.status}</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#3E2F35]">{card.title}</h2>
                <p className="text-sm text-[#3E2F35]/70">{card.description}</p>
              </div>
              <div className="mt-4 space-y-1">
                {card.progress !== undefined ? (
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-full bg-[#E5D4DB]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C8A1B4] to-[#A4556A]"
                        style={{ width: `${Math.min(Math.max(card.progress, 0), 1) * 100}%` }}
                      />
                    </div>
                    <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#3E2F35]/70">
                      {Math.round(card.progress * 100)}% mentees active
                    </p>
                  </div>
                ) : null}
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3E2F35]/80">
                  {card.statusSecondary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5 rounded-[28px] border border-[#EAD4D8] bg-white/90 p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Daily focus</p>
            <h2 className="text-xl font-semibold text-[#3E2F35]">Where to lend your calm today</h2>
          </div>
          <ActionButton href="/dashboard/mentor/messages" variant="ghost">
            View full focus list
          </ActionButton>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Messages needing reply", value: mentorOverview.dailyFocus.messagesNeedingReply },
            { label: "Journals shared", value: mentorOverview.dailyFocus.journalsShared },
            { label: "Modules to review", value: mentorOverview.dailyFocus.modulesNeedingReview },
            { label: "Plans to revisit", value: mentorOverview.dailyFocus.plansNeedingUpdate },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#E3C6D4] bg-[#FFF9F5] p-4">
              <p className="text-[0.6rem] uppercase tracking-[0.35em] text-[#A4556A]">{item.label}</p>
              <p className="text-2xl font-semibold text-[#3E2F35]">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-[28px] border border-[#EAD4D8] bg-white/90 p-6 md:p-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#A4556A]">Quick access</p>
            <h2 className="text-xl font-semibold text-[#3E2F35]">Gentle shortcuts</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickAccess.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col gap-2 rounded-2xl border border-[#E3C6D4] bg-[#FFF9F5] p-4 transition hover:border-[#C8A1B4]"
            >
              <p className="text-sm font-semibold text-[#3E2F35]">{item.label}</p>
              <p className="text-[0.75rem] text-[#3E2F35]/70">{item.context}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
