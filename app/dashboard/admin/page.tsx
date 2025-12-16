"use client";

import CommunityPanel from "@/components/community/CommunityPanel";
import AdminInsights from "./components/AdminInsights";

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <AdminInsights />

      <section className="rounded-2xl border border-[#E3D1DA] bg-[#FFF8F6] p-6 shadow-sm md:p-8">
        <h2 className="text-3xl font-serif text-[#3E2F35] md:text-4xl">System Overview</h2>
        <p className="mt-2 text-sm text-[#3E2F35]/70 md:text-base">
          Invitations, cohorts, events, and platform health.
        </p>
      </section>
      <CommunityPanel
        title="Admin Community"
        copy="Coordinate with mentors and host studio updates."
        href="/dashboard/member/community"
        cta="Visit community"
      />
    </div>
  );
}
