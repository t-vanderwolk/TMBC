"use client";

import { useEffect, useState } from "react";

type MentorEvent = {
  title: string;
  date: string;
};

export default function MentorEvents() {
  const [events, setEvents] = useState<MentorEvent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("tm_user");
    if (!stored) return (window.location.href = "/login");
    const parsed = JSON.parse(stored);
    const role = String(parsed.role ?? "").toLowerCase();
    if (role !== "mentor") return (window.location.href = "/dashboard");

    setEvents([
      { title: "Trimester Circle", date: "Thursday 7pm" },
      { title: "Registry Workshop", date: "Saturday 12pm" },
    ]);
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-[#3E2F35]">Events</h1>

      <div className="rounded-2xl bg-white p-6 border border-[#E6D4D8] shadow">
        {events.map((e, i) => (
          <div key={i} className="border-b py-3 border-[#f0e4e7]">
            <p className="font-semibold text-[#3E2F35]">{e.title}</p>
            <p className="text-sm text-[#C8A1B4]">{e.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
