import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { getAdminMentors, getAdminUsers } from "@/lib/services/server/admin.service";
import { assignUserMentor, updateUserRole, updateUserStatus } from "@/app/(dashboard)/dashboard/admin/actions";

const statusBadge = {
  active: "bg-emerald-100 text-emerald-700",
  disabled: "bg-rose-100 text-rose-700",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default async function AdminUsersPage() {
  const [users, mentors] = await Promise.all([getAdminUsers(), getAdminMentors()]);

  if (!users.length) {
    return (
      <EmptyState
        title="No users found"
        description="Once someone registers or a mentor is added, their record appears here."
      />
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-[#E5D4DB] bg-white/90 p-6 shadow-[0_20px_50px_rgba(62,47,53,0.12)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Admin · Users</p>
        <h1 className="mt-1 text-4xl font-serif text-[#3E2F35]">Member directory</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Review every member, mentor, and admin account. Adjust status, reassign mentors, and keep
          the roster accurate.
        </p>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-[#E5D4DB] bg-white/95 p-4 shadow-[0_20px_50px_rgba(62,47,53,0.12)]">
        <table className="min-w-[900px] w-full table-auto text-sm">
          <thead className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
            <tr>
              <th className="px-3 py-3 text-left">Member</th>
              <th className="px-3 py-3 text-left">Role</th>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-left">Progress</th>
              <th className="px-3 py-3 text-left">Mentor</th>
              <th className="px-3 py-3 text-left">Joined</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5D4DB] text-[#3E2F35]">
            {users.map((user) => {
              const isDisabled = user.status === "disabled";
              return (
                <tr key={user.id} className="hover:bg-[#F9F6F7] transition-colors">
                  <td className="px-3 py-4">
                    <p className="font-semibold text-[#3E2F35]">{user.name}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#C8A1B4]">{user.email}</p>
                  </td>
                  <td className="px-3 py-4">
                    <form action={updateUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="rounded-full border border-[#E5D4DB] bg-white px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em]"
                      >
                        <option value="member">Member</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-full bg-[#C29EB3] px-3 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[#AE8CA3]"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] ${statusBadge[user.status]}`}
                    >
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
                  <td className="px-3 py-4">
                    {user.role === "member" ? (
                      <form className="flex items-center gap-2" action={assignUserMentor}>
                        <input type="hidden" name="userId" value={user.id} />
                        <select
                          name="mentorId"
                          defaultValue={user.mentorId ?? ""}
                          className="rounded-full border border-[#E5D4DB] bg-white px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em]"
                        >
                          <option value="">Unassigned</option>
                          {mentors.map((mentor) => (
                            <option key={mentor.id} value={mentor.id}>
                              {mentor.name} ({mentor.mentees} mentees)
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-full border border-[#E5D4DB] px-3 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-[#3E2F35]"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <span className="text-[0.6rem] uppercase tracking-[0.4em] text-[#C8A1B4]">
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">{formatDate(user.joinedAt)}</td>
                  <td className="px-3 py-4 text-right">
                    <form action={updateUserStatus} className="inline-flex items-center gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="status" value={isDisabled ? "active" : "disabled"} />
                      <button
                        type="submit"
                        className={`rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.32em] ${
                          isDisabled
                            ? "border border-[#E5D4DB] text-[#3E2F35]"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {isDisabled ? "Re-enable" : "Disable"}
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
