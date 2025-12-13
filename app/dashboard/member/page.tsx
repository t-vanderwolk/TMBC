import MemberWelcomeHeader from "@/components/dashboard/member/MemberWelcomeHeader";
import JourneyProgressCard from "@/components/dashboard/member/JourneyProgressCard";
import TodayFocusCard from "@/components/dashboard/member/TodayFocusCard";
import RegistrySnapshotCard from "@/components/dashboard/member/RegistrySnapshotCard";
import MentorSupportCard from "@/components/dashboard/member/MentorSupportCard";
import UpcomingEventsCard from "@/components/dashboard/member/UpcomingEventsCard";
import QuickLinksRow from "@/components/dashboard/member/QuickLinksRow";

const JOURNEY_DATA = {
  currentModule: "Nesting & Rhythm",
  progressPercent: 58,
  nextMilestone: "Module 7 · Currents & Calm",
  lastTouchpoint: "Mentor note delivered yesterday",
};

const FOCUS_ITEMS = [
  "Pause for a mindful breathing ritual before your first screen check.",
  "Capture a one-sentence journal entry about how your body is feeling today.",
  "Review the evening routine sketch with your partner for gentle sync.",
];

const REGISTRY_ITEMS = [
  { name: "Heirloom swaddle trio", status: "Awaiting mentor blessing" },
  { name: "Slow simmer kettle", status: "Saved", detail: "Arriving April 2" },
  { name: "Curated nursery scent", status: "Pinned", detail: "Shared with mentor" },
];

const UPCOMING_EVENTS = [
  {
    title: "Community Fireside",
    date: "Mar 29 · 7:00 PM ET",
    detail: "Cozy chat with other invite-only members & mentors.",
  },
  {
    title: "Mentor Q&A",
    date: "Apr 4 · 10:30 AM ET",
    detail: "Drop in for focused guidance on nesting and rhythms.",
  },
];

const QUICK_LINKS = [
  { label: "Continue Academy", href: "/dashboard/member/learn" },
  { label: "Registry Rhythm", href: "/dashboard/member/registry" },
  { label: "Add a ritual", href: "/dashboard/member?focus=ritual" },
  { label: "Community studio", href: "/dashboard/community" },
];

export default async function MemberDashboard() {
  const userName = null;

  return (
    <div className="space-y-6">
      <MemberWelcomeHeader
        userName={userName}
        tone="A calm check-in, not a productivity sprint."
        intention="Nurture the rituals that keep you centered today."
        highlight="We are holding space for your bloom."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <JourneyProgressCard
          currentModule={JOURNEY_DATA.currentModule}
          progressPercent={JOURNEY_DATA.progressPercent}
          nextMilestone={JOURNEY_DATA.nextMilestone}
          lastTouchpoint={JOURNEY_DATA.lastTouchpoint}
        />
        <MentorSupportCard
          mentorName="Jordan Ellis"
          status="Jordan is reading your latest notes; messages sync when the studio is online."
          availability="Next session · Thu Apr 4 · 10:30 AM ET"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <TodayFocusCard
          focusItems={FOCUS_ITEMS}
          mantra="Breathe gently, choose one small win, rest when you need to."
          timeLabel="Morning Check-In"
        />
        <RegistrySnapshotCard
          items={REGISTRY_ITEMS}
          curatedCount={9}
          nextReview="Mentor review · Apr 6"
        />
      </div>

      <UpcomingEventsCard events={UPCOMING_EVENTS} />

      <QuickLinksRow links={QUICK_LINKS} />
    </div>
  );
}
