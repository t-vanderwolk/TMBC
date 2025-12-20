export const dynamic = "force-dynamic";
export const revalidate = 0;

import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import AdminTable, { type AdminTableColumn } from "@/components/dashboard/admin/AdminTable";
import { getLoginEvents } from "@/lib/services/server/loginEvent.service";

export default async function AdminLogsPage() {
  const events = await getLoginEvents();

  const columns: AdminTableColumn<typeof events[number]>[] = [
    {
      header: "Email",
      render: (row: typeof events[number]) => row.email,
    },
    {
      header: "Role",
      render: (row: typeof events[number]) => row.role ?? "unknown",
    },
    {
      header: "Success",
      render: (row: typeof events[number]) => (row.success ? "Success" : "Failed"),
    },
    {
      header: "Timestamp",
      render: (row: typeof events[number]) =>
        new Date(row.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
    },
    {
      header: "IP",
      accessor: "ip",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-[#E5D4DB] bg-white/90 p-6 shadow-[0_20px_50px_rgba(62,47,53,0.12)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Admin · Logs</p>
        <h1 className="mt-1 text-4xl font-serif text-[#3E2F35]">Login & audit logs</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Surface every login attempt so you can monitor suspicious activity across members and mentors.
        </p>
      </header>

      <section className="rounded-[2rem] border border-[#E5D4DB] bg-white/95 p-6 shadow-[0_12px_50px_rgba(62,47,53,0.12)]">
        <h2 className="text-2xl font-semibold text-[#3E2F35]">Recent login attempts</h2>
        {events.length === 0 ? (
          <EmptyState
            title="Nothing logged yet"
            description="Login attempts will populate here as people access the platform."
          />
        ) : (
          <div className="mt-4">
            <AdminTable rows={events} columns={columns} rowKey={(event) => event.id} />
          </div>
        )}
      </section>
    </div>
  );
}
