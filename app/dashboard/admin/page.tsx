"use client";

import CommunityPanel from "@/components/community/CommunityPanel";
import AdminInsights from "./components/AdminInsights";

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <AdminInsights />

      <section className="rounded-[2.5rem] p-10 bg-[#FFF8F6] shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <h2 className="text-4xl font-serif">System Overview</h2>
        <p className="mt-2 text-[#3E2F35]/70">
          Invitations, cohorts, events, and platform health.
        </p>
      </section>
      <CommunityPanel
        title="Admin Community"
        copy="Coordinate with mentors and host studio updates."
        href="/dashboard/community"
        cta="Visit community"
      />
    </div>
  );
}
