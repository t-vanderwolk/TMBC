"use client";

import { useEffect, useState } from "react";

type Task = {
  title: string;
  due: string;
};

export default function MentorTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return (window.location.href = "/login");
    const parsed = JSON.parse(stored);
    const role = String(parsed.role ?? "").toLowerCase();
    if (role !== "mentor") return (window.location.href = "/dashboard");

    setTasks([
      { title: "Review Ava's Journal", due: "Tonight" },
      { title: "Send nursery palette follow-up", due: "Tomorrow" },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-[#3E2F35]">Tasks</h1>

      <div className="rounded-2xl bg-white p-6 border border-[#E6D4D8] shadow">
        {tasks.map((t, i) => (
          <div key={i} className="py-3 border-b border-[#f1e6ea]">
            <p className="font-semibold text-[#3E2F35]">{t.title}</p>
            <p className="text-sm text-[#C8A1B4]">Due: {t.due}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
