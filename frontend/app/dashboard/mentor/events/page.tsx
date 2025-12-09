"use client";

import { useEffect, useState } from "react";
import { useRequireRole } from "@/lib/auth/useRequireRole";

type MentorEvent = {
  title: string;
  date: string;
};

export default function MentorEvents() {
  useRequireRole("MENTOR");
  const [events, setEvents] = useState<MentorEvent[]>([]);

  useEffect(() => {
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
