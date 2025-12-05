"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import AdminHero from "@/components/admin/AdminHero";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import AdminRecentLogins from "@/components/admin/AdminRecentLogins";
import AdminStatCard from "@/components/admin/AdminStatCard";

type OverviewPayload = {
  totalUsers: number;
  mentorCount: number;
  pendingInvites: number;
  registryItems: number;
};

type LoginEvent = {
  id: string;
  email: string;
  role?: string | null;
  success: boolean;
  createdAt: string;
};

type AdminDashboardContentProps = {
  admin: {
    email?: string;
    name?: string;
  };
};

const formatTimestamp = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function AdminDashboardContent({ admin }: AdminDashboardContentProps) {
  const [clientUser, setClientUser] = useState<{ email?: string; name?: string } | null>(null);
  const [overview, setOverview] = useState<OverviewPayload | null>(null);
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("tm_user");
    if (!stored) return;
    try {
      setClientUser(JSON.parse(stored));
    } catch {
      setClientUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [overviewRes, loginEventsRes] = await Promise.all([
          api.get("/api/admin/overview"),
          api.get("/api/admin/login-events"),
        ]);

        if (!active) return;
        setOverview(overviewRes.data);
        setLoginEvents((loginEventsRes.data || []).slice(0, 10));
      } catch (err) {
        if (!active) return;
        setError("Unable to load admin metrics. Please try again.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const email = clientUser?.email || admin.email;
  const lastLogin = loginEvents[0]?.createdAt;
  const heroSubtext = lastLogin
    ? `Last login ${formatTimestamp(lastLogin)}`
    : "You're viewing the control center.";

  const stats = useMemo(() => {
    if (!overview) return [];
    return [
      { title: "Members", value: overview.totalUsers, detail: "All registered users" },
      { title: "Mentors", value: overview.mentorCount, detail: "Active mentor partners" },
      { title: "Pending Invites", value: overview.pendingInvites, detail: "Waiting for approval" },
      { title: "Registry Items", value: overview.registryItems, detail: "Curated gifts" },
    ];
  }, [overview]);

  return (
    <div className="admin-section space-y-10 pb-16">
      <AdminHero subtext={heroSubtext} email={email} />

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-[var(--tmbc-charcoal)]">Key Performance Indicators</h2>
          {loading && <span className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-mauve)]">Loading</span>}
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.length
            ? stats.map((stat) => (
                <AdminStatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  detail={stat.detail}
                />
              ))
            : Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="h-40 rounded-[2rem] bg-[var(--tmbc-ivory)]/70 shadow-pastel"
                />
              ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-[var(--tmbc-charcoal)]">Quick Actions</h2>
        </div>
        <AdminQuickActions />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-[var(--tmbc-charcoal)]">Recent Logins</h2>
          {!loading && (
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--tmbc-mauve)]">
              Showing {loginEvents.length} entries
            </p>
          )}
        </div>
        <AdminRecentLogins events={loginEvents} loading={loading} />
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 px-6 py-4 text-sm text-rose-700">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}
