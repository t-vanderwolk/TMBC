import {
  BookOpenCheck,
  ClipboardList,
  Feather,
  MessageCircle,
  type LucideIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import AnimatedFadeUp from "@/components/dashboard/member/AnimatedFadeUp";
import BabyNameGenerator from "@/components/dashboard/BabyNameGenerator";
import CircleFeed from "@/components/dashboard/member/CircleFeed";
import EasterEggCopy from "@/components/dashboard/member/EasterEggCopy";
import EventsAnnouncementsSection from "@/components/dashboard/member/dashboard/EventsAnnouncementsSection";
import FocusCard from "@/components/dashboard/member/FocusCard";
import JourneySnapshotSection from "@/components/dashboard/member/dashboard/JourneySnapshotSection";
import AffiliatePerksSection from "@/components/dashboard/member/dashboard/AffiliatePerksSection";
import MemberLogoutButton from "@/components/dashboard/member/MemberLogoutButton";
import PregnancyMomentCard from "@/components/dashboard/member/PregnancyMomentCard";
import UpcomingMomentsCalendar from "@/components/dashboard/member/UpcomingMomentsCalendar";
import { getUserOrThrow, type SafeUser } from "@/lib/auth/getUser";
import { getDashboardData, type DashboardOverview } from "@/lib/services/server/dashboard.service";
import { getMemberSettingsData } from "@/lib/services/server/memberSettings.service";
import { listJournalEntries } from "@/lib/services/server/journal.service";
import {
  calculatePregnancyProgress,
  getDateForGestationalWeek,
  TOTAL_PREGNANCY_WEEKS,
} from "@/lib/utils/pregnancy";

const buildCircleFeedItems = (
  overview: DashboardOverview,
  currentJourneyTitle?: string,
) => {
  const items: CircleFeedItem[] = [];

  if (overview.announcement) {
    items.push({
      id: `announcement-${overview.announcement.id}`,
      title: `Mentor note · ${overview.announcement.roomName}`,
      body:
        overview.announcement.snippet ||
        overview.announcement.content ||
        "A quiet reflection from a mentor.",
      timestamp: overview.announcement.createdAt,
      source: "Mentor note",
    });
  }

  if (overview.suggestions.nextModuleTitle) {
    items.push({
      id: "academy-update",
      title: currentJourneyTitle
        ? `${currentJourneyTitle} · Academy update`
        : "Academy update · Your next moment",
      body: `Ease toward ${overview.suggestions.nextModuleTitle} only when you feel steady.`,
      timestamp: new Date().toISOString(),
      source: "Academy update",
    });
  }

  if (overview.registryStatus.detail) {
    items.push({
      id: "registry-reflection",
      title: "Registry rhythm · System reflection",
      body: overview.registryStatus.detail,
      timestamp: new Date().toISOString(),
      source: "System reflection",
    });
  }

  if (overview.communityStatus.tone !== "calm") {
    items.push({
      id: "community-pulse",
      title: `Community · ${overview.communityStatus.label}`,
      body: overview.communityStatus.detail,
      timestamp: new Date().toISOString(),
      source: "Community note",
    });
  }

  return items.slice(0, 5);
};

type CircleFeedItem = {
  id: string;
  title: string;
  body: string;
  timestamp?: string | null;
  source?: string;
};

const CLOCKWORK_ITEMS_LIMIT = 4;
const WEEK_MS = 1000 * 60 * 60 * 24 * 7;

const LINEN_TEXTURE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='rgba(255,255,255,0.7)'/%3E%3Cpath d='M0 0h80M0 40h80M0 80h80M0 0v80M40 0v80M80 0v80' stroke='rgba(255,255,255,0.5)' stroke-width='0.5'/%3E%3C/svg%3E\")";
const WEEKLY_DELIGHT_COPY: Record<number, string> = {
  13: "Still early, but you’re already doing a lot.",
  27: "You might be nesting. Or reorganizing the junk drawer.",
  35: "If everything feels slower — good. That’s allowed.",
};
const TRIMESTER_TRANSITIONS = [
  { week: 14, label: "Second Trimester" },
  { week: 28, label: "Third Trimester" },
];

const formatEventSubtitle = (event: { hostName?: string | null; format?: string | null }) => {
  const fragments = [event.hostName, event.format].filter(Boolean);
  return fragments.join(" · ") || undefined;
};

const JOURNEY_MEMORY_HINTS: Record<string, string> = {
  Learn: "Last opened this morning",
  Plan: "Last arranged late yesterday",
  Connect: "You lingered here yesterday",
  Reflect: "Journaled a gentle note two days ago",
};

type QuickAccessItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  iconSize: string;
  context: string;
  highlight?: boolean;
};

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    label: "Academy",
    href: "/dashboard/learn",
    icon: BookOpenCheck,
    iconSize: "h-5 w-5",
    context: "Continue right where you left off",
    highlight: true,
  },
  {
    label: "Registry",
    href: "/dashboard/registry",
    icon: ClipboardList,
    iconSize: "h-4 w-4",
    context: "Registry rituals stay soft when you return",
  },
  {
    label: "Community",
    href: "/dashboard/community",
    icon: Users,
    iconSize: "h-6 w-6",
    context: "The lounge is open for quieter posts",
  },
  {
    label: "My Baby Book",
    href: "/dashboard/reflect",
    icon: Feather,
    iconSize: "h-[18px] w-[18px]",
    context: "Thoughts stay tender and private",
  },
  {
    label: "Mentor Support",
    href: "/dashboard/messages",
    icon: MessageCircle,
    iconSize: "h-5 w-5",
    context: "A mentor reply is just ahead",
  },
];

