export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

import { EmptyState } from "@/components/dashboard/shared/EmptyState";
import { getAdminMemberRoster, getAdminMentors } from "@/lib/services/server/admin.service";
import { assignUserMentor } from "@/app/(dashboard)/dashboard/admin/actions";

export default async function AdminMentorsPage() {
  const [mentors, members] = await Promise.all([getAdminMentors(), getAdminMemberRoster()]);

  if (!mentors.length) {
    return (
      <EmptyState
        title="Mentors are offline today"
        description="Once mentors join the platform, their summary cards will populate here."
      />
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-[#E5D4DB] bg-white/90 p-6 shadow-[0_20px_50px_rgba(62,47,53,0.12)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Admin · Mentors</p>
        <h1 className="mt-1 text-4xl font-serif text-[#3E2F35]">Mentor oversight</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Review mentor performance, view their profile, and move members between mentors as needed.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {mentors.map((mentor) => (
          <article
            key={mentor.id}
            className="flex flex-col justify-between gap-4 rounded-[2rem] border border-[#E5D4DB] bg-white/95 p-6 shadow-[0_12px_40px_rgba(62,47,53,0.12)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#3E2F35]">{mentor.name}</h2>
                <span className="rounded-full border border-[#E5D4DB] px-3 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-[#3E2F35]">
                  {mentor.lastActive}
                </span>
              </div>
              <p className="text-sm text-[#3E2F35]/70">
                {mentor.mentees} assigned member{mentor.mentees !== 1 ? "s" : ""} · {mentor.performance.eventsHosted} hosted events
              </p>
            </div>
            <div className="grid gap-2 text-sm text-[#3E2F35]">
              <p>
                Workbook feedback: <strong>{mentor.performance.workbookFeedback}</strong>
              </p>
              <p>
                Registry notes: <strong>{mentor.performance.registryNotes}</strong>
              </p>
              <p>
                Events hosted: <strong>{mentor.performance.eventsHosted}</strong>
              </p>
            </div>
            <Link
              href={`/dashboard/admin/users?mentorId=${mentor.id}`}
              className="mt-auto inline-flex items-center justify-center rounded-full border border-[#C29EB3] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#C29EB3] transition hover:bg-[#F6EBF2]"
            >
              View mentor profile
            </Link>
          </article>
        ))}
      </div>

      <section className="rounded-[2rem] border border-[#E5D4DB] bg-white/95 p-6 shadow-[0_12px_40px_rgba(62,47,53,0.12)]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#3E2F35]">Reassign members</h2>
          <p className="text-xs uppercase tracking-[0.4em] text-[#C8A1B4]">Mentor Transfers</p>
        </div>
        <form action={assignUserMentor} className="mt-5 flex flex-col gap-3 lg:flex-row">
          <label className="flex-1">
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">Member</span>
            <select
              name="userId"
              required
              className="mt-2 w-full rounded-2xl border border-[#E5D4DB] bg-white px-4 py-3 text-sm"
            >
              <option value="">Select a member</option>
              {members.slice(0, 25).map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1">
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#C8A1B4]">New mentor</span>
            <select
              name="mentorId"
              className="mt-2 w-full rounded-2xl border border-[#E5D4DB] bg-white px-4 py-3 text-sm"
            >
              <option value="">Unassigned</option>
              {mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl border border-[#C29EB3] bg-[#C29EB3] px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-[#AE8CA3] lg:w-auto"
          >
            Reassign
          </button>
        </form>
      </section>
    </div>
  );
}
