export const dynamic = "force-dynamic";
export const revalidate = 0;

import ActionButton from "@/components/dashboard/ui/ActionButton";
import DashboardCard from "@/components/dashboard/ui/DashboardCard";
import DashboardSection from "@/components/dashboard/ui/DashboardSection";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import { getAdminStats } from "@/lib/services/server/admin.service";
import { listInviteRequests } from "@/lib/services/server/inviteRequest.service";

export default async function AdminDashboardPage() {
  const [stats, inviteRequests] = await Promise.all([
    getAdminStats(),
    listInviteRequests(),
  ]);

  const pendingInviteCount = inviteRequests.filter((request) => request.status === "pending").length;

  const cards = [
    {
      title: "Pending invite requests",
      value: pendingInviteCount,
      detail: "Families waiting for approval",
    },
    { title: "Total members", value: stats.totalMembers, detail: "Active members" },
    { title: "Total mentors", value: stats.totalMentors, detail: "Mentor partners" },
    { title: "Upcoming events", value: stats.activeEvents, detail: "Events scheduled" },
    { title: "Registry activity", value: stats.totalRegistryItems, detail: "Items tracked" },
    { title: "Today's signups", value: stats.todaysSignups, detail: "New members today" },
  ];

  return (
    <main className="space-y-10">
      <DashboardSection
        eyebrow="Admin · Overview"
        title="Dashboard overview"
        description="High-level platform health, pending reviews, and the latest system activity."
        action={
          <ActionButton
            href="/dashboard/admin/waitlist"
            variant="ghost"
            className="sm:w-auto"
            fullWidth
          >
            Invite requests
          </ActionButton>
        }
      >
        <DashboardCard className="space-y-3 p-6">
          <p className="text-sm text-[#3E2F35]/70">
            Platform health at a glance—pending reviews, member counts, and system rhythms.
          </p>
          <div className="flex flex-wrap gap-3">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Pending invites</p>
              <p className="text-lg font-semibold text-[#3E2F35]">{pendingInviteCount}</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Members</p>
              <p className="text-lg font-semibold text-[#3E2F35]">{stats.totalMembers}</p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Mentors</p>
              <p className="text-lg font-semibold text-[#3E2F35]">{stats.totalMentors}</p>
            </div>
          </div>
        </DashboardCard>
      </DashboardSection>

      <DashboardSection
        eyebrow="Platform metrics"
        title="Key health indicators"
        description="Grouped cards keep the overview calm and readable."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <AdminStatCard
              key={card.title}
              title={card.title}
              value={card.value}
              detail={card.detail}
            />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        eyebrow="System status"
        title="Recent activity"
        description="Logs and alerts funnel into calm insight."
        action={
          <ActionButton
            href="/dashboard/admin/logs"
            variant="ghost"
            className="sm:w-auto"
            fullWidth
          >
            View logs
          </ActionButton>
        }
      >
        <div className="space-y-4">
          {stats.systemActivity.length === 0 ? (
            <EmptyState
              title="Nothing new yet"
              description="System looks healthy. Activity logs will appear here once operations run."
            />
          ) : (
            stats.systemActivity.map((activity) => (
              <DashboardCard key={activity.id} className="space-y-2 p-4">
                <p className="text-sm font-semibold text-[#3E2F35]">{activity.summary}</p>
                <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">
                  {activity.timestamp}
                </p>
              </DashboardCard>
            ))
          )}
        </div>
      </DashboardSection>
    </main>
  );
}