export default async function MemberDashboardPage() {
  const user: SafeUser | null = await getUserOrThrow().catch(() => null);

  if (!user || user.role !== "MEMBER") {
    redirect("/login");
  }

  if (!user.onboardingComplete) {
    redirect("/onboarding/questionnaire");
  }

  const userPayload = {
    id: user.id,
    name: user.name ?? undefined,
    firstName: user.name?.split(" ")[0] ?? undefined,
    dueDate: user.dueDate ?? undefined,
  };

  const dashboardPromise = getDashboardData(userPayload);
  const dashboard = await dashboardPromise;
  const [memberSettingsData, journalEntries] = await Promise.all([
    getMemberSettingsData(user.id),
    listJournalEntries(user.id),
  ]);
  const hasPartner = Boolean(memberSettingsData.partnerProfile?.name);
  const recentJournalEntry = journalEntries.find(
    (entry) => Date.now() - entry.createdAt.getTime() <= WEEK_MS,
  );
  const pregnancyProgress = calculatePregnancyProgress(userPayload.dueDate);
  const pregnancyWeek = pregnancyProgress?.week ?? null;
  const weekDelight = pregnancyWeek ? WEEKLY_DELIGHT_COPY[pregnancyWeek] : undefined;
  const firstName = userPayload.firstName ?? "Friend";
  const timeOfDayGreeting = (() => {
    const hour = new Date().getHours();
    if (hour < 5) return "Good early morning";
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();
  const dueContext = dashboard.dueDateLabel
    ? `Counting softly toward ${dashboard.dueDateLabel}`
    : "We’ll share a gentle pacing note once your due date is set.";
  const journeyProgressMap = new Map(
    dashboard.journeyProgress.map((journey) => [journey.title, journey]),
  );
  const currentJourneyProgress =
    dashboard.journeyProgress.find((journey) => journey.percent > 0 && journey.percent < 100) ??
    dashboard.journeyProgress[0] ??
    null;
  const currentJourneyTitle = currentJourneyProgress?.title ?? "Learn";

  const lastCompletedModule =
    [...dashboard.modules].reverse().find((module) => module.completed) ?? null;
  const contextCopy =
    dashboard.suggestions.needsRegistry
      ? "This is a good week to think about logistics — nothing to buy yet."
      : recentJournalEntry
      ? "No action needed. Just noticing where you are is enough."
      : hasPartner
      ? "Something you can talk through together this week."
      : undefined;

  const focusState = (() => {
    if (recentJournalEntry) {
      return {
        statement: "Your journal entry is still unfolding—let that reflection breathe.",
        actionLabel: "Reflect",
        metaLabel: "Journaled within the past week",
      };
    }
    if (lastCompletedModule) {
      return {
        statement: `You’ve touched ${lastCompletedModule.title}; let the next hello settle.`,
        actionLabel: "Rest",
        metaLabel: "Last module wrapped",
      };
    }
    if (dashboard.suggestions.nextModuleTitle) {
      return {
        statement: `Ease toward ${dashboard.suggestions.nextModuleTitle} when curiosity feels gentle.`,
        actionLabel: "Continue",
        metaLabel: `${currentJourneyTitle} · ${Math.round(
          journeyProgressMap.get(currentJourneyTitle)?.percent ?? 0,
        )}% in motion`,
      };
    }
    return {
      statement: "This week is more about rest than progress.",
      actionLabel: "Observe",
      metaLabel: "You were here earlier",
    };
  })();

  const focusActionHref =
    focusState.actionLabel === "Reflect"
      ? "/dashboard/reflect"
      : focusState.actionLabel === "Continue"
      ? dashboard.suggestions.nextModuleId
        ? `/dashboard/learn/${dashboard.suggestions.nextModuleId}`
        : "/dashboard/learn"
      : null;
  const focusActionMessage =
    focusActionHref === null ? "Unlocks after your next module" : `${focusState.actionLabel} now`;

  const nextTrimesterTransition = TRIMESTER_TRANSITIONS.find(
    ({ week }) => (pregnancyWeek ?? 0) < week,
  );
  const upcomingCalendarMoments: Array<{ id: string; title: string; date: string; subtitle?: string | null }> =
    [];
  if (nextTrimesterTransition) {
    const transitionDate = getDateForGestationalWeek(
      userPayload.dueDate,
      nextTrimesterTransition.week,
    );
    if (transitionDate) {
      upcomingCalendarMoments.push({
        id: "trimester-transition",
        title: `${nextTrimesterTransition.label} shift`,
        date: transitionDate,
        subtitle: "A gentle shift in focus, no hurry.",
      });
    }
  }

  if (dashboard.suggestions.nextModuleTitle) {
    const targetWeek = Math.min(TOTAL_PREGNANCY_WEEKS, (pregnancyWeek ?? 0) + 2);
    const moduleDate = getDateForGestationalWeek(userPayload.dueDate, targetWeek);
    upcomingCalendarMoments.push({
      id: "next-module",
      title: `${dashboard.suggestions.nextModuleTitle}`,
      date: moduleDate ?? new Date().toISOString(),
      subtitle: "Module unlock · ready when you are.",
    });
  }

  const trimmedEvents = dashboard.events
    .filter((event) => {
      const loweredTitle = event.title?.toLowerCase() ?? "";
      return /trimester|module/i.test(loweredTitle);
    })
    .slice(0, CLOCKWORK_ITEMS_LIMIT)
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      subtitle: formatEventSubtitle(event),
    }));
  upcomingCalendarMoments.push(...trimmedEvents);
  const upcomingItems = upcomingCalendarMoments.slice(0, 3);

  const circleFeedItems = buildCircleFeedItems(dashboard, currentJourneyTitle);
  const moduleProgressPercentage = dashboard.totalModules
    ? Math.min(100, Math.round((dashboard.completedModules / dashboard.totalModules) * 100))
    : 0;
  const profile = memberSettingsData.profile;
  const dueDateValue = profile?.dueDate ?? userPayload.dueDate;

  return (
    <main className="min-h-screen bg-[#FFFAF8] text-[#3E2F35]">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">

        <section
          id="now"
          className="space-y-10 rounded-[2rem] border border-[#EAD4D8] bg-white/90 px-8 py-10 shadow-[0_25px_60px_rgba(84,35,52,0.12)]"
          style={{ backgroundImage: LINEN_TEXTURE }}
        >
          <div className="space-y-3">
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/60">Member Dashboard</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="font-serif text-4xl text-tmCharcoal">
                Hi {firstName}, this is your calm check-in.
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/profile"
                  className="text-sm text-tmMauve underline-offset-4 transition hover:text-tmDeepMauve"
                >
                  Edit your profile & preferences
                </Link>
                <MemberLogoutButton />
              </div>
            </div>
            <div className="grid gap-1 text-sm text-tmCharcoal/70">
              <p>
                {timeOfDayGreeting}, {firstName}.
              </p>
              <p>{dueContext}</p>
              <p className="text-xs text-tmCharcoal/60">{weekDelight ?? "You’re exactly where you should be."}</p>
            </div>
            {dashboard.babyStage ? (
              <p className="text-sm text-tmCharcoal/60">{dashboard.babyStage}</p>
            ) : null}
            <div className="mt-4 grid gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-[#B98AA5] sm:grid-cols-3">
              <Link
                href="/dashboard/learn"
                className="rounded-full border border-[#EAD4D8] bg-white/90 px-3 py-2 text-xs font-semibold text-[#3E2F35] transition hover:-translate-y-[1px] hover:border-[#C8A1B4]"
              >
                Continue Academy
              </Link>
              <Link
                href="/dashboard/registry"
                className="rounded-full border border-[#EAD4D8] bg-white/90 px-3 py-2 text-xs font-semibold text-[#3E2F35] transition hover:-translate-y-[1px] hover:border-[#C8A1B4]"
              >
                Review Registry
              </Link>
              <Link
                href="/dashboard/community"
                className="rounded-full border border-[#EAD4D8] bg-white/90 px-3 py-2 text-xs font-semibold text-[#3E2F35] transition hover:-translate-y-[1px] hover:border-[#C8A1B4]"
              >
                Say hello in the lounge
              </Link>
            </div>
          </div>

          <Link
            href="/dashboard/reflect"
            className="block transition duration-200 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-tmCharcoal/70"
          >
            <AnimatedFadeUp className="w-full" delay={0.05} duration={0.6}>
              <PregnancyMomentCard
                dueDate={dueDateValue}
                userName={firstName}
              />
            </AnimatedFadeUp>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/dashboard/learn"
              className="space-y-2 rounded-[2rem] border border-tmCharcoal/10 bg-white/90 p-4 text-sm text-tmCharcoal transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_15px_25px_rgba(62,47,53,0.12)] cursor-pointer"
            >
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/60">
                <span>Progress status</span>
                <span className="text-xs font-semibold text-[#3E2F35]">{moduleProgressPercentage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#F2E5ED]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-tmMauve via-tmMauve/80 to-tmCharcoal/80 transition-all duration-500"
                  style={{ width: `${moduleProgressPercentage}%` }}
                />
              </div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/60">
                Peaceful pacing in a single glance.
              </p>
              <p className="text-[0.7rem] text-tmCharcoal/50">This part can wait.</p>
            </Link>
            <div className="rounded-[2rem] border border-tmCharcoal/10 bg-white/90 p-4 text-sm text-tmCharcoal/70">
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/60">
                Weekly rhythm
              </p>
              <p className="mt-2 text-sm text-[#3E2F35]">
                {contextCopy ?? "Breathe steady—no action required right now."}
              </p>
              <p className="mt-4 text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/60">
                Soft signals · {moduleProgressPercentage}% modules in motion
              </p>
            </div>
            </div>
        </section>

        <div className="mt-10">
          <JourneySnapshotSection dataPromise={dashboardPromise} />
        </div>

        <section
          id="journeys"
          className="mt-10 space-y-10 rounded-[2rem] border border-[#EAD4D8] bg-white/90 px-8 py-10 shadow-[0_25px_60px_rgba(84,35,52,0.12)]"
        >
          <div className="space-y-6">
            <AnimatedFadeUp className="w-full" delay={0.15} duration={0.5}>
              <article className="rounded-[2rem] border border-[#EAD4D8] bg-white/90 p-6 shadow-[0_25px_60px_rgba(84,35,52,0.12)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/60">Calendar preview</p>
                    <p className="text-xs text-tmCharcoal/50">
                      Trimester shifts, module unlocks, announcements, and gatherings for the week.
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-tmCharcoal/60">
                    Focused view
                  </span>
                </div>
                <UpcomingMomentsCalendar items={upcomingItems} />
              </article>
            </AnimatedFadeUp>
            <EventsAnnouncementsSection dataPromise={dashboardPromise} />
            <AffiliatePerksSection dataPromise={dashboardPromise} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <AnimatedFadeUp className="w-full" delay={0.25} ease="easeInOut" duration={0.55}>
              <CircleFeed items={circleFeedItems} />
            </AnimatedFadeUp>
            <AnimatedFadeUp className="w-full" delay={0.3} duration={0.45}>
              <BabyNameGenerator />
            </AnimatedFadeUp>
          </div>
        </section>

        <section
          id="reflect"
          className="mt-10 space-y-10 rounded-[2rem] border border-[#EAD4D8] bg-white/90 px-8 py-10 shadow-[0_25px_60px_rgba(84,35,52,0.12)]"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <AnimatedFadeUp className="w-full" delay={0.35}>
              <article className="group flex flex-col justify-between rounded-[2rem] border border-[#EAD4D8] bg-white/90 p-6 shadow-[0_25px_60px_rgba(84,35,52,0.12)] transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_35px_60px_rgba(84,35,52,0.2)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.45em] text-tmCharcoal/60">Reflect</p>
                    <p className="text-xs text-tmCharcoal/50">Slow your breath, notice the quiet.</p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-tmCharcoal/60">
                    Gentle cue
                  </span>
                </div>
                <FocusCard
                  statement={focusState.statement}
                  actionLabel={focusState.actionLabel}
                  metaLabel={focusState.metaLabel}
                />
                <div className="mt-4 flex items-center gap-4">
                  {focusActionHref ? (
                    <Link
                      href={focusActionHref}
                      className="rounded-full border border-tmMauve/40 bg-transparent px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-tmMauve transition hover:border-tmDeepMauve hover:text-tmDeepMauve"
                    >
                      {focusState.actionLabel}
                    </Link>
                  ) : (
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/60">
                      {focusActionMessage}
                    </p>
                  )}
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-tmCharcoal/40">Next step</p>
                </div>
                <p className="mt-3 text-[0.65rem] text-tmCharcoal/50 opacity-80 transition-opacity duration-200 group-hover:opacity-100">
                  🌥️ A quiet hello appears only when you linger.
                </p>
              </article>
            </AnimatedFadeUp>
            <AnimatedFadeUp className="w-full" delay={0.4}>
              <article className="space-y-5 rounded-[2rem] border border-[#EAD4D8] bg-white/90 p-6 shadow-[0_25px_60px_rgba(84,35,52,0.12)]">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.4em] text-tmCharcoal/60">Profile</p>
                  <Link
                    href="/dashboard/profile"
                    className="text-xs font-semibold uppercase tracking-[0.35em] text-tmMauve transition hover:text-tmDeepMauve"
                  >
                    Manage
                  </Link>
                </div>
                <p className="text-sm text-tmCharcoal/70">
                  Your profile preferences help us tailor every touchpoint to your current season.
                </p>
              </article>
            </AnimatedFadeUp>
          </div>
        </section>

        <AnimatedFadeUp className="w-full" delay={0.45}>
          <section className="rounded-[2rem] border border-[#EAD4D8] bg-white/90 p-6 shadow-[0_25px_60px_rgba(84,35,52,0.12)]">
            <div className="border-l-4 border-[#C8A1B4] pl-4">
              <p className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">Secondary tools</p>
              <h2 className="font-serif text-3xl text-[#3E2F35]">Touchpoints</h2>
              <p className="text-sm text-tmCharcoal/60">
                Navigation feels effortless, always within reach.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold text-tmCharcoal md:grid-cols-4">
              {QUICK_ACCESS_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    title={item.context}
                    className={`group flex flex-col gap-2 rounded-[2rem] border px-4 py-3 transition duration-200 hover:-translate-y-[1px] hover:shadow-[0_10px_25px_rgba(62,47,53,0.12)] focus-visible:outline-none focus-visible:ring-0 ${
                      item.highlight
                        ? "border-tmMauve/40 bg-gradient-to-br from-tmMauve/20 via-tmMauve/60 to-white text-[#3E2F35]"
                        : "border-tmMauve/20 bg-blush/40 text-[#3E2F35]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`${
                          item.highlight ? "text-tmMauve" : "text-tmDeepMauve"
                        } ${item.iconSize}`}
                        aria-hidden
                      />
                      <span className="text-[#3E2F35]">{item.label}</span>
                    </div>
                    <p className="text-[0.55rem] uppercase tracking-[0.35em] text-[#3E2F35]">
                      {item.context}
                    </p>
                  </Link>
                );
              })}
            </div>
            <EasterEggCopy className="mt-6" />
          </section>
        </AnimatedFadeUp>

     </div>
   </main>
 );
}
