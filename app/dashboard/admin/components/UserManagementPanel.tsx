"use client";

import { useMemo, useState } from "react";

import type { AdminUser } from "@/lib/services/server/admin.service";
import { updateUserRole, updateUserStatus } from "@/app/dashboard/admin/actions";

const ROLE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Members", value: "member" },
  { label: "Mentors", value: "mentor" },
  { label: "Admins", value: "admin" },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const statusBadge = (status: "active" | "disabled") =>
  status === "active"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";

export default function UserManagementPanel({ users }: { users: AdminUser[] }) {
  const [filter, setFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    if (filter === "all") return users;
    return users.filter((user) => user.role === filter);
  }, [filter, users]);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedCode(value);
      window.setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      setCopiedCode(null);
    }
  };

  const totalMembers = filteredUsers.length;

  return (
    <section className="rounded-3xl border border-[#E3D0D7] bg-white/90 p-6 shadow-[0_30px_60px_rgba(62,47,53,0.2)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Admin · Users</p>
          <h2 className="text-3xl font-serif text-[#3E2F35]">User directory</h2>
          <p className="text-sm text-[#3E2F35]/70">
            {totalMembers} {totalMembers === 1 ? "membership record" : "memberships"} displayed.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition ${
                filter === option.value
                  ? "bg-[#3E2F35] text-white"
                  : "border border-[#E3D0D7] text-[#3E2F35]/80 hover:border-[#C8A1B4]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-[640px] w-full table-auto text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
              <th className="px-3 py-3">Member</th>
              <th className="px-3 py-3">Role</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Progress</th>
              <th className="px-3 py-3">Mentor</th>
              <th className="px-3 py-3">Invite</th>
              <th className="px-3 py-3">Joined</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3D0D7] text-[#3E2F35]">
            {filteredUsers.map((user) => {
              const isDisabled = user.status === "disabled";
              const targetStatus = isDisabled ? "active" : "disabled";
              return (
                <tr key={user.id} className="hover:bg-[#F8F2F6] transition-colors">
                  <td className="px-3 py-4">
                    <p className="font-semibold text-[#3E2F35]">{user.name}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#C8A1B4]">{user.email}</p>
                  </td>
                  <td className="px-3 py-4">
                    <form action={updateUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="rounded-full border border-[#E3D0D7] px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em]"
                      >
                        <option value="member">Member</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-full bg-[#C8A1B4] px-3 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-white"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.4em] ${statusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] ${
                          user.onboardingComplete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {user.onboardingComplete ? "Onboarding ✓" : "Onboarding"}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.3em] ${
                          user.profileCompleted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {user.profileCompleted ? "Profile ✓" : "Profile"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4">{user.mentorName ?? "Unassigned"}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{user.inviteCode ?? "—"}</span>
                      {user.inviteCode && (
                        <button
                          type="button"
                          onClick={() => handleCopy(user.inviteCode!)}
                          className="text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[#C8A1B4]"
                        >
                          {copiedCode === user.inviteCode ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4">{formatDate(user.joinedAt)}</td>
                  <td className="px-3 py-4 text-right">
                    <form
                      action={updateUserStatus}
                      onSubmit={(event) => {
                        if (!isDisabled && !window.confirm("Disable this user? They will be unable to log in.")) {
                          event.preventDefault();
                        }
                      }}
                      className="inline-flex items-center gap-2"
                    >
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="status" value={targetStatus} />
                      <button
                        type="submit"
                        className={`rounded-full px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] ${
                          isDisabled ? "border border-[#E3D0D7] text-[#3E2F35]" : "bg-rose-500 text-white"
                        }`}
                      >
                        {isDisabled ? "Re-Enable" : "Disable"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-[#E3D0D7] bg-[#FFFAF8]/80 p-6 text-sm text-[#3E2F35]/70">
            No matching users yet. Try another filter.
          </div>
        )}
      </div>
    </section>
  );
}
