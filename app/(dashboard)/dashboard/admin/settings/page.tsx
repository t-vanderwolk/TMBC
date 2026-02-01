export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAdminMentors, getAdminSettings } from "@/lib/services/server/admin.service";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const [settings, mentors] = await Promise.all([getAdminSettings(), getAdminMentors()]);

  return (
    <div className="space-y-8">
      <header className="rounded-[2rem] border border-[#E5D4DB] bg-white/90 p-6 shadow-[0_20px_50px_rgba(62,47,53,0.12)]">
        <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Admin · Settings</p>
        <h1 className="mt-1 text-4xl font-serif text-[#3E2F35]">System configuration</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Control onboarding gates, mentor defaults, and other admin behavior from here.
        </p>
      </header>

      <form
        action={updateSettings}
        className="grid gap-6 rounded-[2rem] border border-[#E5D4DB] bg-white/95 p-6 shadow-[0_12px_40px_rgba(62,47,53,0.12)]"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Invite-only</p>
              <p className="text-sm text-[#3E2F35]/70">
                Toggle whether new enrollments require admin approval.
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="hidden" name="inviteOnly" value="false" />
              <input
                type="checkbox"
                name="inviteOnly"
                value="true"
                defaultChecked={settings.inviteOnly}
                className="peer sr-only"
              />
              <span className="inline-flex h-6 w-12 items-center rounded-full border border-[#E5D4DB] bg-white p-1 transition peer-checked:bg-[#C29EB3]">
                <span className="h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-6" />
              </span>
            </label>
          </div>
        </div>

        <div className="grid gap-2">
          <p className="text-xs uppercase tracking-[0.5em] text-[#C8A1B4]">Default mentor</p>
          <select
            name="defaultMentorId"
            defaultValue={settings.defaultMentorId ?? ""}
            className="rounded-2xl border border-[#E5D4DB] bg-white px-4 py-3 text-sm"
          >
            <option value="">Assign later</option>
            {mentors.length === 0 ? (
              <option disabled value="">
                No mentors detected
              </option>
            ) : (
              mentors.map((mentor) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.name}
                </option>
              ))
            )}
          </select>
          <p className="text-xs text-[#3E2F35]/70">
            Members without a mentor will default to this selection when approved.
            {!mentors.length && " Invite mentors to unlock this default."}
          </p>
        </div>

        <button
          type="submit"
          className="rounded-2xl border border-[#C29EB3] bg-[#C29EB3] px-6 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-[#AE8CA3]"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
