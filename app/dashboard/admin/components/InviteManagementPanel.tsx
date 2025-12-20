"use client";

import { useMemo } from "react";

import type { AdminInvite } from "@/lib/services/server/invite.service";
import { createAdminInvite, revokeAdminInvite } from "@/app/dashboard/admin/actions";

const STATUS_ORDER: Record<AdminInvite["status"], { label: string; tone: string }> = {
  active: { label: "Active", tone: "bg-emerald-100 text-emerald-700" },
  used: { label: "Used", tone: "bg-[#E3D0D7] text-[#3E2F35]" },
  expired: { label: "Expired", tone: "bg-amber-100 text-amber-700" },
  revoked: { label: "Revoked", tone: "bg-rose-100 text-rose-700" },
};

const formatTimestamp = (value?: Date | string) =>
  value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

export default function InviteManagementPanel({ invites }: { invites: AdminInvite[] }) {
  const summary = useMemo(() => {
    const counters: Record<AdminInvite["status"], number> = {
      active: 0,
      used: 0,
      expired: 0,
      revoked: 0,
    };
    invites.forEach((invite) => {
      counters[invite.status] += 1;
    });
    return counters;
  }, [invites]);

  return (
    <section className="space-y-6 rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_60px_rgba(62,47,53,0.2)]">
      <div className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Admin · Invites</p>
        <h2 className="text-3xl font-serif text-[#3E2F35]">Invite management</h2>
        <p className="text-sm text-[#3E2F35]/70">
          Generate codes, monitor usage, and revoke entries that are no longer needed.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.keys(summary).map((status) => (
          <div
            key={status}
            className="rounded-2xl border border-[#E3D0D7] bg-[#FFF8F6]/70 px-4 py-3 text-sm"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">{status}</p>
            <p className="mt-1 text-3xl font-serif text-[#3E2F35]">{summary[status as AdminInvite["status"]] ?? 0}</p>
            <p className="text-[0.65rem] text-[#3E2F35]/60">codes</p>
          </div>
        ))}
      </div>

      <form action={createAdminInvite} className="space-y-4 rounded-2xl border border-dashed border-[#E3D0D7] bg-[#FFFBFA]/80 p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
            Role
            <select name="role" defaultValue="member" className="rounded-full border border-[#E3D0D7] px-4 py-2 text-sm">
              <option value="member">Member</option>
              <option value="mentor">Mentor</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
            Email (optional)
            <input
              name="email"
              type="email"
              placeholder="invitee@email.com"
              className="rounded-full border border-[#E3D0D7] px-4 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-[0.35em] text-[#3E2F35]/70">
            Max uses
            <input
              name="maxUses"
              type="number"
              min={1}
              defaultValue={1}
              className="rounded-full border border-[#E3D0D7] px-4 py-2 text-sm"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <p className="text-xs text-[#3E2F35]/70">
            Invite expires when used. Use the table below to revoke unused codes.
          </p>
          <button
            type="submit"
            className="rounded-full bg-[#3E2F35] px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white"
          >
            Generate invite
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead>
            <tr className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
              <th className="px-3 py-3 text-left">Code</th>
              <th className="px-3 py-3 text-left">Email</th>
              <th className="px-3 py-3 text-left">Role</th>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-left">Created</th>
              <th className="px-3 py-3 text-left">Expires</th>
              <th className="px-3 py-3 text-left">Used by</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3D0D7] text-[#3E2F35]">
            {invites.map((invite) => (
              <tr key={invite.id} className="hover:bg-[#F8F2F6]">
                <td className="px-3 py-4 font-mono text-xs">{invite.code}</td>
                <td className="px-3 py-4">{invite.email ?? "—"}</td>
                <td className="px-3 py-4 capitalize">{invite.role.toLowerCase()}</td>
                <td className="px-3 py-4">
                  <span className={`rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] ${STATUS_ORDER[invite.status].tone}`}>
                    {STATUS_ORDER[invite.status].label}
                  </span>
                </td>
                <td className="px-3 py-4">{formatTimestamp(invite.createdAt)}</td>
                <td className="px-3 py-4">{formatTimestamp(invite.expiresAt ?? undefined)}</td>
                <td className="px-3 py-4">{invite.usedBy?.name ?? "—"}</td>
                <td className="px-3 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(invite.code)}
                      className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]"
                    >
                      Copy
                    </button>
                    {invite.status === "active" && (
                      <form
                        action={revokeAdminInvite}
                        method="post"
                        className="inline"
                        onSubmit={(event) => {
                          if (!window.confirm("Revoke this invite? It will no longer be possible to redeem.")) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="code" value={invite.code} />
                        <button
                          type="submit"
                          className="rounded-full border border-[#E3D0D7] px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-rose-600"
                        >
                          Revoke
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {invites.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-[#3E2F35]/70">
                  No invites yet. Create one above to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
