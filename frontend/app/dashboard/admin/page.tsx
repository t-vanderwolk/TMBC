"use client";

import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AdminDashboard() {
  return (
    <DashboardShell>
      <h1 className="font-serif text-4xl text-[#3E2F35] mb-4">Admin Command Center ✨</h1>
      <p className="text-[#3E2F35]/70 max-w-xl mb-10">
        Oversee invites, users, waitlist, settings, and the health of your TMBC universe.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminCard title="Users" href="/dashboard/admin/users">
          🧑‍🤝‍🧑
        </AdminCard>
        <AdminCard title="Invites" href="/dashboard/admin/invites">
          📨
        </AdminCard>
        <AdminCard title="Waitlist" href="/dashboard/admin/waitlist">
          ⏳
        </AdminCard>
        <AdminCard title="Settings" href="/dashboard/admin/settings">
          ⚙️
        </AdminCard>
      </div>
    </DashboardShell>
  );
}

function AdminCard({
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
