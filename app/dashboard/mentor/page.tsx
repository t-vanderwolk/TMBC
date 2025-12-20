import CommunityPanel from "@/components/community/CommunityPanel";
import MentorToolkit from "./components/MentorToolkit";
import ActionButton from "@/components/dashboard/ui/ActionButton";
import DashboardCard from "@/components/dashboard/ui/DashboardCard";
import DashboardSection from "@/components/dashboard/ui/DashboardSection";
import StatBadge from "@/components/dashboard/ui/StatBadge";

const queue = [1, 2, 3];

export default async function MentorDashboard() {
  return (
    <main className="space-y-10">
      <MentorToolkit />

      <DashboardSection
        eyebrow="Mentor Studio"
        title="Your Members Today"
        description="Insight, rhythm, and gentle guidance for each parent you support."
        action={
          <ActionButton
            href="/dashboard/mentor/workspace"
            variant="ghost"
            className="sm:w-auto"
            fullWidth
          >
            Open Mentor Hub
          </ActionButton>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <DashboardCard className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[#3E2F35]/70">
                Keep the studio calm with gentle follow-ups and rhythm checks.
              </p>
              <StatBadge label="in queue" value={queue.length} />
            </div>
            <div className="flex flex-wrap gap-3">
              <ActionButton
                href="/dashboard/mentor/members"
                variant="ghost"
                className="sm:w-auto"
                fullWidth
              >
                View members
              </ActionButton>
              <ActionButton
                href="/dashboard/mentor/tasks"
                variant="ghost"
                className="sm:w-auto"
                fullWidth
              >
                Review tasks
              </ActionButton>
            </div>
          </DashboardCard>

          <DashboardCard className="space-y-4 p-5">
            <p className="text-sm text-[#3E2F35]/70">
              Track upcoming events and follow-ups without the noise.
            </p>
            <div className="flex flex-wrap gap-3">
              <ActionButton
                href="/dashboard/events"
                variant="ghost"
                className="sm:w-auto"
                fullWidth
              >
                Upcoming events
              </ActionButton>
              <ActionButton
                href="/dashboard/mentor/workspace"
                variant="ghost"
                className="sm:w-auto"
                fullWidth
              >
                Mentor workspace
              </ActionButton>
            </div>
          </DashboardCard>
        </div>
      </DashboardSection>

      <DashboardSection
        eyebrow="Member queue"
        title="Gentle overview"
        description="Each card shares a quick reminder of what this member needs next."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {queue.map((i) => (
            <DashboardCard key={i} className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-serif text-[#3E2F35]">Member #{i}</h4>
                <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[#B98AA5]">
                  Registry check
                </span>
              </div>
              <p className="text-sm text-[#3E2F35]/70">
                Needs a registry check-in and module approval.
              </p>
              <div className="flex flex-wrap gap-3">
                <ActionButton
                  href="/dashboard/mentor/members"
                  variant="ghost"
                  className="sm:w-auto"
                  fullWidth
                >
                  Open profile
                </ActionButton>
                <ActionButton
                  href="/dashboard/mentor/tasks"
                  variant="ghost"
                  className="sm:w-auto"
                  fullWidth
                >
                  Add follow-up
                </ActionButton>
              </div>
            </DashboardCard>
          ))}
        </div>

        <CommunityPanel
          title="Mentor Lounge"
          copy="Share wins with peers and exchange mentorship prompts."
          href="/dashboard/member/community"
          cta="Browse rooms"
        />
      </DashboardSection>
    </main>
  );
}
