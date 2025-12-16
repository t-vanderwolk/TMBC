"use client";

import CommunityPanel from "@/components/community/CommunityPanel";
import MentorToolkit from "./components/MentorToolkit";

const queue = [1, 2, 3];

export default function MentorDashboard() {
  return (
    <div className="space-y-10">
      <MentorToolkit />

      <section className="rounded-2xl border border-[#E3D1DA] bg-[#FFF8F6] p-6 shadow-sm md:p-8">
        <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Mentor Studio</p>
        <h2 className="mt-2 text-3xl font-serif text-[#3E2F35] md:text-4xl">Your Members Today</h2>
        <p className="mt-3 text-sm text-[#3E2F35]/70 md:text-base">
          Insight, rhythm, and gentle guidance for each parent you support.
        </p>
      </section>

      <section>
        <h3 className="uppercase text-xs tracking-[0.4em] text-[#C8A1B4] mb-3">Member Queue</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {queue.map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#E3D1DA] bg-white/80 p-6 shadow-sm"
            >
              <h4 className="text-lg font-serif text-[#3E2F35]">Member #{i}</h4>
              <p className="text-sm text-[#3E2F35]/70 mt-1">
                Needs a registry check-in and module approval.
              </p>
              <a
                href="/dashboard/mentor/members"
                className="mt-3 inline-block text-xs uppercase tracking-[0.3em] text-[#3E2F35]"
              >
                Open →
              </a>
            </div>
          ))}
        </div>
        <CommunityPanel
          title="Mentor Lounge"
          copy="Share wins with peers and exchange mentorship prompts."
          href="/dashboard/member/community"
          cta="Browse rooms"
        />
      </section>
    </div>
  );
}
