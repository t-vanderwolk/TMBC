"use client";

import { useRequireRole } from "@/lib/auth/useRequireRole";

export default function MentorInsightsPage() {
  useRequireRole(["MENTOR", "ADMIN"]);

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Insights</p>
        <h1 className="font-serif text-3xl text-[#3E2F35]">Mentor insights</h1>
        <p className="mt-2 text-sm text-[#3E2F35]/70">
          Coming soon. This will remain a calm, read-only overview of mentor activity.
        </p>
      </header>
      {/* TODO: Phase 3 will populate this section with read-only mentor summaries. */}
    </div>
  );
}
