import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { getAdminEvents } from "@/lib/services/server/admin.service";
import { cancelEvent, createEvent, updateEvent } from "@/app/(dashboard)/dashboard/admin/actions";

const formatEventDate = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const toDateTimeLocal = (value?: string) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-[#E5D4DB] bg-white/90 p-6 shadow-[0_20px_50px_rgba(62,47,53,0.12)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Admin · Events</p>
        <h1 className="mt-1 text-4xl font-serif text-[#3E2F35]">Events management</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Create, update, or cancel events and keep your community informed.
        </p>
      </header>

      {events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create your first experience to share with members and mentors."
        />
      ) : (
        <section className="grid gap-6">
          {events.map((event) => (
            <article
              key={event.id}
              className="rounded-[2rem] border border-[#E5D4DB] bg-white/95 p-6 shadow-[0_15px_50px_rgba(62,47,53,0.08)]"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-[#3E2F35]">{event.name}</h2>
                  <p className="text-sm text-[#3E2F35]/70">
                    {formatEventDate(event.date)} · {event.location ?? "Location TBD"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-[#E5D4DB] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]">
                    {event.status}
                  </span>
                  <span className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">
                    RSVPs: {event.rsvpCount}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <form action={cancelEvent}>
                  <input type="hidden" name="eventId" value={event.id} />
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-[#F4C2D3] px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-[#C85A78] transition hover:bg-[#FDF0F4]"
                  >
                    Cancel event
                  </button>
                </form>
                <details className="rounded-2xl border border-[#E5D4DB]">
                  <summary className="px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-[#3E2F35]">
                    Edit event
                  </summary>
                  <form action={updateEvent} className="flex flex-col gap-3 px-4 pb-4">
                    <input type="hidden" name="eventId" value={event.id} />
                    <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                      Name
                      <input
                        type="text"
                        name="name"
                        defaultValue={event.name}
                        className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                      Date
                      <input
                        type="datetime-local"
                        name="date"
                        defaultValue={toDateTimeLocal(event.date)}
                        className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                      Location
                      <input
                        type="text"
                        name="location"
                        defaultValue={event.location ?? ""}
                        className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
                      Status
                      <select
                        name="status"
                        defaultValue={event.status}
                        className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-3 py-2 text-sm"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </label>
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-[#C29EB3] px-4 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[#AE8CA3]"
                    >
                      Save changes
                    </button>
                  </form>
                </details>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="rounded-[2rem] border border-[#E5D4DB] bg-white/95 p-6 shadow-[0_12px_40px_rgba(62,47,53,0.12)]">
        <h2 className="text-2xl font-semibold text-[#3E2F35]">Create a new event</h2>
        <form action={createEvent} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
            Event name
            <input
              type="text"
              name="name"
              required
              className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-4 py-3 text-sm"
            />
          </label>
          <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
            Date
            <input
              type="datetime-local"
              name="date"
              required
              className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-4 py-3 text-sm"
            />
          </label>
          <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
            Location
            <input
              type="text"
              name="location"
              className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-4 py-3 text-sm"
            />
          </label>
          <label className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">
            Status
            <select
              name="status"
              defaultValue="scheduled"
              className="mt-1 w-full rounded-2xl border border-[#E5D4DB] px-4 py-3 text-sm"
            >
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-2xl border border-[#C29EB3] bg-[#C29EB3] px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[#AE8CA3] md:col-span-2"
          >
            Save event
          </button>
        </form>
      </section>
    </div>
  );
}
