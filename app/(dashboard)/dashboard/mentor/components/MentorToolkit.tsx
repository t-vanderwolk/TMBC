"use client";

import ActionButton from "@/components/dashboard/ui/ActionButton";
import DashboardCard from "@/components/dashboard/ui/DashboardCard";

export default function MentorToolkit() {
  return (
    <DashboardCard className="space-y-4 p-6 md:p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Mentor toolkit</p>
        <h2 className="font-serif text-2xl text-[#3E2F35] md:text-3xl">Mentor Toolkit</h2>
      </div>
      <p className="text-sm text-[#3E2F35]/70 md:text-base">
        Quick access to your studio tools.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <ActionButton
          href="/dashboard/mentor/messages"
          variant="ghost"
          className="sm:w-auto"
          fullWidth
        >
          Respond to messages
        </ActionButton>
        <ActionButton
          href="/dashboard/events"
          variant="ghost"
          className="sm:w-auto"
          fullWidth
        >
          Host a session
        </ActionButton>
        <ActionButton
          href="/dashboard/member/community"
          variant="ghost"
          className="sm:w-auto"
          fullWidth
        >
          Moderate community rooms
        </ActionButton>
        <ActionButton
          href="/dashboard/mentor/workspace"
          variant="ghost"
          className="sm:w-auto"
          fullWidth
        >
          Open Mentor Workspace
        </ActionButton>
      </div>
    </DashboardCard>
  );
}
