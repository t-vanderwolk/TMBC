"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  createAdminEvent,
  deleteAdminEvent,
  getAdminDashboard,
  getInviteRequests,
} from "@/lib/api/admin";
import { useEvents } from "@/hooks/useEvents";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { useRequireRole } from "@/lib/auth/useRequireRole";

type AdminDashboardPayload = {
  totalMembers?: number;
  members?: number;
  totalMentors?: number;
  mentors?: number;
  admins?: number;
  waitlist?: number;
  pendingInvites?: number;
  registrySeries?: Array<{ label: string; count: number }>;
  systemActivity?: Array<{ id: string; summary: string; timestamp: string }>;
};

export default function AdminDashboardPage() {
  useRequireRole("ADMIN");

  const [dashboard, setDashboard] = useState<AdminDashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const { data: adminEvents, loading: adminEventsLoading, error: adminEventsError, refresh: refreshAdminEvents } =
    useEvents();
  const [eventForm, setEventForm] = useState({ name: "", date: "", location: "" });
  const [savingEvent, setSavingEvent] = useState(false);
  const [pendingInvites, setPendingInvites] = useState(0);
  const { user: guardUser, loading: guardLoading } = requireAdmin();

  useEffect(() => {
    if (!guardUser) return;
    setToken(guardUser.token ?? null);
  }, [guardUser]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    getAdminDashboard(token)
      .then((response) => {
        setDashboard(response.data);
      })
      .catch(() => {
        setError("Unable to load admin analytics.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const memberCount = dashboard?.totalMembers ?? dashboard?.members ?? 0;
  const mentorCount = dashboard?.totalMentors ?? dashboard?.mentors ?? 0;

  const registrySeries = dashboard?.registrySeries ?? [];

  const systemUpdates = dashboard?.systemActivity ?? [];

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    getInviteRequests()
      .then((response) => {
        if (!mounted) return;
        const list = response.data?.data ?? response.data ?? [];
        setPendingInvites(list.length ?? 0);
      })
      .catch((err) => {
        console.error("Unable to load invite requests", err);
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  const kpis = useMemo(
    () => [
      { label: "Members", value: memberCount, detail: "Live membership" },
      { label: "Mentors", value: mentorCount, detail: "Guides online" },
      { label: "Upcoming events", value: adminEvents.length, detail: "Scheduled gatherings" },
      { label: "Pending invites", value: pendingInvites, detail: "Awaiting approval" },
    ],
    [memberCount, mentorCount, adminEvents.length, pendingInvites],
  );

  const handleEventSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!eventForm.name || !eventForm.date) return;
    setSavingEvent(true);
    try {
      await createAdminEvent({
        name: eventForm.name,
        date: eventForm.date,
        location: eventForm.location,
      });
      setEventForm({ name: "", date: "", location: "" });
      await refreshAdminEvents();
    } catch (err) {
      console.error("Unable to create event", err);
    } finally {
      setSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteAdminEvent(eventId);
      await refreshAdminEvents();
    } catch (err) {
      console.error("Unable to delete event", err);
    }
  };

  if (guardLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-20 text-sm uppercase tracking-[0.5em] text-[#C8A1B4]">
        Aligning the admin signal…
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
    <main className="space-y-10 px-4 py-8 text-[#3E2F35] sm:px-6">
      <section className="rounded-[2.5rem] border border-[#EAD4D8] bg-gradient-to-br from-[#FFF8F6] via-[#FBE9EE] to-[#F0D4D9]/70 p-6 shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#3E2F35]/70">Admin console</p>
        <h1 className="mt-2 font-serif text-3xl text-[#3E2F35]">Phase 2 oversight</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          KPI tiles, registry pulses, and quick links keep the TMBC studio moving with intentional
          mauve energy.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((tile) => (
          <article
            key={tile.label}
            className="flex flex-col justify-between rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-5 shadow-[0_18px_60px_rgba(180,143,164,0.2)] transition hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(180,143,164,0.35)]"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">{tile.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{tile.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">{tile.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif text-[#3E2F35]">Registry analytics</h2>
            <p className="text-xs uppercase tracking-[0.35em] text-[#3E2F35]/60">Last 30 days</p>
          </div>
          <ul className="mt-5 space-y-4">
            {registrySeries.length ? (
              registrySeries.map((item) => (
                <li key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-[#3E2F35]/70">
                    <span>{item.label}</span>
                    <span className="text-[#3E2F35]">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#FFEAF0]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C8A1B4] to-[#B98AA5]"
                      style={{ width: `${Math.min(100, (item.count / Math.max(1, registrySeries[0].count)) * 100)}%` }}
                    />
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-[#3E2F35]/60">No registry momentum is available yet.</li>
            )}
          </ul>
        </article>
        <article className="rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)]">
          <h2 className="text-xl font-serif text-[#3E2F35]">Quick actions</h2>
          <div className="mt-5 space-y-3 text-sm">
            {[
              { label: "Invites", href: "/dashboard/admin/invites" },
              { label: "Waitlist", href: "/dashboard/admin/waitlist" },
              { label: "Settings", href: "/dashboard/admin/settings" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-[1.5rem] border border-[#C8A1B4]/20 bg-gradient-to-r from-[#FFF8F6] to-[#F0D4D9] px-4 py-3 font-semibold uppercase tracking-[0.35em] text-[#3E2F35] transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(180,143,164,0.25)]"
              >
                <span>{link.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">System activity</p>
            <ul className="space-y-2">
              {systemUpdates.length ? (
                systemUpdates.map((update) => (
                  <li key={update.id} className="rounded-xl bg-[#FFFAF8] px-3 py-2 text-[0.75rem] text-[#3E2F35]/80">
                    <p>{update.summary}</p>
                    <p className="mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-[#3E2F35]/50">
                      {update.timestamp}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-[0.75rem] text-[#3E2F35]/60">Awaiting more system signals.</li>
              )}
            </ul>
          </div>
        </article>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.2)] md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-serif text-[#3E2F35]">Manage events</h2>
            <p className="text-sm text-[#3E2F35]/70">
              Add live gatherings or edit rehearsals that keep the village feeling calm.
            </p>
          </div>
          <form
            onSubmit={handleEventSubmit}
            className="flex flex-wrap items-center gap-3"
          >
            <input
              type="text"
              value={eventForm.name}
              onChange={(event) => setEventForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Event name"
              className="rounded-full border border-[#E3C6D4] bg-[#FFFAF8]/80 px-4 py-2 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none"
              required
            />
            <input
              type="datetime-local"
              value={eventForm.date}
              onChange={(event) => setEventForm((prev) => ({ ...prev, date: event.target.value }))}
              className="rounded-full border border-[#E3C6D4] bg-[#FFFAF8]/80 px-4 py-2 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none"
              required
            />
            <input
              type="text"
              value={eventForm.location}
              onChange={(event) => setEventForm((prev) => ({ ...prev, location: event.target.value }))}
              placeholder="Location"
              className="rounded-full border border-[#E3C6D4] bg-[#FFFAF8]/80 px-4 py-2 text-sm text-[#3E2F35] focus:border-[#C8A1B4] focus:outline-none"
            />
            <button
              type="submit"
              disabled={savingEvent}
              className="rounded-full bg-[#C8A1B4] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#b88aa5] disabled:opacity-70"
            >
              {savingEvent ? "Saving…" : "Create event"}
            </button>
          </form>
        </div>
        <div className="space-y-4 rounded-[2rem] border border-[#E3C6D4] bg-white/90 p-6 shadow-[0_18px_60px_rgba(180,143,164,0.15)]">
          {adminEventsLoading && (
            <p className="text-sm uppercase tracking-[0.4em] text-[#C8A1B4]">Loading events…</p>
          )}
          {adminEventsError && (
            <p className="text-sm text-[#3E2F35]/70">{adminEventsError}</p>
          )}
          {!adminEventsLoading && !adminEventsError && (
            <div className="space-y-3">
              {adminEvents.length ? (
                adminEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-[#E3C6D4] bg-[#FFFAF8]/80 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#3E2F35]">{event.name}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#3E2F35]/60">
                        {new Date(event.date).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-[#C8A1B4]/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-[#3E2F35]">
                        {event.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A1B4] underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#3E2F35]/70">No events have been scheduled yet.</p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
