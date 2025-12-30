import MentorToolkit from "./components/MentorToolkit";
import UpcomingCircles from "@/components/dashboard/mentor/UpcomingCircles";
import ActionButton from "@/components/dashboard/ui/ActionButton";
import DashboardCard from "@/components/dashboard/ui/DashboardCard";
import DashboardSection from "@/components/dashboard/ui/DashboardSection";
import StatBadge from "@/components/dashboard/ui/StatBadge";
export const dynamic = "force-dynamic";

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

export default async function MentorDashboard() {
  const mentorOverview = await loadMentorOverview();
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const dailyFocusItems = [
    {
      id: "messages",
      label: "Messages awaiting reply",
      description: "Keep the conversation warm and steady.",
      count: mentorOverview.dailyFocus.messagesNeedingReply,
      href: "/dashboard/mentor/messages",
      badge: "waiting",
    },
    {
      id: "journals",
      label: "Journals shared for review",
      description: "Gentle reflections ready for your note.",
      count: mentorOverview.dailyFocus.journalsShared,
      href: "/dashboard/mentor/journal-review",
      badge: "shared",
    },
    {
      id: "modules",
      label: "Modules needing feedback",
      description: "Offer guidance on in-progress learning.",
      count: mentorOverview.dailyFocus.modulesNeedingReview,
      href: "/dashboard/mentor/tasks",
      badge: "pending",
    },
    {
      id: "plans",
      label: "Plans pending update",
      description: "Check plan changes before they drift.",
      count: mentorOverview.dailyFocus.plansNeedingUpdate,
      href: "/dashboard/mentor/plan",
      badge: "needs review",
    },
  ];

  const hasDailyFocus = dailyFocusItems.some((item) => item.count > 0);
  const quietInsights = [
    { label: "Active mentees", value: mentorOverview.mentees.active },
    { label: "Journals reviewed", value: 0 },
    { label: "Modules reviewed", value: 0 },
  ];

  return (
    <main className="space-y-10">
      <header className="rounded-3xl border border-white/70 bg-gradient-to-br from-white via-[#FFF7F2] to-[#F7E9EF] p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Mentor Studio</p>
        <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">Mentor Home · Daily Focus</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          {greeting}, Mentor. {todayLabel} is ready for calm focus.
        </p>
      </header>

      <DashboardSection
        eyebrow="Daily focus"
        title="What needs attention today"
        description="Start here before opening any deeper workspaces."
      >
        {hasDailyFocus ? (
          <div className="grid gap-4 md:grid-cols-2">
            {dailyFocusItems.map((item) => (
              <DashboardCard key={item.id} className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-[#3E2F35]">{item.label}</p>
                    <p className="text-sm text-[#3E2F35]/70">{item.description}</p>
                  </div>
                  <StatBadge label={item.badge} value={item.count} />
                </div>
                <ActionButton
                  href={item.href}
                  variant="ghost"
                  className="sm:w-auto"
                  fullWidth
                >
                  Open
                </ActionButton>
              </DashboardCard>
            ))}
          </div>
        ) : (
          <DashboardCard className="space-y-2 p-5">
            <p className="text-sm font-semibold text-[#3E2F35]">
              No items need attention right now.
            </p>
            <p className="text-sm text-[#3E2F35]/70">
              This list will populate as messages, journals, modules, and plan updates arrive.
            </p>
          </DashboardCard>
        )}
      </DashboardSection>

      <DashboardSection
        eyebrow="My mentees"
        title="Your mentee snapshot"
        description="Choose a person first, then choose an action."
        action={
          <ActionButton
            href="/dashboard/mentor/mentees"
            variant="ghost"
            className="sm:w-auto"
            fullWidth
          >
            View all mentees
          </ActionButton>
        }
      >
        <DashboardCard className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#3E2F35]/70">
              Total mentees assigned to you today.
            </p>
            <StatBadge label="mentees" value={mentorOverview.mentees.total} />
          </div>
          {mentorOverview.mentees.total ? (
            <p className="text-sm text-[#3E2F35]/70">
              Open a mentee to review their plan, messages, journals, and modules.
            </p>
          ) : (
            <p className="text-sm text-[#3E2F35]/70">
              No mentees assigned yet. This section will populate as mentors engage.
            </p>
          )}
        </DashboardCard>
      </DashboardSection>

      <DashboardSection
        eyebrow="Mentor circles"
        title="Upcoming circles"
        description="Shared sessions and cohort touchpoints."
      >
        <DashboardCard className="p-5">
          <UpcomingCircles
            upcomingCount={mentorOverview.circles.upcomingCount}
            nextSessionAt={mentorOverview.circles.nextSessionAt}
          />
        </DashboardCard>
      </DashboardSection>

      <DashboardSection
        eyebrow="Quiet insights"
        title="Soft counts"
        description="Counts only, no analytics or performance language."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quietInsights.map((item) => (
            <DashboardCard key={item.label} className="space-y-2 p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">{item.label}</p>
              <p className="text-2xl font-semibold text-[#3E2F35]">{item.value}</p>
              <p className="text-xs text-[#3E2F35]/60">
                This count will update as mentor activity connects.
              </p>
            </DashboardCard>
          ))}
        </div>
      </DashboardSection>

      <MentorToolkit />
    </main>
  );
}
