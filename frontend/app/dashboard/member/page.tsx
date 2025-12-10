"use client";

import type { ReactNode } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function MemberDashboard() {
  return (
    <DashboardShell>
      <h1 className="font-serif text-4xl text-[#3E2F35] mb-4">Welcome back, love. 💗</h1>
      <p className="text-[#3E2F35]/70 max-w-xl mb-10">
        Your studio is ready — warm, curated, and calm.  
        Pick up where you left off or explore something new today.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card title="Academy Bloom" href="/dashboard/learn" copy="Continue learning">
          📚
        </Card>
        <Card title="Your Registry" href="/dashboard/registry" copy="Curate essentials">
          🎁
        </Card>
        <Card title="Community Rooms" href="/dashboard/community" copy="Connect with others">
          💬
        </Card>
      </div>
    </DashboardShell>
  );
}

function Card({
  title,
  copy,
  href,
  children,
}: {
  title: string;
  copy: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="group rounded-3xl border border-[#E3C6D4] bg-white p-6 shadow-[0_10px_40px_rgba(200,161,180,0.15)] hover:-translate-y-1 transition"
    >
      <div className="text-4xl mb-4">{children}</div>
      <h3 className="font-serif text-xl text-[#3E2F35]">{title}</h3>
      <p className="text-sm text-[#3E2F35]/60 mt-1">{copy}</p>
      <span className="block text-xs text-[#C8A1B4] mt-4 group-hover:text-[#B98AA5]">Open →</span>
    </a>
  );
}
