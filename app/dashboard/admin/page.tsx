import ActionButton from "@/components/dashboard/ui/ActionButton";
import DashboardCard from "@/components/dashboard/ui/DashboardCard";
import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import AdminStatCard from "@/components/dashboard/admin/AdminStatCard";
import BlogControls from "@/components/dashboard/admin/BlogControls";
import { DashboardHubCard, DashboardHubLayout } from "@/components/dashboard/DashboardLayout";
import LogoutButton from "@/components/auth/LogoutButton";
import { getAdminStats } from "@/lib/services/server/admin.service";
import { listInviteRequests } from "@/lib/services/server/inviteRequest.service";
import {
  createEmptyAdminBlogControlSnapshotPayload,
  getAdminBlogControlSnapshot,
} from "@/lib/services/server/blogAdminControls.service";
import {
  BLOG_DB_UNAVAILABLE_DETAILS,
  BLOG_DB_UNAVAILABLE_HEADING,
  getBlogReadiness,
} from "@/lib/blog/blogReadiness";

export default async function AdminDashboardPage() {
  const [stats, inviteRequests, blogStatus] = await Promise.all([
    getAdminStats(),
    listInviteRequests(),
    getBlogReadiness(),
  ]);

  let blogSnapshot = createEmptyAdminBlogControlSnapshotPayload();
  if (blogStatus.blogDbReady) {
    try {
      blogSnapshot = await getAdminBlogControlSnapshot();
    } catch (error) {
      console.error("[ADMIN_PAGE_BLOG_FATAL]", error);
      blogSnapshot = createEmptyAdminBlogControlSnapshotPayload();
    }
  }

  const pendingInviteCount = inviteRequests.filter((request) => request.status === "pending").length;

  const hubCards = [
    {
      title: "Members",
      description: "Feel the platform pulse through member counts without losing calm.",
      href: "/dashboard/admin/users",
      ctaLabel: "Continue with members",
      status: "Members",
      statusSecondary: `${stats.totalMembers} active`,
    },
    {
      title: "Mentors",
      description: "Mentor partnerships are highlighted here so you can enter a room thoughtfully.",
      href: "/dashboard/admin/mentors",
      ctaLabel: "Continue with mentors",
      status: "Mentors",
      statusSecondary: `${stats.totalMentors} partners`,
    },
    {
      title: "Content",
      description: "Curate blog drafts, approvals, and the canon of guided stories.",
      href: "/dashboard/admin/blog",
      ctaLabel: "Continue with content",
      status: blogStatus.blogDbReady ? "Content live" : "Content preview",
      statusSecondary: blogStatus.blogDbReady
        ? "Drafts and submissions available"
        : "Tracking readiness soon",
    },
    {
      title: "Analytics",
      description: "A calm look at platform health, invite requests, and upcoming events.",
      href: "/dashboard/admin/analytics",
      ctaLabel: "Continue with analytics",
      status: "Analytics",
      statusSecondary: `${pendingInviteCount} invites pending · ${stats.activeEvents} events`,
    },
  ];

  const cards = [
    {
      title: "Pending invite requests",
      value: pendingInviteCount,
      detail: "Families waiting for approval",
    },
    { title: "New members today", value: stats.todaysSignups, detail: "Signups today" },
    { title: "Registry activity", value: stats.totalRegistryItems, detail: "Items tracked" },
  ];

  return (
    <DashboardHubLayout
      title="Admin Atelier"
      subtitle="Admin Hub"
      description="Only this surface lists the portals across members, mentors, content, and analytics."
      heroCopy="Operations remain calm here. You enter a room, tend to the signal, then leave it soft."
      actions={
        <LogoutButton
          className="border-[#3E2F35] text-[#3E2F35] hover:border-[#7C3B53]"
          wrapperClassName="flex-row items-center gap-0"
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {hubCards.map((card) => (
          <DashboardHubCard key={card.title} {...card} />
        ))}
      </div>

      <div className="space-y-6 rounded-[28px] border border-tmMauve/30 bg-white/90 p-6">
        {!blogStatus.blogDbReady && (
          <div className="space-y-2 rounded-[26px] border border-[#E3C6D4] bg-[#FFF8F7] p-5 shadow-sm">
            <p className="text-lg font-semibold text-[#6D2E4D]">{BLOG_DB_UNAVAILABLE_HEADING}</p>
            {BLOG_DB_UNAVAILABLE_DETAILS.map((detail) => (
              <p key={detail} className="text-sm text-[#3E2F35]/80">
                {detail}
              </p>
            ))}
          </div>
        )}
        <BlogControls data={blogSnapshot} />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Platform health</p>
          <ActionButton href="/dashboard/admin/waitlist" variant="ghost">
            Review invites
          </ActionButton>
        </div>
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
      </section>

      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">System status</p>
        <div className="space-y-4">
          {stats.systemActivity.length === 0 ? (
            <DashboardCard className="space-y-2 p-4">
              <EmptyState
                title="Nothing new yet"
                description="System looks healthy. Activity logs will appear here once operations run."
              />
            </DashboardCard>
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
      </section>
    </DashboardHubLayout>
  );
}
