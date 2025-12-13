"use client";

import CommunityPanel from "@/components/community/CommunityPanel";
import MentorToolkit from "./components/MentorToolkit";

const queue = [1, 2, 3];

export default function MentorDashboard() {
  return (
    <div className="space-y-10">
      <MentorToolkit />

      <section className="rounded-[2.5rem] p-10 bg-[#FFF8F6] shadow-[0_25px_70px_rgba(192,153,170,0.3)]">
        <p className="text-xs uppercase tracking-[0.45em] text-[#C8A1B4]">Mentor Studio</p>
        <h2 className="text-4xl font-serif mt-2">Your Members Today</h2>
        <p className="mt-3 text-[#3E2F35]/70">
          Insight, rhythm, and gentle guidance for each parent you support.
        </p>
      </section>

      <section>
        <h3 className="uppercase text-xs tracking-[0.4em] text-[#C8A1B4] mb-3">Member Queue</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {queue.map((i) => (
            <div
              key={i}
              className="rounded-3xl p-6 bg-white/80 shadow-[0_20px_60px_rgba(180,143,164,0.25)]"
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
