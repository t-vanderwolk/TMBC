"use client";

import { useEffect, useState } from "react";
import DashboardHero from "@/components/dashboard/DashboardHero";
import ProgressFlower from "@/components/dashboard/ProgressFlower";
import TaskCard from "@/components/dashboard/TaskCard";
import { api } from "@/lib/api";

export default function MemberDashboard() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState({ completed: 0, total: 12 });

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }

    (async () => {
      try {
        const res = await api.get("/api/academy/progress");
        if (res?.data) {
          setProgress(res.data);
        }
      } catch {
        /* intentionally silent */
      }
    })();
  }, []);

  if (!user) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <main className="p-10 space-y-10 text-[#3E2F35]">
      <DashboardHero name={user.name || "friend"} />

      <section className="flex justify-center">
        <ProgressFlower completed={progress.completed} total={progress.total} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#3E2F35]">Your Journey Today</h2>

        <div className="grid gap-5 md:grid-cols-3">
          <TaskCard
            title="Next Academy Module"
            description="Pick up right where you left off — one calm step at a time."
            onClick={() => {
              window.location.href = "/dashboard/learn";
            }}
          />

          <TaskCard
            title="Registry Snapshot"
            description="Finish your top 3 essentials curated just for you."
            onClick={() => {
              window.location.href = "/dashboard/registry";
            }}
          />

          <TaskCard
            title="Message Your Mentor"
            description="Your mentor left you a warm note. Continue the conversation."
            onClick={() => {
              window.location.href = "/dashboard/mentor";
            }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[#3E2F35]">Your Community</h2>

        <TaskCard
          title="Join a Discussion Room"
          description="Hop into conversations curated for your stage and style."
          onClick={() => {
            window.location.href = "/dashboard/community";
          }}
        />

        <TaskCard
          title="Vote in This Week’s Poll"
          description="Your voice shapes the community experience."
          onClick={() => {
            window.location.href = "/dashboard/community/polls";
          }}
        />
      </section>
    </main>
  );
}
