import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import AdminTable, { type AdminTableColumn } from "@/components/dashboard/admin/AdminTable";
import {
  getAdminRegistryConflicts,
  getAdminRegistryItems,
  getAdminUsers,
  type AdminRegistryItemRow,
} from "@/lib/services/server/admin.service";

type RegistrySearchParams = {
  user?: string;
  status?: string;
};

const STATUSES = ["CONSIDERING", "PURCHASED", "PURCHASED_ELSEWHERE", "ORDERED", "SHIPPED"];

export default async function AdminRegistryPage({ searchParams }: { searchParams: { user?: string; status?: string } }) {
  const params: RegistrySearchParams = {
    user: searchParams.user,
    status: searchParams.status,
  };

  const [items, conflicts, users] = await Promise.all([
    getAdminRegistryItems({ userId: params.user, status: params.status }),
    getAdminRegistryConflicts(),
    getAdminUsers(),
  ]);

  const mentorAddedCount = items.filter((item) => item.addedByMentor).length;
  const activeFilters = [params.user, params.status].filter(Boolean);

  const columns: AdminTableColumn<AdminRegistryItemRow>[] = [
    {
      header: "Member",
      render: (row: typeof items[number]) => row.userName,
    },
    {
      header: "Item",
      render: (row: typeof items[number]) => `${row.title} • ${row.merchant}`,
    },
    {
      header: "Section",
      accessor: "section",
    },
    {
      header: "Status",
      accessor: "status",
    },
    {
      header: "Mentor added",
      render: (row: typeof items[number]) => (row.addedByMentor ? "Yes" : "No"),
    },
    {
      header: "Updated",
      render: (row: typeof items[number]) =>
        new Date(row.updatedAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        }),
    },
  ];

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-[#E5D4DB] bg-white/90 p-6 shadow-[0_20px_50px_rgba(62,47,53,0.12)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Admin · Registry</p>
        <h1 className="mt-1 text-4xl font-serif text-[#3E2F35]">Registry oversight</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Monitor items, resolve conflicts, and see every mentor contribution to member registries.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#E5D4DB] bg-white/95 p-4 text-sm">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Filters</p>
          {activeFilters.length === 0 ? (
            <p className="mt-2 text-sm text-[#3E2F35]/70">Showing all registry activity.</p>
          ) : (
            <p className="mt-2 text-sm text-[#3E2F35]/70">Filters: {activeFilters.join(" · ")}</p>
          )}
          <form method="get" className="mt-3 flex flex-col gap-3">
            <label className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">
              Member
              <select
                name="user"
                defaultValue={params.user ?? ""}
                className="mt-1 w-full rounded-2xl border border-[#E5D4DB] bg-white px-3 py-2 text-sm"
              >
                <option value="">All members</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[0.65rem] uppercase tracking-[0.3em] text-[#C8A1B4]">
              Status
              <select
                name="status"
                defaultValue={params.status ?? ""}
                className="mt-1 w-full rounded-2xl border border-[#E5D4DB] bg-white px-3 py-2 text-sm"
              >
                <option value="">All statuses</option>
                {STATUSES.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="rounded-2xl border border-[#C29EB3] bg-[#C29EB3] px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[#AE8CA3]"
            >
              Apply filters
            </button>
          </form>
        </div>
        <div className="rounded-2xl border border-[#E5D4DB] bg-white/95 p-4 text-sm">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Mentor-added count</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{mentorAddedCount}</p>
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Total items flagged by mentors</p>
        </div>
        <div className="rounded-2xl border border-[#E5D4DB] bg-white/95 p-4 text-sm">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#C8A1B4]">Conflicts</p>
          <p className="mt-2 text-3xl font-semibold text-[#3E2F35]">{conflicts.length}</p>
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Unresolved sync issues</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#E5D4DB] bg-white/95 p-6 shadow-[0_12px_50px_rgba(62,47,53,0.12)]">
        <h2 className="text-2xl font-semibold text-[#3E2F35]">Registry items</h2>
        {items.length === 0 ? (
          <EmptyState
            title="No matches"
            description="Try expanding or clearing your filters to see more registry activity."
          />
        ) : (
          <div className="mt-4">
            <AdminTable
              rows={items}
              columns={columns}
              rowKey={(row) => row.id}
              className="text-sm"
            />
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#3E2F35]">Active conflicts</h2>
        {conflicts.length === 0 ? (
          <EmptyState
            title="Conflicts resolved"
            description="No unresolved registry conflicts at the moment."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {conflicts.map((conflict) => (
              <div
                key={conflict.id}
                className="rounded-[1.5rem] border border-[#E5D4DB] bg-white/95 p-5 shadow-[0_12px_40px_rgba(62,47,53,0.08)]"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Member</p>
                <p className="text-lg font-semibold text-[#3E2F35]">{conflict.userName}</p>
                <p className="mt-1 text-sm text-[#3E2F35]/70">
                  {conflict.field} · {conflict.section} · {conflict.status}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.35em] text-[#C8A1B4]">
                  Reported {new Date(conflict.createdAt).toLocaleString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
