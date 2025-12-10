"use client";

import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function MentorDashboard() {
  return (
    <DashboardShell>
      <h1 className="font-serif text-4xl text-[#3E2F35] mb-4">Mentor Studio 🌿</h1>
      <p className="text-[#3E2F35]/70 max-w-xl mb-10">
        Your presence sets the tone.  
        Review members, manage circles, and guide families with your signature TMBC touch.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MentorCard title="Member List" href="/dashboard/mentor/members">
          👶
        </MentorCard>
        <MentorCard title="Events" href="/dashboard/mentor/events">
          📆
        </MentorCard>
        <MentorCard title="Workspace" href="/dashboard/mentor/workspace">
          📝
        </MentorCard>
      </div>
    </DashboardShell>
  );
}

function MentorCard({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="group rounded-3xl border border-[#D7BDCB] bg-white p-6 shadow-[0_10px_40px_rgba(180,143,164,0.15)] hover:-translate-y-1 transition"
    >
      <div className="text-4xl mb-4">{children}</div>
      <h3 className="font-serif text-xl text-[#3E2F35]">{title}</h3>
      <span className="block text-xs text-[#C8A1B4] mt-4 group-hover:text-[#B98AA5]">Open →</span>
    </a>
  );
}
